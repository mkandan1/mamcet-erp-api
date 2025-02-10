import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  registerNumber: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  personalEmail: {
    type: String,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
  },
  fathersName: {
    type: String,
    required: true,
  },
  fathersPhone: {
    type: String,
    required: true,
  },
  mothersName: {
    type: String,
    required: true,
  },
  mothersPhone: {
    type: String,
    required: true,
  },
  _10thMark: {
    type: Number,
    required: true,
  },
  _12thMark: {
    type: Number,
    required: true,
  },
  counsellingApplicationNumber: {
    type: String,
    required: true,
  },
  cgpa: {
    type: Number,
    default: 0.00,
  },
  history_of_arrears: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "subjects",
    default: [],
  }],
  
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "batch"
  },
  semesterStats: [{
    semester_name: {
      type: mongoose.Schema.Types.String,
      default: '',
    },
    gpa: {
      type: Number,
      default: 0.00,
    },
    arrears: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subjects",
        default: [],
      },
    ],
  }
  ],
  address: {
    type: String,
    required: true,
  },
});

export const Student = mongoose.model("students", studentSchema);
