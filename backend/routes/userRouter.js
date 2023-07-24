import express from 'express';
const router = express.Router();
import {
  userRegister,
  userAuthentication,
  confirmUser,
} from '../controllers/userController.js';

// Create, register and login users

router.post('/', userRegister); // Register a new user
router.post('/login', userAuthentication); // Login an existing user
router.get('/confirmation/:token', confirmUser); // Confirm user

export default router;
