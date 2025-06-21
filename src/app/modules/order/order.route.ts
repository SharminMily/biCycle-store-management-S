import express from 'express';
import { OrderControllers } from './order.controller';
import auth from '../../../middlewares/auth';

const router = express.Router();

router.get('/revenue',auth('admin', 'user'),  OrderControllers.calculateAllOrder);

router.get("/verify", auth('admin', 'user'), OrderControllers.verifyPayment);

router.get('/:id',auth('admin', 'user'), OrderControllers.getSingleOrder);

router.get('/', auth('admin'), OrderControllers.getAllOrder);

router.post('/',auth('admin', 'user'), OrderControllers.createOrder);

router.put('/:id',auth('admin', 'user'), OrderControllers.getUpdateOrder);

router.delete('/:id',auth('admin', 'user'), OrderControllers.getDeleteOrder);

export const OrderRoutes = router;
