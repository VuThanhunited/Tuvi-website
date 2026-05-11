import { Router } from 'express';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
  getFavoritesCount,
} from '../controllers/favoriteController.js';
import { protect } from '../middleware/auth.js';
import { validateObjectId, validatePagination } from '../middleware/validation.js';

const router = Router();

// All favorite routes require authentication
router.use(protect);

// Get user's favorites with pagination
router.get('/', validatePagination, getFavorites);

// Get favorites count (must come before /:id to avoid conflict)
router.get('/count', getFavoritesCount);

// Check if item is favorited (must come before /:id to avoid conflict)
router.get('/check/:articleId', validateObjectId, checkFavorite);

// Add to favorites
router.post('/', addFavorite);

// Remove from favorites
router.delete('/:id', validateObjectId, removeFavorite);

export default router;
