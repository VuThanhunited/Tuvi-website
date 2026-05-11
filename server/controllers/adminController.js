import User from '../models/User.js';
import TuViResult from '../models/TuViResult.js';

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
    const [totalUsers, totalMasters, totalLaSo, activeUsers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'master' }),
      TuViResult.countDocuments(),
      User.countDocuments({ isActive: true }),
    ]);

    // Users registered this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalMasters,
        totalLaSo,
        activeUsers,
        newUsersThisMonth,
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
