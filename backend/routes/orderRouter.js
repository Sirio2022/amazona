import express from 'express';
import { addOrderItems, getOrderById, updateOrderToPaid } from '../controllers/orderController.js';


const router = express.Router();

router.post('/', addOrderItems);

router.get('/:id', getOrderById);

router.put('/:id/pay', updateOrderToPaid );

export default router;
