import { Router } from 'express';
import { calculate, getResult, getHistory, deleteResult, getStats } from '../controllers/tuViController.js';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';
import { validateTuVi, validateObjectId, validatePagination } from '../middleware/validation.js';

const router = Router();

// Public (optional auth to link result to user)
router.post('/calculate', optionalAuth, validateTuVi, calculate);
router.get('/stats', protect, adminOnly, getStats);
router.get('/history', protect, validatePagination, getHistory);
router.get('/:id', validateObjectId, getResult);
router.delete('/:id', protect, validateObjectId, deleteResult);

export default router;
