import express, { Application, Request, Response } from 'express';
import cors from 'cors';

import { OrderRoutes } from './app/modules/order/order.route';
import { ProductRoutes } from './app/modules/product/product.route';
import userRouter from './app/modules/user/user.route';
import authRouter from './app/modules/Auth/auth.route';
import cookieParser from 'cookie-parser'
const app: Application = express();

//parsers
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); 
app.use(cors({origin: 'http://localhost:5173', credentials: true})); //for access token & cookie

//aplication router
app.use('/api/products', ProductRoutes);
app.use('/api/orders', OrderRoutes);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

const getAController = (req: Request, res: Response) => {
  res.send();
};

app.get('/', getAController);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});


export default app;
