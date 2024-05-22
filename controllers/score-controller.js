import { ObjectId } from "mongodb";
import { Exam } from "../models/Exam.js";
import { Score } from "../models/Score.js"; // Assuming the Score model is in the models directory

const updateScore = async (req, res, next) => {
    try {
        const examData = req.body;
        const { _id, scores } = examData;

        const existExam = await Exam.findOne({ _id: new ObjectId(_id) }).populate('scores');

        if (!existExam) {
            return res.status(404).json({ success: false, message: "Exam not found" });
        }

        let changesMade = false;

        for (const scoreData of scores) {
            const { registerNumber, sub_code, examType, passingYear, score, name, stud_id, sub_id } = scoreData;
            const numericScore = Number(score);
            let scoreUpdated = false;

            for (let i = 0; i < existExam.scores.length; i++) {
                const scoreId = existExam.scores[i];
                const scoreDoc = await Score.findOne({ _id: scoreId });

                if (
                    scoreDoc.registerNumber === registerNumber &&
                    scoreDoc.sub_code === sub_code &&
                    scoreDoc.examType === examType
                ) {
                    if (scoreDoc.score !== numericScore) {
                        scoreDoc.score = numericScore;
                        await scoreDoc.save();
                        scoreUpdated = true;
                        changesMade = true;
                    }
                    else if(examType == 'University' && (scoreDoc.score !== numericScore || scoreDoc.passingYear !== passingYear)){
                        scoreDoc.score = numericScore;
                        scoreDoc.passingYear = passingYear
                        await scoreDoc.save();
                        scoreUpdated = true;
                        changesMade = true;
                    }
                    break;
                }
            }

            if (!scoreUpdated) {
                // Check if the exact same score already exists
                const existingScore = await Score.findOne({
                    registerNumber,
                    sub_code,
                    examType,
                    score: numericScore
                });

                if (!existingScore) {
                    const newScore = new Score({
                        examType: examType,
                        stud_id: new ObjectId(stud_id),
                        sub_id: new ObjectId(sub_id),
                        name: name,
                        passingYear: passingYear,
                        registerNumber: registerNumber,
                        sub_code: sub_code,
                        score: numericScore
                    });

                    const savedScore = await newScore.save();
                    existExam.scores.push(savedScore._id);
                    changesMade = true;
                }
            }
        }

        if (changesMade) {
            await existExam.save();
            return res.status(200).json({ success: true, message: "Scores updated successfully", exam: existExam });
        } else {
            return res.status(200).json({ success: false, message: "Please enter new or update score", exam: existExam });
        }

    } catch (err) {
        next(err);
    }
};

export { updateScore };
