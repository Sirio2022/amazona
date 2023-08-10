import express from 'express';
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
} from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/', addOrderItems);

router.get('/myorders', getMyOrders);

router.get('/', adminAuth, getOrders );

router.get('/:id', getOrderById);

router.put('/:id/pay', updateOrderToPaid);

export default router;
