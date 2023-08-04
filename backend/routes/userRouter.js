import express from 'express';
const router = express.Router();
import {
  userRegister,
  userAuthentication,
  confirmUser,
  forgotPassword,
  confirmToken,
  newPassword,
  userDetails,
} from '../controllers/userController.js';


// Create, register and login users

router.post('/', userRegister); // Register a new user
router.post('/login', userAuthentication); // Login an existing user
router.get('/confirmation/:token', confirmUser); // Confirm user
router.post('/forgot-password', forgotPassword);
router.route('/forgot-password/:token').get(confirmToken).post(newPassword);

router.get('/:id', userDetails); // Get user profile

export default router;
