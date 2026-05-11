import { body, validationResult, param, query } from 'express-validator';

/**
 * Middleware to handle validation errors
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Validation rules for authentication
 */
export const validateRegister = [
  body('hoTen')
    .trim()
    .notEmpty().withMessage('Họ tên là bắt buộc')
    .isLength({ min: 2, max: 100 }).withMessage('Họ tên phải từ 2 đến 100 ký tự'),
  
  body('email')
    .trim()
    .isEmail().withMessage('Email không hợp lệ')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8 }).withMessage('Mật khẩu tối thiểu 8 ký tự')
    .matches(/[A-Z]/).withMessage('Mật khẩu phải chứa ít nhất 1 chữ hoa')
    .matches(/[a-z]/).withMessage('Mật khẩu phải chứa ít nhất 1 chữ thường')
    .matches(/[0-9]/).withMessage('Mật khẩu phải chứa ít nhất 1 chữ số')
    .matches(/[!@#$%^&*]/).withMessage('Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt (!@#$%^&*)'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]+$/).withMessage('Số điện thoại không hợp lệ'),
  
  body('gioiTinh')
    .optional()
    .isIn(['nam', 'nu']).withMessage('Giới tính phải là nam hoặc nữ'),
  
  handleValidationErrors,
];

export const validateLogin = [
  body('email')
    .trim()
    .isEmail().withMessage('Email không hợp lệ')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Mật khẩu là bắt buộc'),
  
  handleValidationErrors,
];

export const validateUpdateProfile = [
  body('hoTen')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Họ tên phải từ 2 đến 100 ký tự'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]+$/).withMessage('Số điện thoại không hợp lệ'),
  
  body('ngaySinh')
    .optional()
    .trim(),
  
  body('gioiTinh')
    .optional()
    .isIn(['nam', 'nu']).withMessage('Giới tính phải là nam hoặc nữ'),
  
  handleValidationErrors,
];

export const validateChangePassword = [
  body('currentPassword')
    .notEmpty().withMessage('Mật khẩu hiện tại là bắt buộc'),
  
  body('newPassword')
    .isLength({ min: 8 }).withMessage('Mật khẩu mới tối thiểu 8 ký tự')
    .matches(/[A-Z]/).withMessage('Mật khẩu phải chứa ít nhất 1 chữ hoa')
    .matches(/[a-z]/).withMessage('Mật khẩu phải chứa ít nhất 1 chữ thường')
    .matches(/[0-9]/).withMessage('Mật khẩu phải chứa ít nhất 1 chữ số')
    .matches(/[!@#$%^&*]/).withMessage('Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt (!@#$%^&*)')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('Mật khẩu mới phải khác mật khẩu hiện tại');
      }
      return true;
    }),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Xác nhận mật khẩu không trùng khớp');
      }
      return true;
    }),
  
  handleValidationErrors,
];

/**
 * Validation rules for TuVi calculations
 */
export const validateTuVi = [
  body('hoTen')
    .trim()
    .notEmpty().withMessage('Họ tên là bắt buộc')
    .isLength({ min: 2, max: 100 }).withMessage('Họ tên phải từ 2 đến 100 ký tự'),
  
  body('gioiTinh')
    .isIn(['nam', 'nu']).withMessage('Giới tính phải là nam hoặc nữ'),
  
  body('ngaySinh')
    .notEmpty().withMessage('Ngày sinh là bắt buộc')
    .custom(value => {
      const day = parseInt(value);
      if (isNaN(day) || day < 1 || day > 31) {
        throw new Error('Ngày sinh phải từ 1 đến 31');
      }
      return true;
    }),
  
  body('thangSinh')
    .notEmpty().withMessage('Tháng sinh là bắt buộc')
    .custom(value => {
      const month = parseInt(value);
      if (isNaN(month) || month < 1 || month > 12) {
        throw new Error('Tháng sinh phải từ 1 đến 12');
      }
      return true;
    }),
  
  body('namSinh')
    .notEmpty().withMessage('Năm sinh là bắt buộc')
    .custom(value => {
      const year = parseInt(value);
      if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
        throw new Error(`Năm sinh phải từ 1900 đến ${new Date().getFullYear()}`);
      }
      return true;
    }),
  
  body('gioSinh')
    .notEmpty().withMessage('Giờ sinh là bắt buộc')
    .isIn(['23-1', '1-3', '3-5', '5-7', '7-9', '9-11', '11-13', '13-15', '15-17', '17-19', '19-21', '21-23'])
    .withMessage('Giờ sinh không hợp lệ'),
  
  body('isLunar')
    .optional()
    .isBoolean().withMessage('isLunar phải là true hoặc false'),
  
  handleValidationErrors,
];

/**
 * Validation rules for articles
 */
export const validateArticle = [
  body('title')
    .trim()
    .notEmpty().withMessage('Tiêu đề là bắt buộc')
    .isLength({ min: 5, max: 200 }).withMessage('Tiêu đề phải từ 5 đến 200 ký tự'),
  
  body('slug')
    .optional()
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).withMessage('Slug chỉ chứa chữ thường, số và dấu gạch ngang'),
  
  body('content')
    .trim()
    .notEmpty().withMessage('Nội dung là bắt buộc')
    .isLength({ min: 10 }).withMessage('Nội dung phải ít nhất 10 ký tự'),
  
  body('category')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Danh mục phải từ 2 đến 50 ký tự'),
  
  body('tags')
    .optional()
    .isArray().withMessage('Tags phải là một mảng'),
  
  handleValidationErrors,
];

/**
 * Validation rules for contact form
 */
export const validateContact = [
  body('hoTen')
    .trim()
    .notEmpty().withMessage('Họ tên là bắt buộc')
    .isLength({ min: 2, max: 100 }).withMessage('Họ tên phải từ 2 đến 100 ký tự'),
  
  body('email')
    .trim()
    .isEmail().withMessage('Email không hợp lệ')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]+$/).withMessage('Số điện thoại không hợp lệ'),
  
  body('message')
    .trim()
    .notEmpty().withMessage('Tin nhắn là bắt buộc')
    .isLength({ min: 10, max: 2000 }).withMessage('Tin nhắn phải từ 10 đến 2000 ký tự'),
  
  handleValidationErrors,
];

/**
 * Validation rules for IDs
 */
export const validateObjectId = [
  param('id')
    .matches(/^[0-9a-fA-F]{24}$/).withMessage('ID không hợp lệ'),
  
  handleValidationErrors,
];

/**
 * Validation rules for pagination
 */
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Trang phải là số nguyên dương'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit phải từ 1 đến 100'),
  
  handleValidationErrors,
];
