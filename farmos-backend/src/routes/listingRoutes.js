import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { createListing, getListings, getMyListings, getListing, updateListing, deleteListing, lockPrice, getDemandsNearby } from '../controllers/listingController.js';

const router = Router();
router.get('/', getListings);
router.post('/', protect, authorize('farmer', 'admin'), createListing);
router.get('/my', protect, getMyListings);
router.get('/demands', protect, getDemandsNearby);
router.get('/:id', getListing);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);
router.post('/:id/lock-price', protect, lockPrice);

export default router;
