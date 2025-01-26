import express, { Application, Request, Response } from 'express';
import cors from 'cors';

import { OrderRoutes } from './app/modules/order/order.route';
import { ProductRoutes } from './app/modules/product/product.route';
import userRouter from './app/modules/user/user.route';
import authRouter from './app/modules/Auth/auth.route';

const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

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
