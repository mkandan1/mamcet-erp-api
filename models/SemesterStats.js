import mongoose from "mongoose";

const semesterStatSchema = new mongoose.Schema({
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "semesters",
      default: []
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
        default: [],
      },
    ],
  },
)

export const SemesterStats = mongoose.model("semesterStats", semesterStatSchema);