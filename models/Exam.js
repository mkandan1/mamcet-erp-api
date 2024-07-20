import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
    institution: String,
    program: String,
    academic_year: String,
    regulation: String,
    department: String,
    course_name: String,
    batch_name: String,
    semester_name: String,
    exam_name: String,
    semester: { type: mongoose.Schema.Types.ObjectId, ref: 'semesters' }, // Ensure this line is present
    scores: [{ type: mongoose.Schema.Types.ObjectId, ref: "scores" }]
});

export const Exam = mongoose.model("exams", examSchema);
