import express from 'express';
import { DeleteCategory, UpdateCategory, createCategory, getAllCategory } from '../controllers/categoryController.js';
import { isAdmin, verifyauthToken } from '../middlewares/verifyauthToken.js';

const router = express.Router();

// Create Category:
router.post('/create', verifyauthToken, isAdmin, createCategory);
// Get All Category:
router.get('/all', verifyauthToken, getAllCategory);
// Update Category:
router.put('/update/:id', verifyauthToken, isAdmin, UpdateCategory);
// Delete Category:
router.delete('/delete/:id', verifyauthToken, isAdmin, DeleteCategory);

export default router;
