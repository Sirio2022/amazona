import express from 'express';
import { addOrderItems } from '../controllers/orderController.js';
import chechAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.post('/',chechAuth, addOrderItems);

export default router;
