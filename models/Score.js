import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
    examType: String,
    stud_id: {type: mongoose.Schema.Types.ObjectId, ref: 'students'},
    sub_id: {type: mongoose.Schema.Types.ObjectId, ref: 'subjects'},
    exam_id: {type: mongoose.Schema.Types.ObjectId, ref: 'exams'},
    name: String,
    registerNumber: String,
    sub_code: String,
    passingYear: {type: String, default: null},
    score: Number
});

export const Score = mongoose.model("scores", scoreSchema);
