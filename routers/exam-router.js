import express from 'express'
import { getExamData } from '../controllers/exam-controller.js';
const examRouter = express.Router();

examRouter.route('/get-exam-data').post(getExamData)

export { examRouter }