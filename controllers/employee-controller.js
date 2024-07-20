import { Employee } from "../models/Employee.js";
import bcrypt from 'bcryptjs';

const addNewEmployee = async (req, res, next) => {
  try {
    const employeeData = req.body;
    const doesEmployeeExist = await Employee.findOne({
      email: employeeData.email,
    });

    if (doesEmployeeExist) {
      return res
        .status(409)
        .json({ success: false, message: "Employee already exists with our record" });
    }

    const hashedPassword = bcrypt.hashSync(employeeData.password, 10);
    employeeData.password = hashedPassword;

    await Employee.create(employeeData);
    res.status(201).json({ success: true, message: "Employee has been added" });
  } catch (err) {
    next(err);
  }
};

const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find();
    res.status(200).json({ success: true, employees });
  } catch (err) {
    next(err);
  }
};

export { addNewEmployee, getAllEmployees };
