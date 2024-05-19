import { Course } from "../models/Course.js";
import { getID } from "../services/getID.js";
import { ObjectId } from "mongodb";

const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({});
    res
      .status(200)
      .json({
        success: true,
        message: "Courses fetched successfully",
        courses,
      });
  } catch (err) {
    next(err);
  }
};

const getCourseDetails = async (req, res, next) => {
  try {
    const courseId = getID(req.path);
    const course = await Course.find({
      _id: new ObjectId(courseId),
    });

    if(!course){
      return res
              .status(404)
              .json({
                success: false,
                message: "Course not found in our record"
              })
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Course detail fetched successfully",
        course: course[0],
      });
  } catch (err) {
    next(err);
  }
};

const createCourse = async (req, res, next) => {
  try {
    const courseData = req.body;
    const existCourse = await Course.findOne({ name: courseData.name });
    if (existCourse) {
      return res.status(409).json({
        success: false,
        message: "Course already exist with our record",
      });
    }
    await Course.create(courseData);
    res
      .status(201)
      .json({ success: true, message: "Course added successfully!" });
  } catch (err) {
    next(err);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const courseId = getID(req.path);
    const existCourse = await Course.findOne({ _id: new ObjectId(courseId) });
    if (!existCourse) {
      return res.status(404).json({
        success: false,
        message: "Course does not exist!",
      });
    }
    await Course.deleteOne({_id: new ObjectId(courseId)});
    res
      .status(200)
      .json({ success: true, message: "Course deleted successfully!" });
  } catch (err) {
    next(err);
  }
};

const editCourseDetails = async (req, res, next) => {
  try {
    const courseData= req.body
    const course = await Course.findOneAndUpdate(
      { _id: new ObjectId(courseData._id) },
      { $set: courseData },
      { new: true } // This option returns the updated document
    );

    if(!course){
      return res
              .status(404)
              .json({
                success: false,
                message: "Course not found in our record"
              })
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Course detail edited successfully",
      });
  } catch (err) {
    next(err);
  }
};

export { createCourse, getCourses, getCourseDetails, deleteCourse, editCourseDetails };
