import mongoose from "mongoose";

const batch = new mongoose.Schema({
  batch_name: {
    type: String,
    require: true,
  },
  academic_year: {
    type: String,
    require: true,
  },
  semester: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'semesters',
    default: null,
  }],
  course_name: {
    type: String,
    require: true,
  },
  institution: {
    type: String,
    require: true,
  },
  program: {
    type: String,
    require: true,
  },
  regulation: {
    type: String,
    require: true,
  },
  department: {
    type: String,
    require: true,
  },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "students" }],
});

export const Batch = mongoose.model("batch", batch);
