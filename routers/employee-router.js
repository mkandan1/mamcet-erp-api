import express from 'express'
import { addNewEmployee, getAllEmployees } from '../controllers/employee-controller.js'

const employeeRouter = express.Router();

employeeRouter.route('/add').post(addNewEmployee);
employeeRouter.route('/').get(getAllEmployees);

export {
    employeeRouter
}