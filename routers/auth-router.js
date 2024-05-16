import express from 'express';
import { login } from '../controllers/auth-controller.js';
const authRouter = express.Router();

authRouter.route('/login').post(login);

export {
    authRouter
}