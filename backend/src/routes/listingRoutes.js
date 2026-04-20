import { Router } from 'express';
import { createListing, getListings, getMyListings, getListing, updateListing, deleteListing, lockPrice, getDemandsNearby } from '../controllers/listingController.js';

const router = Router();
router.get('/', getListings);
router.post('/', createListing);
router.get('/my', getMyListings);
router.get('/demands', getDemandsNearby);
router.get('/:id', getListing);
router.put('/:id', updateListing);
router.delete('/:id', deleteListing);
router.post('/:id/lock-price', lockPrice);

export default router;
