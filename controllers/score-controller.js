import { ObjectId } from "mongodb";
import { Exam } from "../models/Exam.js";
import { Score } from "../models/Score.js";
import { Student } from "../models/Student.js";
import { SemesterStats } from "../models/SemesterStats.js";
import { Semester } from "../models/Semester.js";
import { Batch } from "../models/Batch.js";

const updateUniversityScore = async (req, res, next) => {
    try {
        const { _id, batch_name, institution, department, course_name, semester_name, scoreData } = req.body;

        // Find the existing exam
        const existExam = await Exam.findOne({ _id: new ObjectId(_id) }).populate('scores');
        if (!existExam) {
            return res.status(404).json({ success: false, message: "Exam not found" });
        }

        // Find the existing score
        const existScore = await Score.findOne({
            stud_id: scoreData.stud_id,
            registerNumber: scoreData.registerNumber,
            sub_code: scoreData.sub_code
        });

        if (existScore) {
            // Update the existing score
            if (!scoreData.passingYear || existScore.passingYear === scoreData.passingYear) {
                existScore.score = scoreData.score;
            } else if (existScore.passingYear !== scoreData.passingYear) {
                existScore.passingYear = scoreData.passingYear;
            }
            await existScore.save();
        } else {
            // Create a new score
            const newScore = new Score(scoreData);
            await newScore.save();
            existExam.scores.push(newScore);
            await existExam.save();
        }

        // Get all scores for the student for GPA calculation
        const studentScores = await Score.find({ stud_id: scoreData.stud_id, examType: 'University' }).populate('sub_id');

        // Get semester subjects and their credits
        const semester = await Semester.findOne({ batch_name, semester_name, course_name }).populate('subjects');
        const subjects = semester.subjects;

        let totalCredits = 0;
        let weightedSum = 0;
        let arrears = [];

        studentScores.forEach(score => {
            const subject = subjects.find(sub => sub._id.equals(score.sub_id._id));
            if (subject) {
                const gradePoints = score.score; // Score is already from 0 to 10
                totalCredits += subject.sub_credits;
                weightedSum += gradePoints * subject.sub_credits;
                if (gradePoints === 0) {
                    arrears.push(subject._id);
                }
            }
        });

        const gpa = totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : 0;

        // Update the student's GPA and arrears for the specific semester
        const student = await Student.findOne({ _id: scoreData.stud_id });
        if (student) {
            const semesterIndex = student.semesterStats.findIndex(stat => stat.semester_name === semester_name);
            if (semesterIndex !== -1) {
                student.semesterStats[semesterIndex].gpa = gpa;
                student.semesterStats[semesterIndex].arrears = arrears;
            } else {
                student.semesterStats.push({ semester_name, gpa, arrears });
            }

            // Update history of arrears
            arrears.forEach(arrear => {
                if (!student.history_of_arrears.includes(arrear)) {
                    student.history_of_arrears.push(arrear);
                }
            });

            // Calculate CGPA
            const totalGpaSum = student.semesterStats.reduce((sum, stat) => sum + parseFloat(stat.gpa), 0);
            const totalSemesters = student.semesterStats.length;
            student.cgpa = totalSemesters > 0 ? (totalGpaSum / totalSemesters).toFixed(2) : 0;

            await student.save();
        }

        const existBatch = await Batch.findOne({   department, course_name, batch_name })
        .populate({
            path: 'students',
            select: "registerNumber name cgpa history_of_arrears semesterStats current_arrears",
        })
        const students = existBatch.students;
        return res.status(200).json({ success: true, message: "Scores updated successfully", students });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "An error occurred while updating scores" });
    }
};

const updateInternalScore = async (req, res, next) => {
    try {
        const { _id, scoreData } = req.body;

        const existExam = await Exam.findOne({ _id: new ObjectId(_id) }).populate('scores');

        if (!existExam) {
            return res.status(404).json({ success: false, message: "Exam not found" });
        }


        const existScore = await Score.findOne({stud_id: scoreData.stud_id, registerNumber: scoreData.stud_id, })

        return res.status(200).json({ success: true, message: "Scores updated successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "An error occurred while updating scores" });
    }
};

export { updateUniversityScore };
