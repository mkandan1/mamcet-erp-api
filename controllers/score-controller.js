import { ObjectId } from "mongodb";
import { Exam } from "../models/Exam.js";
import { Score } from "../models/Score.js";
import { Student } from "../models/Student.js";
import { SemesterStats } from "../models/SemesterStats.js"; // Assuming you have a SemesterStats model

const updateScore = async (req, res, next) => {
    try {
        const { _id, scores } = req.body;

        const existExam = await Exam.findOne({ _id: new ObjectId(_id) }).populate('scores');

        if (!existExam) {
            return res.status(404).json({ success: false, message: "Exam not found" });
        }

        const promises = scores.map(async (scoreData) => {
            const { stud_id, examType, sub_id, score, passingYear } = scoreData;

            let existingScore = await Score.findOne({
                stud_id: new ObjectId(stud_id),
                examType,
                sub_id: new ObjectId(sub_id)
            });

            if (existingScore) {
                existingScore.score = score;
                if (examType === 'University' && passingYear && existingScore.passingYear !== passingYear) {
                    existingScore.passingYear = passingYear;
                }
                await existingScore.save();
            } else {
                const newScore = new Score({
                    ...scoreData,
                    stud_id: new ObjectId(stud_id),
                    sub_id: new ObjectId(sub_id)
                });
                await newScore.save();
                existExam.scores.push(newScore._id);
                await existExam.save();
            }

            if (examType === 'University') {
                const student = await Student.findById(stud_id).populate('semesterstats');

                if (!student) {
                    return res.status(404).json({ success: false, message: "Student not found" });
                }

                let semesterStat = student.semesterStats.find(stat => stat.semester.equals(existExam.semester));

                if (!semesterStat) {
                    // If semesterStat is not found, create a new one
                    semesterStat = new SemesterStats({
                        semester: existExam.semester,
                        gpa: 0, // Initialize GPA or calculate based on your logic
                        arrears: [], // Initialize arrears array
                        subjects: [] // Initialize subjects array
                    });
                    student.semesterStats.push(semesterStat);
                }

                // Ensure semesterStat.subjects is initialized properly
                if (!semesterStat.subjects) {
                    semesterStat.subjects = [];
                }

                // Now you can safely access and manipulate semesterStat subjects
                const currentSubjectIndex = semesterStat.subjects.findIndex(subject => subject.sub_id.equals(sub_id));
                if (currentSubjectIndex >= 0) {
                    semesterStat.subjects[currentSubjectIndex].score = score;
                    if (passingYear && semesterStat.subjects[currentSubjectIndex].passingYear !== passingYear) {
                        semesterStat.subjects[currentSubjectIndex].passingYear = passingYear;
                    }
                } else {
                    semesterStat.subjects.push({ sub_id, score, passingYear });
                }

                // Update GPA for the semester
                semesterStat.gpa = calculateGPA(semesterStat.subjects.map(subject => subject.score));

                // Update current arrears
                if (score < 50) {
                    if (!semesterStat.arrears.includes(sub_id)) {
                        semesterStat.arrears.push(sub_id);
                    }
                } else {
                    semesterStat.arrears = semesterStat.arrears.filter(arrear => !arrear.equals(sub_id));
                }

                // Update CGPA for the student
                student.cgpa = calculateCGPA(student.semesterStats);

                // Save the updated student
                await student.save();
            }
        });

        await Promise.all(promises);

        return res.status(200).json({ success: true, message: "Scores updated successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "An error occurred while updating scores" });
    }
};

const calculateGPA = (scores) => {
    if (scores.length === 0) return 0;
    return scores.reduce((acc, score) => acc + score, 0) / scores.length;
};

const calculateCGPA = (semesterStats) => {
    if (semesterStats.length === 0) return 0;
    const totalGPA = semesterStats.reduce((acc, stat) => acc + stat.gpa, 0);
    return totalGPA / semesterStats.length;
};

export { updateScore };
