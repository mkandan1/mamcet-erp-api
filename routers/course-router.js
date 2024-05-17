import express from "express";
import { createCourse, editCourseDetails, getCourseDetails, getCourses } from "../controllers/course-controller.js";
const courseRouter = express.Router();

courseRouter.route("/add").post(createCourse);
courseRouter.route("/").get(getCourses);
courseRouter.route("/:id").get(getCourseDetails);
courseRouter.route("/edit").put(editCourseDetails);

export { courseRouter };
