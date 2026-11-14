import User from '../models/User.js';
import TuViResult from '../models/TuViResult.js';
import Discussion from '../models/Discussion.js';
import Interpretation from '../models/Interpretation.js';
import TuViDatabase from '../models/TuViDatabase.js';
import ScheduledPost from '../models/ScheduledPost.js';
import { generateLaSo } from 'tuvi-neo';
import scraperService from '../services/scraperService.js';
import { postToFacebook, getFBPageInfo, getFBPagesFromUserToken } from '../services/facebookPostService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

/**
 * @desc    Cập nhật bài viết Facebook
 * @route   PUT /api/admin/facebook-posts/:id
 * @access  Admin only
 */
export const updateFacebookPost = async (req, res, next) => {
  try {
    const { title, content, author, imageUrl, originalUrl, likesCount, commentsCount } = req.body;
    const post = await Discussion.findByIdAndUpdate(
      req.params.id,
      { title, content, author, imageUrl, originalUrl, likesCount, commentsCount },
      { new: true, runValidators: true }
    );
    if (!post) return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết.' });
    res.status(200).json({ success: true, message: 'Đã cập nhật bài viết.', data: post });
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

/**
 * @desc    Cập nhật thông tin lá số đã lưu
 * @route   PUT /api/admin/la-so/:id
 * @access  Admin only
 */
export const updateLaSo = async (req, res, next) => {
  try {
    const { hoTen, gioiTinh, ngaySinh, thangSinh, namSinh, gioSinh, isLunar } = req.body;
    const record = await TuViResult.findByIdAndUpdate(
      req.params.id,
      { hoTen, gioiTinh, ngaySinh, thangSinh, namSinh, gioSinh, isLunar },
      { new: true, runValidators: true }
    );
    if (!record) return res.status(404).json({ success: false, message: 'Không tìm thấy lá số.' });
    res.status(200).json({ success: true, message: 'Đã cập nhật thông tin lá số.', data: record });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Kiểm tra trạng thái TuViDatabase (con giáp, luận giải)
 * @route   GET /api/admin/database-status
 * @access  Admin only
 */
export const getDatabaseStatus = async (req, res, next) => {
  try {
    const [tuViDbDoc, interpretationCount, tuViResultCount] = await Promise.all([
      TuViDatabase.findOne().select('metadata con_giap').lean(),
      Interpretation.countDocuments(),
      TuViResult.countDocuments(),
    ]);

    const conGiapCount = tuViDbDoc?.con_giap?.length || 0;

    res.status(200).json({
      success: true,
      data: {
        tuViDatabase: {
          exists: !!tuViDbDoc,
          conGiapCount,
          metadata: tuViDbDoc?.metadata || null,
          status: conGiapCount >= 12 ? 'Đầy đủ (12 con giáp)' : conGiapCount > 0 ? `Chưa đủ (${conGiapCount}/12 con giáp)` : 'Chưa có dữ liệu',
        },
        interpretation: {
          count: interpretationCount,
          status: interpretationCount > 0 ? `Có ${interpretationCount} luận giải` : 'Chưa có dữ liệu',
        },
        tuViResult: {
          count: tuViResultCount,
          status: `Có ${tuViResultCount} lá số đã lập`,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Import dữ liệu TuViDatabase từ file JSON (tuvi_database.json)
 * @route   POST /api/admin/import-tuvi-database
 * @access  Admin only
 */
export const importTuViDatabase = async (req, res, next) => {
  try {
    // Đọc file tuvi_database.json từ server
    const jsonPath = path.join(__dirname, '..', 'tuvi_database.json');

    if (!fs.existsSync(jsonPath)) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy file tuvi_database.json trên server.',
      });
    }

    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(rawData);

    // Chuẩn hóa key tiếng Việt → ASCII
    if (data.con_giap) {
      data.con_giap = data.con_giap.map(item => {
        if (item.su_nghiep?.luận_giải) {
          item.su_nghiep.luan_giai = item.su_nghiep.luận_giải;
          delete item.su_nghiep.luận_giải;
        }
        if (item.tinh_cam?.luận_giải) {
          item.tinh_cam.luan_giai = item.tinh_cam.luận_giải;
          delete item.tinh_cam.luận_giải;
        }
        if (item.van_han_theo_thang) {
          item.van_han_theo_thang = item.van_han_theo_thang.map(th => {
            if (th.luận) { th.luan = th.luận; delete th.luận; }
            return th;
          });
        }
        return item;
      });
    }

    // Xóa dữ liệu cũ và import mới
    await TuViDatabase.deleteMany({});
    await TuViDatabase.create(data);

    const conGiapCount = data.con_giap?.length || 0;

    res.status(200).json({
      success: true,
      message: `✅ Import thành công TuViDatabase! Đã nhập ${conGiapCount} con giáp vào database.`,
      data: { conGiapCount, metadata: data.metadata },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Seed dữ liệu luận giải mẫu vào collection Interpretation
 * @route   POST /api/admin/seed-interpretations
 * @access  Admin only
 */
export const seedInterpretationData = async (req, res, next) => {
  try {
    const { clearExisting = false } = req.body;

    if (clearExisting) {
      await Interpretation.deleteMany({});
    }

    // Kiểm tra đã có dữ liệu chưa
    const existingCount = await Interpretation.countDocuments();
    const boSaoCount = await Interpretation.countDocuments({ type: 'bo_sao_phoi' });
    if (existingCount > 0 && !clearExisting && boSaoCount > 0) {
      return res.status(200).json({
        success: true,
        message: `Collection Interpretation đã có ${existingCount} luận giải (gồm ${boSaoCount} bộ sao phối). Dùng clearExisting=true để xóa và seed lại.`,
        data: { existingCount, boSaoCount, seeded: 0 },
      });
    }

    const adminId = req.user._id;

    const sampleData = [
      // ── Ý nghĩa 12 Cung ──
      { type: 'cung', cung: 'Mệnh', content: 'Cung Mệnh là cung vị chủ chốt của cả lá số, đại diện cho tính cách, dung mạo, tài năng thiên phú, khí chất bẩm sinh và vận mệnh tổng quan của một đời người. Mệnh tốt thì gốc rễ vững chắc, vượt qua tai ương dễ dàng.', source: 'Tử Vi Đẩu Số Tân Biên', createdBy: adminId },
      { type: 'cung', cung: 'Phụ Mẫu', content: 'Cung Phụ Mẫu phản ánh mối quan hệ cha mẹ, phúc phần từ gia tộc, cùng khả năng học hành, thi cử và tài trí của mệnh tạo. Cung tốt chủ cha mẹ hiền hòa, phúc dày, học hành hanh thông.', source: 'Tử Vi Đẩu Số Tân Biên', createdBy: adminId },
      { type: 'cung', cung: 'Phúc Đức', content: 'Cung Phúc Đức chủ về phúc ấm tổ tiên, đức tích lũy qua nhiều đời, tâm tính thiện ác và mức độ an nhàn trong cuộc sống. Cung tốt chủ cuộc sống bình yên, tâm tính lương thiện, ít lo âu.', source: 'Trung Châu Tử Vi', createdBy: adminId },
      { type: 'cung', cung: 'Điền Trạch', content: 'Cung Điền Trạch chủ về bất động sản, nhà ở, đất đai, tài sản cố định và môi trường sống. Cung tốt chủ nhà cửa rộng rãi, nhiều bất động sản, điều kiện ở tốt, không lo chốn nương thân.', source: 'Trung Châu Tử Vi', createdBy: adminId },
      { type: 'cung', cung: 'Quan Lộc', content: 'Cung Quan Lộc đại diện cho con đường sự nghiệp, ngành nghề thích hợp, vị trí xã hội, năng lực làm việc và mức độ thành bại trong công danh. Cho biết đương số có số làm quan hay làm chủ.', source: 'Trung Châu Tử Vi', createdBy: adminId },
      { type: 'cung', cung: 'Nô Bộc', content: 'Cung Nô Bộc chủ về bạn bè, đồng nghiệp, nhân viên và người làm công. Phản ánh mối quan hệ xã hội rộng hay hẹp, có quý nhân hay bị tiểu nhân hãm hại. Cung tốt chủ nhiều bạn bè tốt, có người giúp đỡ.', source: 'Tử Vi Đẩu Số Tân Biên', createdBy: adminId },
      { type: 'cung', cung: 'Thiên Di', content: 'Cung Thiên Di chủ về sự dịch chuyển, đi xa, xuất ngoại, môi trường bên ngoài và khả năng thích nghi. Cung tốt chủ đi xa phát tài, ra ngoài gặp quý nhân, thích hợp làm việc ở xa nhà.', source: 'Vân Đằng Thái Thứ Lang', createdBy: adminId },
      { type: 'cung', cung: 'Tật Ách', content: 'Cung Tật Ách chủ về sức khỏe thể chất, bệnh tật, khí chất bên trong và tính tình. Cung tốt chủ ít đau ốm, thể chất khỏe mạnh, tuổi thọ dài lâu. Cung xấu cần chú ý sức khỏe.', source: 'Tử Vi Đẩu Số Tân Biên', createdBy: adminId },
      { type: 'cung', cung: 'Tài Bạch', content: 'Cung Tài Bạch chủ về phương thức kiếm tiền, năng lực tài chính, mức độ giàu nghèo và thái độ đối với tiền bạc của mệnh tạo. Cho biết tiền bạc tụ hay tán, đắc tài trong hoàn cảnh nào.', source: 'Trung Châu Tử Vi', createdBy: adminId },
      { type: 'cung', cung: 'Tử Tức', content: 'Cung Tử Tức chủ về con cái, học trò, cấp dưới, và khả năng sáng tạo. Phản ánh số lượng con, mối quan hệ với con cái và sự thành đạt của con. Cung tốt chủ con đông, ngoan ngoãn, thành đạt.', source: 'Trung Châu Tử Vi', createdBy: adminId },
      { type: 'cung', cung: 'Phu Thê', content: 'Cung Phu Thê phản ánh nhân duyên, xu hướng lựa chọn bạn đời, tính cách và hoàn cảnh gia thế của người phối ngẫu, đồng thời cho biết mối quan hệ tình cảm vợ chồng có hòa hợp, hạnh phúc hay xung đột trắc trở.', source: 'Tử Vi Đẩu Số Tân Biên', createdBy: adminId },
      { type: 'cung', cung: 'Huynh Đệ', content: 'Cung Huynh Đệ chủ về anh em, bạn đồng hành, đồng nghiệp thân thiết và mối quan hệ huynh đệ nghĩa tình. Cung tốt chủ anh em hòa thuận, có người giúp đỡ lúc khó khăn.', source: 'Tử Vi Đẩu Số Tân Biên', createdBy: adminId },
      // ── Sao chính tại Mệnh ──
      { type: 'sao_cung', sao: 'Tử Vi', cung: 'Mệnh', trangThai: 'M', content: 'Tử Vi miếu địa đóng mệnh là cách cục đế tinh đắc vị tối tôn tối quý. Đương số dung mạo uy nghi, trung hậu, tính tình bao dung, khí chất lãnh đạo thiên bẩm. Cuộc đời gặp nhiều quý nhân phù trợ, dễ đạt được công danh hiển hách, tài lộc dồi dào.', source: 'Vân Đằng Thái Thứ Lang', createdBy: adminId },
      { type: 'sao_cung', sao: 'Tử Vi', cung: 'Mệnh', trangThai: 'H', content: 'Tử Vi hãm địa đóng mệnh: Mặc dù mang khí chất quý nhân nhưng cuộc đời nhiều trắc trở. Hay ôm mộng lớn mà thiếu nền tảng, dễ bị người khác lợi dụng. Cần phấn đấu bền bỉ mới đạt kết quả.', source: 'Tử Vi Đẩu Số Tân Biên', createdBy: adminId },
      { type: 'sao_cung', sao: 'Thiên Cơ', cung: 'Mệnh', trangThai: 'Đ', content: 'Thiên Cơ đắc địa đóng tại cung Mệnh chủ về người thông minh, hiền hậu, đa tài, giỏi mưu lược và có óc phán đoán, phân tích sắc bén. Bạn có đầu óc sáng tạo, học một biết mười, tính tình ôn hòa nhưng tâm tính thường suy nghĩ nhiều, không mấy khi nhàn hạ.', source: 'Tử Vi Đẩu Số Vân Đằng', createdBy: adminId },
      { type: 'sao_cung', sao: 'Thái Dương', cung: 'Mệnh', trangThai: 'M', content: 'Thái Dương miếu vượng đóng Mệnh là cách quý hiển công danh. Tính tình hào phóng, bộc trực, chính trực, rộng rãi. Dễ đạt công danh trong lĩnh vực công quyền, nổi tiếng trong xã hội. Nam mệnh có Thái Dương miếu rất tốt cho sự nghiệp.', source: 'Vân Đằng Thái Thứ Lang', createdBy: adminId },
      { type: 'sao_cung', sao: 'Vũ Khúc', cung: 'Mệnh', trangThai: 'M', content: 'Vũ Khúc miếu đóng Mệnh là người cứng rắn, quyết đoán, có chí hướng mạnh mẽ. Tài hoa trong kinh doanh, lĩnh vực tài chính. Ý chí kiên cường, không bỏ cuộc trước khó khăn. Dễ tự lập thành công.', source: 'Trung Châu Tử Vi', createdBy: adminId },
      { type: 'sao_cung', sao: 'Thiên Đồng', cung: 'Mệnh', trangThai: 'M', content: 'Thiên Đồng miếu đóng Mệnh: Tính tình hiền hòa, phúc hậu, lạc quan. Cuộc sống nhìn chung an nhàn, ít phải vất vả kiếm sống. Được quý nhân yêu thương giúp đỡ. Thiên về hưởng phúc hơn là tự lập gây dựng.', source: 'Tử Vi Đẩu Số Tân Biên', createdBy: adminId },
      { type: 'sao_cung', sao: 'Liêm Trinh', cung: 'Mệnh', trangThai: 'M', content: 'Liêm Trinh miếu đóng Mệnh: Cá tính mạnh mẽ, đa tài đa nghệ, có năng khiếu nghệ thuật. Tư tưởng độc lập, không thích bị ràng buộc. Tuy nhiên đôi khi bướng bỉnh, dễ xảy ra tranh chấp. Thành công nhờ tài năng thiên bẩm.', source: 'Vân Đằng Thái Thứ Lang', createdBy: adminId },
      { type: 'sao_cung', sao: 'Thiên Phủ', cung: 'Mệnh', trangThai: 'M', content: 'Thiên Phủ miếu đóng Mệnh: Đây là người có phúc khí, khí chất cao nhã, ổn định, không thích mạo hiểm. Tích lũy tài sản bền vững theo thời gian. Vượng phu ích tử, gia đình hòa thuận. Cuộc sống an nhàn sung túc.', source: 'Đăng Hạ Thuật - Phan Tử Ngư', createdBy: adminId },
      { type: 'sao_cung', sao: 'Thái Âm', cung: 'Mệnh', trangThai: 'M', content: 'Thái Âm miếu vượng đóng Mệnh: Tâm tính nhu mỳ, tinh tế, nhạy cảm. Nữ mệnh có Thái Âm miếu là cách cục đại quý. Nam mệnh hưởng phúc qua vợ hoặc qua người phụ nữ trong cuộc đời. Thiên về nghệ thuật, thẩm mỹ, văn chương.', source: 'Tử Vi Đẩu Số Tân Biên', createdBy: adminId },
      { type: 'sao_cung', sao: 'Tham Lang', cung: 'Mệnh', trangThai: 'M', content: 'Tham Lang miếu đóng Mệnh: Đa tài đa nghệ, ham học hỏi, thích giao du rộng. Có tài ăn nói, dễ kết bạn. Cuộc đời nhiều may mắn bất ngờ, đặc biệt ở trung vận trở đi. Thích hưởng thụ và có thể giỏi nghệ thuật.', source: 'Vân Đằng Thái Thứ Lang', createdBy: adminId },
      { type: 'sao_cung', sao: 'Cự Môn', cung: 'Mệnh', trangThai: 'M', content: 'Cự Môn miếu đóng Mệnh: Trí tuệ sắc sảo, ăn nói lưu loát, có tài biện luận. Thành công trong lĩnh vực ngôn ngữ, pháp luật, giáo dục. Cuộc đời hay gặp thị phi nhưng nếu biết dùng lời nói đúng chỗ sẽ hóa giải được.', source: 'Trung Châu Tử Vi', createdBy: adminId },
      { type: 'sao_cung', sao: 'Thiên Tướng', cung: 'Mệnh', trangThai: 'M', content: 'Thiên Tướng miếu đóng Mệnh: Tính tình cẩn trọng, trung thực, thích giúp đỡ người khác. Có khả năng quản lý tổ chức tốt. Thành công khi đứng sau hỗ trợ người có tài năng. Cuộc sống ổn định, ít biến động lớn.', source: 'Tử Vi Đẩu Số Tân Biên', createdBy: adminId },
      { type: 'sao_cung', sao: 'Thiên Lương', cung: 'Mệnh', trangThai: 'M', content: 'Thiên Lương miếu đóng Mệnh: Lương thiện, hiếu thảo, có đức hạnh. Thích làm công tác xã hội, y tế, giáo dục. Gặp dữ hóa lành, tai qua nạn khỏi. Được người lớn tuổi, bề trên yêu quý và giúp đỡ.', source: 'Vân Đằng Thái Thứ Lang', createdBy: adminId },
      { type: 'sao_cung', sao: 'Thất Sát', cung: 'Mệnh', trangThai: 'M', content: 'Thất Sát miếu đóng Mệnh: Khí chất mạnh mẽ, dũng cảm, quyết đoán. Phù hợp với nghề nghiệp đòi hỏi sức mạnh, quyền lực, quân sự, cảnh sát. Dễ thành công trong cuộc đời nhờ ý chí kiên định và dám nghĩ dám làm.', source: 'Trung Châu Tử Vi', createdBy: adminId },
      { type: 'sao_cung', sao: 'Phá Quân', cung: 'Mệnh', trangThai: 'M', content: 'Phá Quân miếu đóng Mệnh: Tính cách đột phá, không ngại thay đổi, dám phá vỡ cái cũ. Phù hợp với sự nghiệp đổi mới, cải cách. Cuộc đời nhiều biến động nhưng cũng nhiều cơ hội. Thành công khi biết kiểm soát tính bốc đồng.', source: 'Vân Đằng Thái Thứ Lang', createdBy: adminId },
      // ── Hóa tinh tại Mệnh ──
      { type: 'sao_cung', sao: 'Hóa Lộc', cung: 'Mệnh', content: 'Hóa Lộc đóng tại cung Mệnh: Thiên phú tài lộc dồi dào, bản thân có khả năng thu hút tiền bạc và may mắn. Tính tình hào phóng, dễ chinh phục thiện cảm của người khác. Vận trình tài lộc tổng thể thuận lợi trong cả cuộc đời.', source: 'Tứ Hóa Phái', createdBy: adminId },
      { type: 'sao_cung', sao: 'Hóa Quyền', cung: 'Mệnh', content: 'Hóa Quyền đóng tại cung Mệnh: Bản thân có quyền uy, uy tín, khả năng lãnh đạo thiên bẩm. Tính cách mạnh mẽ, dứt khoát, có chính kiến riêng. Phù hợp với vị trí quản lý, lãnh đạo. Tuy nhiên cần tránh độc đoán.', source: 'Tứ Hóa Phái', createdBy: adminId },
      { type: 'sao_cung', sao: 'Hóa Khoa', cung: 'Mệnh', content: 'Hóa Khoa đóng tại cung Mệnh: Bản thân có thanh danh tốt, học hành đỗ đạt, được người đời kính trọng. Tính tình thanh cao, không màng danh lợi vật chất. Phù hợp với sự nghiệp học thuật, nghiên cứu, giáo dục.', source: 'Tứ Hóa Phái', createdBy: adminId },
      { type: 'sao_cung', sao: 'Hóa Kỵ', cung: 'Mệnh', content: 'Hóa Kỵ đóng tại cung Mệnh: Bản mệnh hay gặp trắc trở, thị phi, dễ bị người khác hiểu lầm. Cần cẩn trọng trong giao tiếp và các quyết định quan trọng. Vận trình cần nỗ lực nhiều hơn người khác mới đạt kết quả.', source: 'Tứ Hóa Phái', createdBy: adminId },
      // ── Sao tại Quan Lộc ──
      { type: 'sao_cung', sao: 'Hóa Lộc', cung: 'Quan Lộc', content: 'Hóa Lộc tại cung Quan Lộc chủ về sự nghiệp phát đạt, thu nhập cao từ công việc chính. Dễ được thăng chức, tăng lương. Làm chủ kinh doanh thì buôn bán thuận lợi, có nhiều cơ hội kiếm tiền từ nghề nghiệp.', source: 'Tứ Hóa Phái', createdBy: adminId },
      { type: 'sao_cung', sao: 'Hóa Kỵ', cung: 'Quan Lộc', content: 'Hóa Kỵ tại cung Quan Lộc chủ về sự nghiệp hay gặp trắc trở, thị phi ở chốn công sở. Dễ bị tiểu nhân gièm pha, khó thăng tiến. Cần làm việc cẩn thận, tránh vi phạm quy tắc và xây dựng quan hệ tốt với cấp trên.', source: 'Tứ Hóa Phái', createdBy: adminId },
      { type: 'sao_cung', sao: 'Hóa Lộc', cung: 'Phu Thê', content: 'Hóa Lộc tại cung Phu Thê chủ về mối lương duyên tốt đẹp, vợ chồng tình cảm mặn nồng thắm thiết. Người phối ngẫu là người có tài kiếm tiền, mang lại vận may tài lộc cho đương số sau khi kết hôn, gia đình sung túc thịnh vượng.', source: 'Tứ Hóa Phái', createdBy: adminId },
      { type: 'sao_cung', sao: 'Hóa Kỵ', cung: 'Tài Bạch', content: 'Hóa Kỵ tại cung Tài Bạch chủ về tiền tài dễ gặp tranh chấp, thị phi hoặc bị tiểu nhân dòm ngó. Kiếm tiền vất vả, thường phải hao tâm tổn trí. Đương số cần minh bạch trong sổ sách tài chính và tránh đầu tư mạo hiểm.', source: 'Tứ Hóa Phái', createdBy: adminId },
      { type: 'sao_cung', sao: 'Hóa Quyền', cung: 'Tử Tức', content: 'Hóa Quyền tại cung Tử Tức chủ về con cái sau này có chí hướng lớn, năng lực tự lập cao, tính cách mạnh mẽ và có thiên hướng làm lãnh đạo. Con cái có quyền uy, học hành đỗ đạt.', source: 'Tứ Hóa Phái', createdBy: adminId },
      { type: 'sao_cung', sao: 'Hóa Khoa', cung: 'Phúc Đức', content: 'Hóa Khoa đóng cung Phúc Đức là đại cát thần hóa giải tai ách. Đương số được hưởng phúc ấm tổ tiên, dòng họ nhiều người đỗ đạt, thanh danh tốt đẹp. Gặp dữ hóa lành, tâm tính lương thiện, sống an nhàn tự tại.', source: 'Trung Châu Tử Vi', createdBy: adminId },
      // ── Bộ sao Phối (Mệnh Tài Quan Di) — Quán Tử Vi ──
      {
        type: 'bo_sao_phoi',
        boSaoPhoi: 'Tử Vi + Thiên Phủ hội Tả Phù, Hữu Bật (Mệnh Tài Quan Di)',
        cungCodes: ['MENH', 'TAI_BACH', 'QUAN_LOC', 'THIEN_DI'],
        saoCodes: ['TU_VI', 'THIEN_PHU', 'TA_PHU', 'HUU_BAT'],
        content: 'Cách cục Tử Phủ đắc Tả Hữu giáp trợ trong Tam phương Tứ chính Mệnh – Tài – Quan – Di: Chủ về khí chất lãnh đạo vững vàng, có người phò tá đắc lực trên con đường công danh sự nghiệp. Tiền tài tích tụ bền vững, làm việc lớn dễ thành tựu, gặp khó khăn có quý nhân nâng đỡ.',
        source: 'Quán Tử Vi — Luận giải nâng cao',
        createdBy: adminId
      },
      {
        type: 'bo_sao_phoi',
        boSaoPhoi: 'Thái Dương + Thái Âm hội Thiên Khôi, Thiên Việt (Mệnh Tài Quan Di)',
        cungCodes: ['MENH', 'TAI_BACH', 'QUAN_LOC', 'THIEN_DI'],
        saoCodes: ['THAI_DUONG', 'THAI_AM', 'THIEN_KHOI', 'THIEN_VIET'],
        content: 'Nhật Nguyệt phối Khôi Việt trong bộ Mệnh – Tài – Quan – Di: Chủ về trí tuệ sáng suốt, học vấn uyên bác, dễ đỗ đạt hoặc giữ vị trí cao về chuyên môn, ngoại giao, quản lý. Ra ngoài có quý nhân đề bạt, danh tiếng vang xa.',
        source: 'Quán Tử Vi — Luận giải nâng cao',
        createdBy: adminId
      },
      {
        type: 'bo_sao_phoi',
        boSaoPhoi: 'Thiên Cơ + Thái Âm + Thiên Đồng + Thiên Lương (Cơ Nguyệt Đồng Lương)',
        cungCodes: ['MENH', 'TAI_BACH', 'QUAN_LOC', 'THIEN_DI'],
        saoCodes: ['THIEN_CO', 'THAI_AM', 'THIEN_DONG', 'THIEN_LUONG'],
        content: 'Cách cục Cơ Nguyệt Đồng Lương hội đủ ở Mệnh – Tài – Quan – Di: Thích hợp làm công tác tham mưu, kế hoạch, văn phòng, giáo dục, y tế hoặc công chức ổn định. Tâm tính hiền hòa, khéo léo, càng về trung hậu vận càng an nhàn sung túc.',
        source: 'Quán Tử Vi — Luận giải nâng cao',
        createdBy: adminId
      },
      {
        type: 'bo_sao_phoi',
        boSaoPhoi: 'Thất Sát + Phá Quân + Tham Lang hội Kình Dương, Đà La (Mệnh Tài Quan Di)',
        cungCodes: ['MENH', 'TAI_BACH', 'QUAN_LOC', 'THIEN_DI'],
        saoCodes: ['THAT_SAT', 'PHA_QUAN', 'THAM_LANG', 'KINH_DUONG'],
        content: 'Bộ Sát Phá Tham gặp Kình Dương kích phát trong 4 cung Mệnh – Tài – Quan – Di: Cá tính mạnh mẽ, dám nghĩ dám làm, sự nghiệp trải qua nhiều biến động lớn mới tạo dựng được cơ đồ. Cần tiết chế nóng nảy, tránh đầu tư mạo hiểm quá đà và chú ý an toàn sức khỏe khi đi xa.',
        source: 'Quán Tử Vi — Luận giải nâng cao',
        createdBy: adminId
      },
      {
        type: 'bo_sao_phoi',
        boSaoPhoi: 'Văn Xương + Văn Khúc hội Thiên Khôi (Mệnh Tài Quan Di)',
        cungCodes: ['MENH', 'TAI_BACH', 'QUAN_LOC', 'THIEN_DI'],
        saoCodes: ['VAN_XUONG', 'VAN_KHUC', 'THIEN_KHOI'],
        content: 'Xương Khúc Khôi hội chiếu Tam phương Tứ chính: Đương số có năng khiếu văn chương, ngôn ngữ, nghệ thuật và tư duy sắc sảo. Con đường học vấn, thi cử, truyền thông hoặc nghiên cứu học thuật hanh thông, dễ tạo dấu ấn cá nhân.',
        source: 'Quán Tử Vi — Luận giải nâng cao',
        createdBy: adminId
      },
      {
        type: 'bo_sao_phoi',
        boSaoPhoi: 'Địa Không + Địa Kiếp + Hỏa Tinh (Hung tinh hội Mệnh Tài Quan Di)',
        cungCodes: ['MENH', 'TAI_BACH', 'QUAN_LOC', 'THIEN_DI'],
        saoCodes: ['DIA_KHONG', 'DIA_KIEP', 'HOA_TINH'],
        content: 'Cảnh báo hung tinh Không – Kiếp – Hỏa hội tụ tại Mệnh Tài Quan Di: Tiền tài và công danh dễ lên nhanh xuống mạnh, hay gặp biến cố bất ngờ hoặc hao tán do quyết định bốc đồng. Nên giữ tâm thế thận trọng, ưu tiên tích lũy an toàn và tránh hùn hạp thiếu minh bạch.',
        source: 'Quán Tử Vi — Luận giải nâng cao',
        createdBy: adminId
      },
    ];

    const dataToInsert = (existingCount > 0 && !clearExisting && boSaoCount === 0)
      ? sampleData.filter(item => item.type === 'bo_sao_phoi')
      : sampleData;

    await Interpretation.insertMany(dataToInsert);

    res.status(200).json({
      success: true,
      message: `✅ Đã seed thành công ${dataToInsert.length} luận giải mẫu vào database!`,
      data: { seeded: dataToInsert.length, existingBefore: existingCount },
    });
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════════════════════════
//  FACEBOOK SCHEDULED POSTS
// ══════════════════════════════════════════════════════════════

/**
 * @desc    Tạo bài viết lên lịch đăng Facebook
 * @route   POST /api/admin/scheduled-posts
 * @access  Admin only
 */
export const createScheduledPost = async (req, res, next) => {
  try {
    const { content, imageUrl, scheduledAt, sourceType, sourceId } = req.body;

    if (!content || !scheduledAt) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập nội dung và thời gian đăng.' });
    }

    const scheduledDate = new Date(scheduledAt);
    if (isNaN(scheduledDate.getTime()) || scheduledDate <= new Date()) {
      return res.status(400).json({ success: false, message: 'Thời gian đăng phải là thời điểm trong tương lai.' });
    }

    const post = await ScheduledPost.create({
      content,
      imageUrl: imageUrl || '',
      scheduledAt: scheduledDate,
      sourceType: sourceType || 'custom',
      sourceId: sourceId || null,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, message: 'Đã lên lịch bài viết thành công!', data: post });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy danh sách bài viết đã lên lịch
 * @route   GET /api/admin/scheduled-posts
 * @access  Admin only
 */
export const getScheduledPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const total = await ScheduledPost.countDocuments(filter);
    const posts = await ScheduledPost.find(filter)
      .sort({ scheduledAt: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('createdBy', 'hoTen email');

    res.status(200).json({
      success: true,
      data: posts,
      pagination: { total, page: parseInt(page), totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Hủy / xóa bài viết đã lên lịch
 * @route   DELETE /api/admin/scheduled-posts/:id
 * @access  Admin only
 */
export const deleteScheduledPost = async (req, res, next) => {
  try {
    const post = await ScheduledPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết.' });

    if (post.status === 'posted') {
      return res.status(400).json({ success: false, message: 'Không thể xóa bài đã đăng lên Facebook.' });
    }

    await post.deleteOne();
    res.status(200).json({ success: true, message: 'Đã hủy lịch đăng bài viết.' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Đăng ngay lập tức (bỏ qua lịch)
 * @route   POST /api/admin/scheduled-posts/:id/post-now
 * @access  Admin only
 */
export const postNow = async (req, res, next) => {
  try {
    const post = await ScheduledPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết.' });
    if (post.status === 'posted') return res.status(400).json({ success: false, message: 'Bài này đã được đăng rồi.' });

    const { postId, postUrl } = await postToFacebook(post.content, post.imageUrl);
    await ScheduledPost.findByIdAndUpdate(post._id, {
      status: 'posted', fbPostId: postId, fbPostUrl: postUrl, postedAt: new Date(), error: '',
    });

    res.status(200).json({ success: true, message: '✅ Đã đăng bài lên Facebook thành công!', data: { postId, postUrl } });
  } catch (error) {
    const msg = error.message || 'Lỗi đăng bài lên Facebook';
    // Lưu lỗi vào post nếu có id
    if (req.params.id) {
      await ScheduledPost.findByIdAndUpdate(req.params.id, { status: 'failed', error: msg }).catch(() => {});
    }
    res.status(500).json({ success: false, message: msg });
  }
};

/**
 * @desc    Lấy thông tin Facebook Page + kiểm tra token
 * @route   GET /api/admin/fb-settings
 * @access  Admin only
 */
export const getFBSettings = async (req, res, next) => {
  try {
    const pageInfo = await getFBPageInfo();
    res.status(200).json({
      success: true,
      data: {
        pageId: process.env.FB_PAGE_ID || '',
        hasToken: !!(process.env.FB_PAGE_TOKEN),
        ...pageInfo,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Dùng User Token để lấy danh sách Facebook Pages mà user quản lý
 * @route   POST /api/admin/fb-get-pages
 * @access  Admin only
 *
 * Hướng dẫn: Admin nhập User Token (lấy dễ hơn Page Token) → hệ thống tự động
 * tìm ra tất cả Pages mà user quản lý kèm Page Token tương ứng.
 * Admin chọn Page → copy Page Token dán vào .env.
 */
export const getMyFBPages = async (req, res, next) => {
  try {
    const { userToken } = req.body;
    if (!userToken) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập User Access Token.' });
    }

    const result = await getFBPagesFromUserToken(userToken);
    res.status(200).json({
      success: true,
      message: `Tìm thấy ${result.pages.length} Facebook Page bạn quản lý.`,
      data: result.pages,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
