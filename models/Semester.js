import mongoose from "mongoose";

const semesterSchema = new mongoose.Schema({
    institution: { type: String, required: true },
    program: { type: String, required: true },
    academic_year: { type: String, required: true },
    regulation: { type: String, required: true },
    department: { type: String, required: true },
    course_name: { type: String, required: true },
    batch_name: { type: String, required: true },
    semester_name: { type: String, required: true },
    subjects: [{
      subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subjects',
        required: true
      },
      facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee',
        required: false  // Optional, if you don't always need a faculty assigned
      }
    }]
  });

export const Semester = mongoose.model("semesters", semesterSchema);
