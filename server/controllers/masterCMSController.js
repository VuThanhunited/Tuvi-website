import MasterProfile from '../models/MasterProfile.js';
import User from '../models/User.js';

/**
 * @desc    Lấy danh sách tất cả master profiles (cho admin)
 * @route   GET /api/admin/masters
 */
export const getMasterProfiles = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (search) {
      filter.fullName = { $regex: search, $options: 'i' };
    }

    const masters = await MasterProfile.find(filter).populate('userId', 'email hoTen');
    
    res.status(200).json({
      success: true,
      data: masters
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy chi tiết master profile
 * @route   GET /api/admin/masters/:id
 */
export const getMasterProfile = async (req, res, next) => {
  try {
    const master = await MasterProfile.findById(req.params.id).populate('userId', 'email hoTen');
    
    if (!master) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy profile.' });
    }

    res.status(200).json({
      success: true,
      data: master
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Tạo mới master profile
 * @route   POST /api/admin/masters
 */
export const createMasterProfile = async (req, res, next) => {
  try {
    const { 
      fullName, 
      profileDescription, 
      trustScore, 
      rank, 
      status, 
      expertise,
      avatar 
    } = req.body;

    const master = await MasterProfile.create({
      fullName,
      profileDescription,
      trustScore: trustScore || 50,
      rank: rank || 'Hạng C',
      status: status || 'CRAWLED_PENDING',
      expertise: expertise || [],
      avatar: avatar || ''
    });

    res.status(201).json({
      success: true,
      message: 'Tạo mới thành công.',
      data: master
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cập nhật master profile (Hồ sơ, Điểm, Hạng, Trạng thái)
 * @route   PUT /api/admin/masters/:id
 */
export const updateMasterProfile = async (req, res, next) => {
  try {
    const { 
      fullName, 
      profileDescription, 
      trustScore, 
      rank, 
      status, 
      expertise,
      avatar 
    } = req.body;

    const master = await MasterProfile.findById(req.params.id);

    if (!master) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy profile.' });
    }

    // Cập nhật các trường
    if (fullName) master.fullName = fullName;
    if (profileDescription !== undefined) master.profileDescription = profileDescription;
    if (trustScore !== undefined) master.trustScore = trustScore;
    if (rank) master.rank = rank;
    if (status) master.status = status;
    if (expertise) master.expertise = expertise;
    if (avatar) master.avatar = avatar;

    await master.save();

    res.status(200).json({
      success: true,
      message: 'Cập nhật thành công.',
      data: master
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload ảnh cho trình soạn thảo
 * @route   POST /api/admin/masters/upload-image
 */
export const uploadMasterImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn file.' });
    }

    // Trả về URL của ảnh (giả sử đã được multer lưu vào public/uploads)
    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      url: url
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Xóa profile (hoặc chuyển vào ARCHIVED)
 */
export const deleteMasterProfile = async (req, res, next) => {
  try {
    const master = await MasterProfile.findByIdAndDelete(req.params.id);
    
    if (!master) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy profile.' });
    }

    res.status(200).json({
      success: true,
      message: 'Đã xóa profile.'
    });
  } catch (error) {
    next(error);
  }
};
