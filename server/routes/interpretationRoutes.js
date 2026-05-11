import express from 'express';
import {
  getInterpretations,
  createInterpretation,
  getInterpretationById,
  updateInterpretation,
  deleteInterpretation
} from '../controllers/interpretationController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Tất cả route quản lý luận giải đều cần quyền admin
router.use(protect);
router.use(adminOnly);

router.route('/')
  .get(getInterpretations)
  .post(createInterpretation);

router.route('/:id')
  .get(getInterpretationById)
  .put(updateInterpretation)
  .delete(deleteInterpretation);

export default router;
