import express from 'express'
import { updateUniversityScore } from '../controllers/score-controller.js';
const scoreRouter = express.Router();

scoreRouter.route('/university/update').post(updateUniversityScore)

export { scoreRouter }