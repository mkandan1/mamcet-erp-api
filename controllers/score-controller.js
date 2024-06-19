import { ObjectId } from "mongodb";
import { Exam } from "../models/Exam.js";
import { Score } from "../models/Score.js";
import { Student } from "../models/Student.js";

const updateScore = async (req, res, next) => {
    try {
        const examData = req.body;
        const { _id, scores, exam_name } = examData;

        const existExam = await Exam.findOne({ _id: new ObjectId(_id) }).populate('scores');

        if (!existExam) {
            return res.status(404).json({ success: false, message: "Exam not found" });
        }

        const { stud_id, examType, sub_id, score, passingYear } = scores;

        let existingScore = await Score.findOne({
            stud_id: new ObjectId(stud_id),
            examType,
            sub_id: new ObjectId(sub_id)
        });

        if (existingScore) {
            existingScore.score = score;
            if (passingYear && existingScore.passingYear !== passingYear) {
                existingScore.passingYear = passingYear;
            }
            await existingScore.save();
        } else {
            const newScore = new Score({
                ...scores,
                stud_id: new ObjectId(stud_id),
                sub_id: new ObjectId(sub_id)
            });
            await newScore.save();
            existExam.scores.push(newScore._id);
            await existExam.save();
        }

        if (examType === 'university') {
            const student = await Student.findById(stud_id).populate('semesterStats.semester');

            if (!student) {
                return res.status(404).json({ success: false, message: "Student not found" });
            }

            let semesterStat = student.semesterStats.find(stat => stat.semester._id.equals(existExam.semester));

            if (semesterStat) {
                const currentSubjectIndex = semesterStat.subjects.findIndex(subject => subject.sub_id.equals(sub_id));
                
                if (currentSubjectIndex >= 0) {
                    semesterStat.subjects[currentSubjectIndex].score = score;
                    semesterStat.subjects[currentSubjectIndex].passingYear = passingYear;
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

                // Update CGPA
                student.cgpa = calculateCGPA(student.semesterStats);
            } else {
                semesterStat = {
                    semester: existExam.semester,
                    gpa: score < 50 ? 0 : calculateGPA([score]),
                    arrears: score < 50 ? [sub_id] : [],
                    subjects: [{ sub_id, score, passingYear }]
                };
                student.semesterStats.push(semesterStat);
                student.cgpa = calculateCGPA(student.semesterStats);
            }

            // Update history of arrears
            if (score < 50) {
                if (!student.history_of_arrears.includes(sub_id)) {
                    student.history_of_arrears.push(sub_id);
                }
            } else {
                student.history_of_arrears = student.history_of_arrears.filter(arrear => !arrear.equals(sub_id));
            }

            await student.save();
        }

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
    const totalGPA = semesterStats.reduce((acc, stat) => acc + stat.gpa, 0);
    return totalGPA / semesterStats.length;
};

export { updateScore };
