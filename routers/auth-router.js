import express from 'express';
import { login, onAuthState } from '../controllers/auth-controller.js';
const authRouter = express.Router();

authRouter.route('/login').post(login);
authRouter.route('/user-state').get(onAuthState)

export {
    authRouter
}