import express from 'express';
import { getPublicMasters, getPublicMasterDetail } from '../controllers/masterController.js';

const router = express.Router();

router.get('/', getPublicMasters);
router.get('/:id', getPublicMasterDetail);

export default router;
