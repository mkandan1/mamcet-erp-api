import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    institution: {
        type: String,
        require: true
    },
    program: {
        type: String,
        require: true
    },
    duration: {
        type: String,
        require: true
    },
    teaching_mode: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
})

export const Course = mongoose.model('course', courseSchema)