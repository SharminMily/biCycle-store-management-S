import express from 'express'
import { OrderControllers } from './order.controller';

const router = express.Router()

router.post('/create-order', OrderControllers.createOrder);

router.get('/', OrderControllers.getAllOrder);

router.get('/:id', OrderControllers.getSingleOrder);

router.put('/:id', OrderControllers.getUpdateOrder);

router.delete('/:id', OrderControllers.getDeleteOrder)

export const OrderRoutes =  router;