import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import {
  getUsers,
  updateUserRole,
  toggleUserActive,
  getDashboardStats,
  addCredits,
  crawlForum,
} from '../controllers/adminController.js';
import {
  getMasterProfiles,
  getMasterProfile,
  createMasterProfile,
  updateMasterProfile,
  uploadMasterImage,
  deleteMasterProfile
} from '../controllers/masterCMSController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/toggle-active', toggleUserActive);
router.put('/users/:id/credits', addCredits);
router.post('/crawl-forum', crawlForum);

// Master CMS Routes
router.get('/masters', getMasterProfiles);
router.get('/masters/:id', getMasterProfile);
router.post('/masters', createMasterProfile);
router.put('/masters/:id', updateMasterProfile);
router.post('/masters/upload-image', upload.single('image'), uploadMasterImage);
router.delete('/masters/:id', deleteMasterProfile);

export default router;
