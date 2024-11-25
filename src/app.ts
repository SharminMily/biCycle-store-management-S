import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { ProductRoutes } from './app/modules/product/product.route';
import { OrderRoutes } from './app/modules/order/order.route';

const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

//aplication router
app.use('/api/v1/products', ProductRoutes);
app.use('/api/v1/orders', OrderRoutes);

const getAController = (req: Request, res: Response) => {
  res.send();
};

app.get('/', getAController);

export default app;
