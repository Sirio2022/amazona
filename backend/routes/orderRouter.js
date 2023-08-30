import express from 'express';
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  deleteOrder,
  updateOrderToDelivered,
  orderSummary,
} from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import AdminAuthOrSellerAuth from '../middleware/adminAuthOrSellerAuth.js';

const router = express.Router();

router.post('/', addOrderItems);

router.get('/summary', adminAuth, orderSummary);

router.get('/myorders', AdminAuthOrSellerAuth, getMyOrders);

router.get('/', AdminAuthOrSellerAuth, getOrders);

router.get('/:id', getOrderById);

router.put('/:id/pay', updateOrderToPaid);

router.put('/:id/deliver', adminAuth, updateOrderToDelivered);

router.delete('/:id', adminAuth, deleteOrder);

export default router;
