import mongoose from "mongoose";

const semesterSchema = new mongoose.Schema({
    institution: String,
    program: String,
    academic_year: String,
    regulation: String,
    deparment: String,
    course_name: String,
    batch_name: String,
    semester_name: String,
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "subjects",
        require: true
    }]
});

export const Semester = mongoose.model("semester", semesterSchema);
