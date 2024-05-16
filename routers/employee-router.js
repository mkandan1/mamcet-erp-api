import express from 'express'
import { addNewEmployee } from '../controllers/employee-controller.js'

const employeeRouter = express.Router();

employeeRouter.route('/add').post(addNewEmployee);

export {
    employeeRouter
}