import mongoose from "mongoose";

const semesterStateSchema = new mongoose.Schema({
  sem: {
    type: String,  // or Number, depending on how you represent semesters (e.g., 'I', 'II', etc.)
    required: true,
  },
  arrears: {
    type: [String],  // assuming arrears are represented as an array of strings
    default: [],
  },
  gpa: {
    type: Number,
    required: true,
    min: 0, // GPA should be non-negative
    max: 10, // assuming GPA is on a 10-point scale, adjust if different
  },
});

const batch = new mongoose.Schema({
  batch_name: {
    type: String,
    require: true,
  },
  academic_year: {
    type: String,
    require: true,
  },
  semesters: [{
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
  semester_states: [semesterStateSchema],
  exams:[{ type: mongoose.Schema.Types.ObjectId, ref: "exams" }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "students" }],
});

export const Batch = mongoose.model("batch", batch);
