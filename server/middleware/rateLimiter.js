import rateLimit from 'express-rate-limit';

// Helper để trả về JSON nhất quán thay vì plain text
const jsonHandler = (message) => (req, res) => {
  res.status(429).json({ success: false, message });
};

/**
 * General API rate limiter
 * 200 requests per 15 minutes per IP
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  handler: jsonHandler('Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút.'),
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health check
    return req.path === '/api/health';
  },
});

/**
 * Strict rate limiter for authentication endpoints
 * - Production: 10 requests per 15 minutes per IP
 * - Development: 50 requests per 15 minutes (for testing)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 10 : 50,
  handler: jsonHandler('Quá nhiều lần thử đăng nhập/đăng ký. Vui lòng thử lại sau 15 phút.'),
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Không đếm request thành công
});

/**
 * Strict rate limiter for file uploads
 * 10 uploads per hour per user
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  handler: jsonHandler('Quá nhiều tải file. Giới hạn 10 file mỗi giờ.'),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use userId if authenticated, otherwise use IP
    return req.user?._id?.toString() || req.ip;
  },
});

/**
 * Rate limiter for tuvi calculations
 * - Production: 20 calculations per hour
 * - Development: 100 per hour (for testing)
 */
export const tuViLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: process.env.NODE_ENV === 'production' ? 20 : 100,
  handler: jsonHandler('Quá nhiều tính toán. Giới hạn 20 lần mỗi giờ.'),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use userId if authenticated, otherwise use IP
    return req.user?._id?.toString() || req.ip;
  },
});

export default generalLimiter;
