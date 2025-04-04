import express from 'express'
import { updateUniversityScore, updateInternalScore, getUniversityResult } from '../controllers/score-controller.js';
const scoreRouter = express.Router();

scoreRouter.route('/university/update').post(updateUniversityScore)
scoreRouter.route('/university/get').get(getUniversityResult)
scoreRouter.route('/internals/update').post(updateInternalScore)

export { scoreRouter }