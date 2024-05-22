import { ObjectId } from 'mongodb';
import { Batch } from '../models/Batch.js'
import { Exam } from '../models/Exam.js';
import { Semester } from '../models/Semester.js';
import { Score } from '../models/Score.js';

const getExamData = async (req, res, next) => {
    try {
        const { institution, program, department, course_name, regulation, batch_name, academic_year, semester_name, exam_name } = req.body;
        const existBatch = await Batch.findOne({ institution, program, department, course_name, regulation, batch_name })
        .populate({path:'semesters', match: {semester_name}, select: 'institution program academic_year regulation deparment course_name batch_name semester_name subjects', populate: {path: 'subjects', select: 'sub_name sub_code sub_short_name sub_type sub_credits'}})
        .populate({path: 'students', select: "registerNumber name cgpa history_of_arrears current_arrears semester"})
        .populate({path: 'exams', match: {exam_name}, select: "exam_name institution program academic_year regulation deparment course_name batch_name semester_name scores", populate: {path: 'scores', select: "registerNumber name examType stud_id sub_id sub_code passingYear score"}});
        if (!existBatch) {
            return res.status(404).json({ success: false, message: "Batch does not exist!" });
        }
        const existExam = await Exam.findOne({program, department, course_name, batch_name, semester_name, exam_name})
        if(!existExam){
            const result = await Exam.create({institution, program, department, course_name, regulation, batch_name, academic_year, semester_name, exam_name})
            const examId = result._id;
            await Batch.updateOne({_id: new ObjectId(existBatch._id)}, {$set: {exams: [...existBatch.exams, examId]}})
        }
        res.status(200).json({success: true, message: "Exam data fetched successfully", existBatch})
    }
    catch (err) {
        next(err)
    }
}

export {
    getExamData
}