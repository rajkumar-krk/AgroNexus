import express from 'express';
import {
  getBatches,
  getBatch,
  addBatch,
  updateBatch,
  deleteBatch,
  getBatchStats
} from '../controllers/batchController.js';

const router = express.Router();

router.route('/stats/overview').get(getBatchStats);

router
  .route('/')
  .get(getBatches)
  .post(addBatch);

router
  .route('/:id')
  .get(getBatch)
  .put(updateBatch)
  .delete(deleteBatch);

export default router;
