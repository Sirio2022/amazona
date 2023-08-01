import express from 'express';
import { addOrderItems, getOrderById } from '../controllers/orderController.js';


const router = express.Router();

router.post('/', addOrderItems);

router.get('/:id', getOrderById);

export default router;
