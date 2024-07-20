import { ObjectId } from 'mongodb'; // Ensure you have imported ObjectId
import { Semester } from '../models/Semester.js';
import { Batch } from '../models/Batch.js';
import { Exam } from '../models/Exam.js';

export const createSemester = async (req, res, next) => {
    try {
        const semesterData = req.body;

        // Check if the semester already exists
        const existSemester = await Semester.findOne({
            semester_name: semesterData.semester_name,
            batch_name: semesterData.batch_name,
            department: semesterData.department, 
            course_name: semesterData.course_name,
        });

        if (existSemester) {
            return res.status(409).json({ success: false, message: "Semester already exists in the record" });
        }

        // Create new semester
        const result = await Semester.create(semesterData);
        const id = result._id;

        // Find the corresponding batch
        const existBatch = await Batch.findOne({
            program: semesterData.program,
            department: semesterData.department, 
            course_name: semesterData.course_name,
            batch_name: semesterData.batch_name
        });

        // Check if the batch exists
        if (!existBatch) {
            return res.status(404).json({ success: false, message: "Batch not found" });
        }

        // Update the batch with the new semester ID
        await Batch.updateOne(
            { _id: new ObjectId(existBatch._id) },
            { $set: { semesters: [...existBatch.semesters, id] } }
        );

        const internalExamData = { 
            institution: existBatch.institution, 
            program: existBatch.program, 
            academic_year: semesterData.academic_year,
            regulation: existBatch.regulation,
            department: existBatch.department,
            course_name: existBatch.course_name,
            semester_name: semesterData.semester_name,
            batch_name: existBatch.batch_name,
            exam_name: 'Internal Exam',
            semester: id,    
        }
        const creationResult = await Exam.create(internalExamData);
        const examId = creationResult._id;

        await Batch.updateOne({ _id: existBatch._id }, { $push: { exams: examId } });

        const UniversityExamData = { 
            institution: existBatch.institution, 
            program: existBatch.program, 
            academic_year: semesterData.academic_year,
            regulation: existBatch.regulation,
            department: existBatch.department,
            course_name: existBatch.course_name,
            semester_name: semesterData.semester_name,
            batch_name: existBatch.batch_name,
            exam_name: 'University Exam',
            semester: id,    
        }
        const creationUniversityExamResult = await Exam.create(UniversityExamData);
        const UniversityExamId = creationUniversityExamResult._id;

        await Batch.updateOne({ _id: existBatch._id }, { $push: { exams: UniversityExamId } });

        res.status(200).json({ success: true, message: "Semester created successfully" });
    } catch (err) {
        next(err);
    }
};
