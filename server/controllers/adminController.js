import User from '../models/User.js';
import TuViResult from '../models/TuViResult.js';
import Discussion from '../models/Discussion.js';
import Interpretation from '../models/Interpretation.js';
import { generateLaSo } from 'tuvi-neo';
import scraperService from '../services/scraperService.js';

/**
 * @desc    Lấy danh sách users (có phân trang, lọc)
 * @route   GET /api/admin/users
 * @access  Admin only
 */
export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, search, isActive } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { hoTen: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cập nhật role user
 * @route   PUT /api/admin/users/:id/role
 * @access  Admin only
 */
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin', 'master'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role không hợp lệ. Chỉ chấp nhận: user, admin, master.',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user.',
      });
    }

    res.status(200).json({
      success: true,
      message: `Đã cập nhật role thành "${role}" cho ${user.hoTen}.`,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Khóa/Mở khóa user
 * @route   PUT /api/admin/users/:id/toggle-active
 * @access  Admin only
 */
export const toggleUserActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user.',
      });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Không thể khóa tài khoản của chính mình.',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: user.isActive ? `Đã mở khóa ${user.hoTen}.` : `Đã khóa ${user.hoTen}.`,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Thống kê tổng quan
 * @route   GET /api/admin/stats
 * @access  Admin only
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalMasters, totalLaSo, activeUsers, totalDiscussions, totalInterpretations] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'master' }),
      TuViResult.countDocuments(),
      User.countDocuments({ isActive: true }),
      Discussion.countDocuments(),
      Interpretation.countDocuments(),
    ]);

    // Users registered this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    // Lá số mới trong tháng này
    const newLaSoThisMonth = await TuViResult.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    // Recent activity - 5 lá số mới nhất
    const recentLaSo = await TuViResult.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('hoTen gioiTinh createdAt');

    // Recent users - 5 users mới nhất
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('hoTen email role createdAt');

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalMasters,
        totalLaSo,
        activeUsers,
        newUsersThisMonth,
        newLaSoThisMonth,
        totalDiscussions,
        totalInterpretations,
        recentLaSo,
        recentUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cấp credits cho user
 * @route   PUT /api/admin/users/:id/credits
 * @access  Admin only
 */
export const addCredits = async (req, res, next) => {
  try {
    const { credits } = req.body;

    if (!credits || credits <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Số credits phải lớn hơn 0.',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $inc: { credits } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user.',
      });
    }

    res.status(200).json({
      success: true,
      message: `Đã cấp ${credits} credits cho ${user.hoTen}. Tổng: ${user.credits}.`,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cào dữ liệu diễn đàn tử vi
 * @route   POST /api/admin/crawl-forum
 * @access  Admin only
 */
export const crawlForum = async (req, res, next) => {
  try {
    const result = await scraperService.runCrawl();
    res.status(200).json({
      success: true,
      message: 'Cào dữ liệu diễn đàn hoàn tất!',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Nhập thủ công bài viết từ Facebook
 * @route   POST /api/admin/import-facebook-post
 * @access  Admin only
 */
export const importFacebookPost = async (req, res, next) => {
  try {
    const { title, content, author, imageUrl, originalUrl, likesCount, commentsCount } = req.body;
    if (!content && !title) {
      return res.status(400).json({ success: false, message: 'Cần có nội dung hoặc tiêu đề bài viết.' });
    }
    const postData = scraperService.buildManualFacebookPost({
      title, content, author, imageUrl, originalUrl, likesCount, commentsCount
    });
    // Check duplicate by originalUrl
    if (originalUrl) {
      const exists = await Discussion.findOne({ originalUrl });
      if (exists) {
        return res.status(409).json({ success: false, message: 'Bài viết này đã được nhập trước đó rồi.' });
      }
    }
    const discussion = await Discussion.create(postData);
    res.status(201).json({
      success: true,
      message: 'Nhập bài viết Facebook thành công!',
      data: discussion
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Kéo bài viết từ trang Facebook qua Graph API
 * @route   POST /api/admin/fetch-facebook-page
 * @access  Admin only
 */
export const fetchFacebookPage = async (req, res, next) => {
  try {
    const { pageId, accessToken, limit } = req.body;
    if (!pageId || !accessToken) {
      return res.status(400).json({ success: false, message: 'Cần có Page ID và Access Token.' });
    }
    const posts = await scraperService.fetchFacebookPagePosts(pageId, accessToken, limit || 10);
    let savedCount = 0;
    let skippedCount = 0;
    for (const post of posts) {
      const exists = await Discussion.findOne({
        $or: [
          { facebookPostId: post.facebookPostId },
          { originalUrl: post.originalUrl }
        ]
      });
      if (!exists) {
        await Discussion.create(post);
        savedCount++;
      } else {
        skippedCount++;
      }
    }
    res.status(200).json({
      success: true,
      message: `Kéo thành công! Đã lưu ${savedCount} bài mới, bỏ qua ${skippedCount} bài trùng.`,
      data: { totalFetched: posts.length, savedCount, skippedCount }
    });
  } catch (error) {
    // Pass specific Facebook API error message
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Lấy danh sách bài viết Facebook đã nhập
 * @route   GET /api/admin/facebook-posts
 * @access  Admin only
 */
export const getFacebookPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const filter = { source: 'facebook' };
    const [posts, total] = await Promise.all([
      Discussion.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Discussion.countDocuments(filter),
    ]);
    res.status(200).json({
      success: true,
      data: posts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Xóa bài viết Facebook
 * @route   DELETE /api/admin/facebook-posts/:id
 * @access  Admin only
 */
export const deleteFacebookPost = async (req, res, next) => {
  try {
    const post = await Discussion.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết.' });
    res.status(200).json({ success: true, message: 'Đã xóa bài viết.' });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────
// LẬP LÁ SỐ
// ─────────────────────────────────────────────────────────

const THIEN_CAN = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
const DIA_CHI   = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
const DC_HANH = ['Thủy','Thổ','Mộc','Mộc','Thổ','Hỏa','Hỏa','Thổ','Kim','Kim','Thổ','Thủy'];
const HANH_COLOR = { Kim: '#9e9e9e', Mộc: '#2E8B57', Thủy: '#1565C0', Hỏa: '#c62828', Thổ: '#DAA520' };
const NAP_AM_MAP = {
  'Giáp Tý':'Hải Trung Kim','Ất Sửu':'Hải Trung Kim','Bính Dần':'Là Trung Hỏa','Đinh Mão':'Là Trung Hỏa','Mậu Thìn':'Đại Lâm Mộc','Kỷ Tỵ':'Đại Lâm Mộc','Canh Ngọ':'Lộ Bàng Thổ','Tân Mùi':'Lộ Bàng Thổ','Nhâm Thân':'Kiếm Phong Kim','Quý Dậu':'Kiếm Phong Kim',
  'Giáp Tuất':'Sơn Đầu Hỏa','Ất Hợi':'Sơn Đầu Hỏa','Bính Tý':'Giản Hạ Thủy','Đinh Sửu':'Giản Hạ Thủy','Mậu Dần':'Thành Đầu Thổ','Kỷ Mão':'Thành Đầu Thổ','Canh Thìn':'Bạch Lạp Kim','Tân Tỵ':'Bạch Lạp Kim','Nhâm Ngọ':'Dương Liễu Mộc','Quý Mùi':'Dương Liễu Mộc',
  'Giáp Thân':'Tuyền Trung Thủy','Ất Dậu':'Tuyền Trung Thủy','Bính Tuất':'Ốc Thượng Thổ','Đinh Hợi':'Ốc Thượng Thổ','Mậu Tý':'Tích Lịch Hỏa','Kỷ Sửu':'Tích Lịch Hỏa','Canh Dần':'Tùng Bách Mộc','Tân Mão':'Tùng Bách Mộc','Nhâm Thìn':'Trường Lưu Thủy','Quý Tỵ':'Trường Lưu Thủy',
  'Giáp Ngọ':'Sa Trung Kim','Ất Mùi':'Sa Trung Kim','Bính Thân':'Sơn Hạ Hỏa','Đinh Dậu':'Sơn Hạ Hỏa','Mậu Tuất':'Bình Địa Mộc','Kỷ Hợi':'Bình Địa Mộc','Canh Tý':'Bích Thượng Thổ','Tân Sửu':'Bích Thượng Thổ','Nhâm Dần':'Kim Bạch Kim','Quý Mão':'Kim Bạch Kim',
  'Giáp Thìn':'Phú Đăng Hỏa','Ất Tỵ':'Phú Đăng Hỏa','Bính Ngọ':'Sa Trung Thổ','Đinh Mùi':'Sa Trung Thổ','Mậu Thân':'Đại Trạch Thổ','Kỷ Dậu':'Đại Trạch Thổ','Canh Tuất':'Thoa Xuyến Kim','Tân Hợi':'Thoa Xuyến Kim','Nhâm Tý':'Tang Đố Mộc','Quý Sửu':'Tang Đố Mộc',
  'Giáp Dần':'Đại Khê Thủy','Ất Mão':'Đại Khê Thủy','Bính Thìn':'Sa Trung Thổ','Đinh Tỵ':'Sa Trung Thổ','Mậu Ngọ':'Thiên Thượng Hỏa','Kỷ Mùi':'Thiên Thượng Hỏa','Canh Thân':'Thạch Lựu Mộc','Tân Dậu':'Thạch Lựu Mộc','Nhâm Tuất':'Đại Hải Thủy','Quý Hợi':'Đại Hải Thủy'
};

const GIO_TO_HOUR_ADMIN = {
  'Tý':0,'Sửu':2,'Dần':4,'Mão':6,'Thìn':8,'Tỵ':10,'Ngọ':12,'Mùi':14,'Thân':16,'Dậu':18,'Tuất':20,'Hợi':22
};

/**
 * @desc    Lập lá số tử vi (Admin tự nhập thông tin)
 * @route   POST /api/admin/lap-la-so
 * @access  Admin only
 */
export const adminCreateLaSo = async (req, res, next) => {
  try {
    const { hoTen, gioiTinh, ngaySinh, thangSinh, namSinh, gioSinh, isLunar, namXem, saveToDb } = req.body;

    // Validate
    if (!hoTen || !gioiTinh || !ngaySinh || !thangSinh || !namSinh || !gioSinh) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đủ thông tin: họ tên, giới tính, ngày/tháng/năm sinh, giờ sinh.' });
    }

    const currentYear = namXem || new Date().getFullYear();
    const hourValue = GIO_TO_HOUR_ADMIN[gioSinh] ?? 0;

    // Generate lá số using tuvi-neo library
    const laSoRaw = generateLaSo({
      birthYear: parseInt(namSinh),
      birthMonth: parseInt(thangSinh),
      birthDay: parseInt(ngaySinh),
      birthHour: hourValue,
      gender: gioiTinh === 'nam' ? 1 : 0,
      isLunar: isLunar || false,
      currentYear,
    });

    // Build can chi
    const tcIdx = ((namSinh - 4) % 10 + 10) % 10;
    const dcIdx = ((namSinh - 4) % 12 + 12) % 12;
    const canChiNam = `${THIEN_CAN[tcIdx]} ${DIA_CHI[dcIdx]}`;
    const napAm = NAP_AM_MAP[canChiNam] || '';
    const nguHanhStr = napAm.includes('Kim') ? 'Kim' : napAm.includes('Thủy') ? 'Thủy' : napAm.includes('Hỏa') ? 'Hỏa' : napAm.includes('Thổ') ? 'Thổ' : 'Mộc';

    const resultData = {
      hoTen,
      gioiTinh,
      ngaySinh: parseInt(ngaySinh),
      thangSinh: parseInt(thangSinh),
      namSinh: parseInt(namSinh),
      gioSinh,
      isLunar: isLunar || false,
      namXem: currentYear,
      canChi: canChiNam,
      thienCan: THIEN_CAN[tcIdx],
      diaChi: DIA_CHI[dcIdx],
      napAm,
      nguHanh: nguHanhStr,
      nguHanhColor: HANH_COLOR[nguHanhStr] || '#DAA520',
      cungResults: laSoRaw?.cungResults || [],
      advice: laSoRaw?.advice || [],
      overallRating: laSoRaw?.overallRating || 3,
      cuc: laSoRaw?.cuc,
      chuMenh: laSoRaw?.chuMenh,
      chuThan: laSoRaw?.chuThan,
      amDuong: laSoRaw?.amDuong,
    };

    let savedResult = null;
    if (saveToDb) {
      savedResult = await TuViResult.create(resultData);
    }

    res.status(200).json({
      success: true,
      message: `Đã lập lá số cho ${hoTen}!${saveToDb ? ' Đã lưu vào CSDL.' : ''}`,
      data: savedResult || resultData
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy danh sách lá số đã lưu
 * @route   GET /api/admin/la-so-list
 * @access  Admin only
 */
export const getLaSoList = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const filter = search ? { hoTen: { $regex: search, $options: 'i' } } : {};
    const [list, total] = await Promise.all([
      TuViResult.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
        .select('hoTen gioiTinh ngaySinh thangSinh namSinh gioSinh canChi napAm nguHanh overallRating createdAt'),
      TuViResult.countDocuments(filter),
    ]);
    res.status(200).json({
      success: true,
      data: list,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Xóa lá số
 * @route   DELETE /api/admin/la-so/:id
 * @access  Admin only
 */
export const deleteLaSo = async (req, res, next) => {
  try {
    const record = await TuViResult.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Không tìm thấy lá số.' });
    res.status(200).json({ success: true, message: 'Đã xóa lá số.' });
  } catch (error) {
    next(error);
  }
};
