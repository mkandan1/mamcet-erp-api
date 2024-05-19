import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
    sub_name: {
        type: String,
        require: true
    },
    sub_code: {
        type: String,
        require: true
    },
    sub_credits: {
        type: Number,
        require: true
    },
    sub_type: {
        type: String,
        require: true
    },
    sub_mandatory: {
        type: Boolean,
        require: true
    },
    sub_regulation:{
        type: String,
        require: true
    }
})

export const Subject = mongoose.model('subject', subjectSchema)