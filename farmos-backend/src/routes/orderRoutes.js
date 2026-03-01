import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { createOrder, getMyOrders, getOrder, updateOrderStatus, getOrderStats } from '../controllers/orderController.js';

const router = Router();
router.post('/', protect, createOrder);
router.get('/', protect, getMyOrders);
router.get('/stats', protect, getOrderStats);
router.get('/:orderId', protect, getOrder);
router.put('/:orderId/status', protect, updateOrderStatus);

export default router;
