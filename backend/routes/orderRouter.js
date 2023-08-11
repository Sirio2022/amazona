import express from 'express';
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  deleteOrder,
  updateOrderToDelivered,
} from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/', addOrderItems);

router.get('/myorders', getMyOrders);

router.get('/', adminAuth, getOrders );

router.get('/:id', getOrderById);

router.put('/:id/pay', updateOrderToPaid);

router.put('/:id/deliver', adminAuth, updateOrderToDelivered);

router.delete('/:id', adminAuth, deleteOrder);

export default router;
