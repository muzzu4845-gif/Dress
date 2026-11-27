import express from 'express';
import {
  getUserWishlist,
  toggleWishlist,
  getAdminStats,
  getAllUsers,
  deleteUser
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/wishlist', getUserWishlist);
router.post('/wishlist/:productId', toggleWishlist);

router.get('/admin/stats', admin, getAdminStats);
router.get('/', admin, getAllUsers);
router.delete('/:id', admin, deleteUser);

export default router;
