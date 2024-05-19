import express from "express";
import { createSubject, deleteSubject, editSubjectDetails, getSubjectDetails, getSubjects } from "../controllers/subject-controller.js";
const subjectRouter = express.Router();

subjectRouter.route('/add').post(createSubject);
subjectRouter.route('/').get(getSubjects);
subjectRouter.route('/:id').get(getSubjectDetails);
subjectRouter.route('/edit').put(editSubjectDetails);
subjectRouter.route('/delete/:id').delete(deleteSubject);

export { subjectRouter }