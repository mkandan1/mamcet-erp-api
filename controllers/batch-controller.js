import { Batch } from "../models/Batch.js";
import { Student } from "../models/Student.js";
import { ObjectId } from "mongodb";
import { Course } from "../models/Course.js";
import { getID } from "../services/getID.js";

const getAllBatches = async (req, res) => {
  try {
    const allBatches = await Batch.find({}, { projections: { students: 0 } });
    if (!allBatches) {
      res.status(200).json({ success: false, message: "No batches found" });
      res.end();
    }

    res.status(200).json({
      success: true,
      message: "Queries fetched successfully",
      batches: allBatches,
    });

    res.end();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error! Team working on it to fix",
    });
  }
};
const update = async (req, res) => {
  try {
    const data = req.body;
    const doesCourseExit = await Batch.findOne({ _id: new ObjectId(data._id) });
    if (doesCourseExit) {
      await MongoDB.updateOne(req, data, "batch", Batch);
      return res
        .status(200)
        .json({ success: true, message: "Batch edited successfully" });
    } else {
      return res
        .status(200)
        .json({ success: false, message: "Batch doesn't exist" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error! Team working on it to fix",
    });
  }
};

const getBatchDetails = async (req, res, next) => {
  try{
    const batchId = getID(req.path);
    const existBatch = await Batch.findOne({_id: new ObjectId(batchId)}).populate('students');

    if(!existBatch){
      return res.status(404).json({success: false, message: "Batch doesn't exist"})
    }

    res.status(200).json({success: true, message: "Batch details fetched successfully", batch: existBatch})
  }
  catch(err){
    next(err);
  }
}

const deleteBatch = async (req, res, next) => {
  try {
    const batchId = getID(req.path);
    const existBatch = await Batch.findOne({ _id: new ObjectId(batchId) }).populate('students');
    if (!existBatch) {
      return res.status(404).json({
        success: false,
        message: "Batch does not exist!",
      });
    }
    // TODO: Delete students first then delete batch
    // DO: Get all students and delete
    await Student.deleteMany({ _id: { $in: existBatch.students.map(student => student._id) } });

    // Delete the batch
    await Batch.deleteOne({ _id: existBatch._id });
    res
      .status(200)
      .json({ success: true, message: "Batch deleted successfully!"});
  } catch (err) {
    next(err);
  }
};

const editBatch = async (req, res, next) => {
  try{
    const batchData = req.body;
    const existBatch = await Batch.findOne({ _id: new ObjectId(batchData._id) });
    if (!existBatch) {
      return res.status(404).json({
        success: false,
        message: "Batch does not exist!",
      });
    }
    delete batchData.students
    delete batchData._id
    const newData = {...batchData, students: existBatch.students}
    await Batch.findOneAndUpdate(
      { _id: new ObjectId(existBatch._id) },
      { $set: newData },
      { new: true } // This option returns the updated document
    );
    res.status(200).json({
      success: true,
      message: "Batch details edited successfully",
    });
  }
  catch(err){
    next(err)
  }
}

const createBatch = async (req, res) => {
  try {
    const batchData = req.body;
    const batchExists = await checkBatchExistence(
      batchData.batch_name,
      batchData.name,
      batchData.regulation,
      batchData.department
    );
    if (!batchExists) {
      const result = await Student.insertMany(batchData.students);
      const studentsObjectId = [];
      result.map((student) => studentsObjectId.push(student._id));
      delete batchData.students;
      const newData = { ...batchData, students: studentsObjectId };
      await Batch.create(newData);
      res
        .status(200)
        .json({ success: true, message: "Batch added successfully" });
    } else {
      res.status(409).json({
        success: false,
        message: "Batch exists with the same name, course, and program",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error! Team is working on it to fix",
    });
  }
};

async function checkBatchExistence(batch_name, name, regulation, department) {
  const existingBatch = await Batch.findOne({
    batch_name,
    course_name: name,
    regulation,
    department
  });
  return !!existingBatch;
}

export { createBatch, getAllBatches, getBatchDetails, deleteBatch, editBatch };
