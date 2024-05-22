import express from 'express'
import { updateScore } from '../controllers/score-controller.js';
const scoreRouter = express.Router();

scoreRouter.route('/update').post(updateScore)

export { scoreRouter }