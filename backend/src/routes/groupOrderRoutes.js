import { Router } from 'express';
import { createGroupOrder, getGroupOrders, getGroupOrder, joinGroupOrder, leaveGroupOrder, closeGroupOrder, getMyGroupOrders } from '../controllers/groupOrderController.js';

const router = Router();
router.get('/', getGroupOrders);
router.post('/', createGroupOrder);
router.get('/my', getMyGroupOrders);
router.get('/:id', getGroupOrder);
router.post('/:id/join', joinGroupOrder);
router.delete('/:id/leave', leaveGroupOrder);
router.put('/:id/close', closeGroupOrder);

export default router;
