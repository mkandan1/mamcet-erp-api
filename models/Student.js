import mongoose from "mongoose";

const student = new mongoose.Schema({
  registerNumber: {
    type: Number,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  dob: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
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
    require: true,
  },
  fathersName: {
    type: String,
    require: true,
  },
  fathersPhone: {
    type: String,
    require: true,
  },
  mothersName: {
    type: String,
    require: true,
  },
  mothersPhone: {
    type: String,
    require: true,
  },
  _10thMark: {
    type: Number,
    require: true,
  },
  _12thMark: {
    type: Number,
    require: true,
  },
  counsellingApplicationNumber: {
    type: String,
    require: true,
  },
  cgpa: {
    type: Number,
    default: 0.00
},
  current_arrears: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subjects",
    default: null,
  },
  history_of_arrears: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subjects",
    default: null,
  },
  semesterStats: [
    {
      semester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "semesters",
      },
      cgpa: {
        type: Number,
        default: 0.00,
      },
      gpa: {
        type: Number,
        default: 0.00,
      },
      arrears: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "subjects",
          default: null,
        },
      ],
    },
  ],
  historyOfArrears: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subjects",
      default: null,
    },
  ],
  cgpa: {
    type: Number,
    default: 0,
  },
  address: {
    type: String,
    require: true,
  },
});

export const Student = mongoose.model("students", student);
