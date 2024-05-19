import { Subject } from "../models/Subject.js";
import { getID } from "../services/getID.js";
import { ObjectId } from "mongodb";

const createSubject = async (req, res, next) => {
  try {
    const subjectData = req.body;
    const existSubject = await Subject.findOne({
      sub_code: subjectData.sub_code,
    });
    if (existSubject) {
      return res
        .status(409)
        .json({ success: false, message: "Subject already exist" });
    }
    await Subject.create(subjectData);
    return res
      .status(201)
      .json({ success: true, message: "Subject created successfully" });
  } catch (err) {
    next(err);
  }
};

const getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find({});
    res
      .status(200)
      .json({
        success: true,
        message: "Subjects fetched successfully",
        subjects,
      });
  } catch (err) {
    next(err);
  }
};

const getSubjectDetails = async (req, res, next) => {
  try {
    const subjectId = getID(req.path);
    const subject = await Subject.find({
      _id: new ObjectId(subjectId),
    });

    if(!subject){
      return res
              .status(404)
              .json({
                success: false,
                message: "Subject not found in our record"
              })
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Subject detail fetched successfully",
        subject: subject[0],
      });
  } catch (err) {
    next(err);
  }
};


const deleteSubject = async (req, res, next) => {
  try {
    const subjectId = getID(req.path);
    const existSubject = await Course.findOne({ _id: new ObjectId(subjectId) });
    if (!existSubject) {
      return res.status(404).json({
        success: false,
        message: "Subject does not exist!",
      });
    }
    await Subject.deleteOne({_id: new ObjectId(subjectId)});
    res
      .status(200)
      .json({ success: true, message: "Subject deleted successfully!" });
  } catch (err) {
    next(err);
  }
};

const editSubjectDetails = async (req, res, next) => {
  try {
    const subjectData= req.body
    const subject = await Subject.findOneAndUpdate(
      { _id: new ObjectId(subjectData._id) },
      { $set: subjectData },
      { new: true } // This option returns the updated document
    );

    if(!subject){
      return res
              .status(404)
              .json({
                success: false,
                message: "Subject not found in our record"
              })
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Subject detail edited successfully",
      });
  } catch (err) {
    next(err);
  }
};

export { createSubject, getSubjects, getSubjectDetails, editSubjectDetails, deleteSubject };
