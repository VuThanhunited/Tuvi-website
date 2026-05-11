import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware: Xác thực JWT Token
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản không tồn tại hoặc đã bị khóa.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn.',
    });
  }
};

/**
 * Middleware: Chỉ cho phép Admin
 */
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền truy cập chức năng này.',
  });
};

/**
 * Middleware: Chỉ cho phép Thầy Xem (Master) hoặc Admin
 */
export const masterOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'master' || req.user.role === 'admin')) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Chỉ Thầy Xem hoặc Admin mới có quyền truy cập.',
  });
};

/**
 * Middleware: Kiểm tra role linh hoạt
 * @param {string[]} roles - Mảng các role được phép
 */
export const roleCheck = (roles) => (req, res, next) => {
  if (req.user && roles.includes(req.user.role)) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền truy cập chức năng này.',
  });
};

/**
 * Middleware: Tùy chọn xác thực (không bắt buộc)
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    }
  } catch {
    // Token invalid - continue without user
  }
  next();
};

