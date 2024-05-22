import express from 'express'
import { getAllSchedules, getExamData, getExamDetails, scheduleExam, updateExamSchedule } from '../controllers/exam-controller.js';
const examRouter = express.Router();

examRouter.route('/get-exam-data').post(getExamData)
examRouter.route('/schedule-exam').post(scheduleExam)
examRouter.route('/all-exam-schedules').get(getAllSchedules)
examRouter.route('/update-exam-schedule').put(updateExamSchedule)
examRouter.route('/:id').get(getExamDetails)

export { examRouter }