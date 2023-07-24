import express from 'express';
const router = express.Router();
import { userRegister } from '../controllers/userController.js';

// Create, register and login users

router.post('/', userRegister); // Register a new user

export default router;
