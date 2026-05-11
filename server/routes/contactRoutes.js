import { Router } from 'express';
import { createContact, getContacts, updateContact, deleteContact } from '../controllers/contactController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { validateContact, validateObjectId, validatePagination } from '../middleware/validation.js';

const router = Router();

// Public
router.post('/', validateContact, createContact);

// Admin only
router.get('/', protect, adminOnly, validatePagination, getContacts);
router.put('/:id', protect, adminOnly, validateObjectId, updateContact);
router.delete('/:id', protect, adminOnly, validateObjectId, deleteContact);

export default router;
