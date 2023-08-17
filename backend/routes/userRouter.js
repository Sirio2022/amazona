import express from 'express';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();
import {
  userRegister,
  userAuthentication,
  confirmUser,
  forgotPassword,
  confirmToken,
  newPassword,
  userDetails,
  updateUserProfile,
  userList,
  userDelete,
} from '../controllers/userController.js';
import adminAuth from '../middleware/adminAuth.js';

// Create, register and login users

router.post('/', userRegister); // Register a new user
router.post('/login', userAuthentication); // Login an existing user
router.get('/confirmation/:token', confirmUser); // Confirm user
router.post('/forgot-password', forgotPassword);
router.route('/forgot-password/:token').get(confirmToken).post(newPassword);

router.get('/:id', userDetails); // Get user profile

router.put('/profile', checkAuth, updateUserProfile); // Update user profile

router.get('/', checkAuth, adminAuth, userList); // Get all users (admin only)

router.delete('/:id', checkAuth, adminAuth, userDelete); // Delete a user (admin only)

export default router;
