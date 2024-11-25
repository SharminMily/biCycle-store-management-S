import express from 'express';
import { OrderControllers } from './order.controller';

const router = express.Router();

// console.log("OrderControllers:", OrderControllers);
router.get('/revenue', OrderControllers.calculateAllOrder);
router.get('/:id', OrderControllers.getSingleOrder);
router.get('/', OrderControllers.getAllOrder);
router.post('/', OrderControllers.createOrder);
router.put('/:id', OrderControllers.getUpdateOrder);
router.delete('/:id', OrderControllers.getDeleteOrder);

export const OrderRoutes = router;
