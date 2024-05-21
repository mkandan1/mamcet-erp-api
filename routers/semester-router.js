import express from 'express';
import { createSemester } from '../controllers/semester-controller.js';
const semesterRouter = express.Router();

semesterRouter.route('/add').post(createSemester)

export { semesterRouter }