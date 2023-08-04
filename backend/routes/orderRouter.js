import express from 'express';
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/', addOrderItems);

router.get('/myorders', getMyOrders);

router.get('/:id', getOrderById);

router.put('/:id/pay', updateOrderToPaid);

export default router;
