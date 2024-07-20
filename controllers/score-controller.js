import { ObjectId } from "mongodb";
import { Exam } from "../models/Exam.js";
import { Score } from "../models/Score.js";
import { Student } from "../models/Student.js";
import { SemesterStats } from "../models/SemesterStats.js";
import { Semester } from "../models/Semester.js";
import { Batch } from "../models/Batch.js";
import WebSocket from 'ws';

const updateUniversityScore = async (req, res, next) => {
  try {
    const { _id, scoreData } = req.body;

    // Find the existing exam
    const existExam = await Exam.findById(_id).populate('scores');
    if (!existExam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    // Find or create the score
    const existScore = await Score.findOne({
      stud_id: scoreData.stud_id,
      registerNumber: scoreData.registerNumber,
      sub_code: scoreData.sub_code,
      examType: 'University'
    });

    if (existScore) {
      // Update the existing score
      existScore.score = scoreData.score;
      if (scoreData.passingYear) {
        existScore.passingYear = scoreData.passingYear;
      }
      await existScore.save();
    } else {
      // Create a new score
      const newScore = new Score(scoreData);
      await newScore.save();
      existExam.scores.push(newScore._id);
      await existExam.save();
    }

    // Recalculate GPA and CGPA
    const studentScores = await Score.find({ stud_id: scoreData.stud_id }).populate('sub_id');
    const semester = await Semester.findOne({
      department: existExam.department,
      batch_name: existExam.batch_name,
      semester_name: existExam.semester_name,
      course_name: existExam.course_name
    }).populate('subjects.subjectId');
    const subjects = semester.subjects;

    let totalCredits = 0;
    let weightedSum = 0;
    let arrears = [];

    studentScores.forEach(score => {
      const subject = subjects.find(sub => sub.subjectId._id.equals(score.sub_id._id));
      if (subject) {
        const gradePoints = score.score; // Assuming score is directly used for grade points
        totalCredits += subject.subjectId.sub_credits;
        weightedSum += gradePoints * subject.subjectId.sub_credits;
        if (gradePoints === 0) {
          arrears.push(subject.subjectId._id);
        }
      }
    });

    const gpa = totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : 0;

    // Update student's GPA and arrears
    const student = await Student.findById(scoreData.stud_id);
    if (student) {
      const semesterIndex = student.semesterStats.findIndex(stat => stat.semester_name === existExam.semester_name);
      if (semesterIndex !== -1) {
        student.semesterStats[semesterIndex].gpa = gpa;
        student.semesterStats[semesterIndex].arrears = arrears;
      } else {
        student.semesterStats.push({
          semester_name: existExam.semester_name,
          gpa,
          arrears
        });
      }

      arrears.forEach(arrear => {
        if (!student.history_of_arrears.includes(arrear)) {
          student.history_of_arrears.push(arrear);
        }
      });

      const totalGpaSum = student.semesterStats.reduce((sum, stat) => sum + parseFloat(stat.gpa), 0);
      const totalSemesters = student.semesterStats.length;
      student.cgpa = totalSemesters > 0 ? (totalGpaSum / totalSemesters).toFixed(3) : 0;

      await student.save();
    }

    // Retrieve the batch with updated student details
    const existBatch = await Batch.findOne({
      department: existExam.department,
      course_name: existExam.course_name,
      batch_name: existExam.batch_name
    }).populate({ path: 'students', select: "registerNumber name cgpa history_of_arrears semesterStats" });

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
    const { registerNumber, sub_code, examType, score, name, stud_id, sub_id } = scoreData;
    const numericScore = Number(score); // Convert the score to a number

    // Find the exam
    const exam = await Exam.findById(_id).populate('scores');
    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    // Check if the score already exists
    let existingScore = await Score.findOne({
      registerNumber,
      sub_code,
      examType
    });

    // If the score exists, update it if it's different
    if (existingScore) {
      if (existingScore.score !== numericScore) {
        existingScore.score = numericScore;
        await existingScore.save();
        return res.status(200).json({ success: true, message: "Score updated successfully", exam });
      }
    } else {
      // Create a new score if it doesn't exist
      const newScore = new Score({
        examType,
        stud_id: new ObjectId(stud_id),
        sub_id: new ObjectId(sub_id),
        name,
        registerNumber,
        sub_code,
        score: numericScore
      });

      const savedScore = await newScore.save();
      exam.scores.push(savedScore._id);
      await exam.save();

      return res.status(200).json({ success: true, message: "Score added successfully", exam });
    }

    // If no changes were made
    return res.status(200).json({ success: false, message: "No changes made", exam });

  } catch (err) {
    next(err);
  }
};


export { updateUniversityScore, updateInternalScore };
