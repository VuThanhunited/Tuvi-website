import { Router } from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  refreshAccessToken,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword,
} from '../middleware/validation.js';

const router = Router();

// Public
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/refresh-token', refreshAccessToken);

// Private (requires login)
router.get('/me', protect, getMe);
router.put('/update-profile', protect, validateUpdateProfile, updateProfile);
router.put('/change-password', protect, validateChangePassword, changePassword);

export default router;
