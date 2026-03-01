import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { createGroupOrder, getGroupOrders, getGroupOrder, joinGroupOrder, leaveGroupOrder, closeGroupOrder, getMyGroupOrders } from '../controllers/groupOrderController.js';

const router = Router();
router.get('/', protect, getGroupOrders);
router.post('/', protect, authorize('farmer', 'admin'), createGroupOrder);
router.get('/my', protect, getMyGroupOrders);
router.get('/:id', protect, getGroupOrder);
router.post('/:id/join', protect, joinGroupOrder);
router.delete('/:id/leave', protect, leaveGroupOrder);
router.put('/:id/close', protect, closeGroupOrder);

export default router;
