import { Employee } from "../models/Employee.js";
import bcrypt from 'bcryptjs';

const addNewEmployee = async (req, res, next) => {
  try {
    const employeeData = req.body;
    const doesEmployeeExist = await Employee.findOne({
      email: employeeData.email,
    });

    const hashedPassword = bcrypt.hashSync(employeeData.password, 10);
    delete employeeData.password
    employeeData.password = hashedPassword

    if (doesEmployeeExist) {
      res
        .status(409)
        .json({ success: true, message: "Emplyee already exist with our record" });
    }
    await Employee.create(employeeData)
    res.status(201).json({ success: true, message: "Emplyee has been added" });
  } catch (err) {
    next(err);
  }
};

export { addNewEmployee };
