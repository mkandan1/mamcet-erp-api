import { ObjectId } from 'mongodb';
import { Batch } from '../models/Batch.js'
import { Exam } from '../models/Exam.js';
import { Semester } from '../models/Semester.js';
import { Score } from '../models/Score.js';
import { getID } from '../services/getID.js';

const getExamData = async (req, res, next) => {
    try {
        const { institution, program, department, course_name, regulation, batch_name, academic_year, semester_name, exam_name } = req.body;
        const existBatch = await Batch.findOne({ institution, program, department, course_name, regulation, batch_name })
            .populate({
                path: 'semesters',
                match: { semester_name },
                select: 'institution program academic_year regulation department course_name batch_name semester_name subjects',
                populate: {
                    path: 'subjects',
                    select: 'sub_name sub_code sub_short_name sub_type sub_credits'
                }
            })
            .populate({
                path: 'students',
                select: "registerNumber name cgpa history_of_arrears semesterStats current_arrears",
            })
            .populate({
                path: 'exams',
                match: { exam_name, semester_name },
                select: "exam_name institution program academic_year regulation department course_name batch_name semester_name start_date end_date scores",
                populate: {
                    path: 'scores',
                    select: "registerNumber name examType stud_id sub_id sub_code passingYear score"
                }
            });

        if (!existBatch) {
            return res.status(404).json({ success: false, message: "Batch does not exist!" });
        }
        res.status(200).json({ success: true, message: "Exam data fetched successfully", existBatch })
    }
    catch (err) {
        next(err)
    }
}

const getAllSchedules = async (req, res, next) => {
    try {
        const exams = await Exam.find({});
        res.status(200).json({ success: true, message: "Fetch operation successfull", exams })
    }
    catch (err) {
        next(err)
    }
}

const updateExamSchedule = async (req, res, next) => {
    try {
        const { _id, institution, program, department, course_name, regulation, batch_name, academic_year, semester_name, exam_name, start_date, end_date } = req.body;

        const existSchedule = await Exam.findOne({ _id: new ObjectId(_id) });
        if (!existSchedule) {
            return res.status(404).json({ success: false, message: 'Exam schedule not found.' });
        }

        const updatedData = { institution, program, department, course_name, regulation, batch_name, academic_year, semester_name, exam_name, start_date, end_date };

        const result = await Exam.updateOne({ _id: new ObjectId(_id) }, { $set: updatedData });

        return res.status(200).json({ success: true, message: 'Exam schedule successfully updated.', data: result });
    } catch (err) {
        next(err);
    }
}


const scheduleExam = async (req, res, next) => {
    try {
        const { institution, program, department, course_name, regulation, batch_name, academic_year, semester_name, exam_name } = req.body;

        const existSchedule = await Exam.findOne({ program, department, batch_name, semester_name, exam_name });
        if (existSchedule) {
            return res.status(409).json({ success: false, message: 'An exam schedule with the same parameters already exists.' });
        }

        const existBatch = await Batch.findOne({ institution, program, department, course_name, regulation, batch_name });
        if (!existBatch) {
            return res.status(404).json({ success: false, message: 'Batch not found.' });
        }

        const result = await Exam.create(req.body);
        const examId = result._id;

        await Batch.updateOne({ _id: existBatch._id }, { $push: { exams: examId } });

        return res.status(201).json({ success: true, message: 'Exam schedule was successfully created.' });
    } catch (err) {
        next(err);
    }
}

const getExamDetails = async (req, res, next) => {
    try {
        const examId = getID(req.path);
        const exam = await Exam.find({
            _id: new ObjectId(examId),
        });

        if (!exam) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Exam not found in our record"
                })
        }
        res
            .status(200)
            .json({
                success: true,
                message: "Exam detail fetched successfully",
                exam
            });
    } catch (err) {
        next(err);
    }
}


export {
    getExamData,
    scheduleExam,
    getAllSchedules,
    getExamDetails,
    updateExamSchedule
}