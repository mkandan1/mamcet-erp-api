import express from "express";
import { createBatch, deleteBatch, editBatch, getAllBatches, getBatchDetails } from "../controllers/batch-controller.js";
const batchRouter = express.Router();

batchRouter.route('/add').post(createBatch);
batchRouter.route('/').get(getAllBatches);
batchRouter.route('/:id').get(getBatchDetails);
batchRouter.route('/delete/:id').delete(deleteBatch);
batchRouter.route('/edit').put(editBatch);

export { batchRouter }