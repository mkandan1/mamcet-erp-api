import { Semester } from "../models/Semester.js"

export const createSemester = async (req, res, next) => {
    try {
        const semesterData = req.body;
        const existSemester = await Semester.findOne({ semester_name: semesterData.semester_name, batch_name: semesterData.batch_name, deparment: semesterData.deparment, course_name: semesterData.course_name });
        if(existSemester){
            return res.status(409).json({success: false, message: "Semester already exist in the record"})
        }
        await Semester.create(semesterData);
        res.status(200).json({success: false, message: "Semester created successfully"})
    }
    catch (err) {
        next(err)
    }
}