import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { error } from './middlewares/error-middleware.js';
import { authRouter } from './routers/auth-router.js';
import { employeeRouter } from './routers/employee-router.js';
import { checkAuthorization } from './middlewares/auth-middleware.js';
import { decryptMiddleware } from './middlewares/decrypt-middleware.js';
import { connect } from './config/db.js';

const PORT = 3030;
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

connect()

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });
app.use(error);
app.use(checkAuthorization);
app.use(decryptMiddleware);

app.use('/api/auth', authRouter);
app.use('/api/employee', employeeRouter);

app.use(error);

app.listen(PORT, ()=> console.log(`Server listening at http://localhost:${PORT}`))