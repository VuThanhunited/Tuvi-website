import { Router } from 'express';
import { getArticles, getArticleBySlug, createArticle, updateArticle, deleteArticle } from '../controllers/articleController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { validateArticle, validateObjectId, validatePagination } from '../middleware/validation.js';

const router = Router();

// Public
router.get('/', validatePagination, getArticles);
router.get('/:slug', getArticleBySlug);

// Admin only
router.post('/', protect, adminOnly, validateArticle, createArticle);
router.put('/:id', protect, adminOnly, validateObjectId, validateArticle, updateArticle);
router.delete('/:id', protect, adminOnly, validateObjectId, deleteArticle);

export default router;
