import { Router } from 'express';
import { createOrder, getMyOrders, getOrder, updateOrderStatus, getOrderStats } from '../controllers/orderController.js';

const router = Router();
router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/stats', getOrderStats);
router.get('/:orderId', getOrder);
router.put('/:orderId/status', updateOrderStatus);

export default router;
