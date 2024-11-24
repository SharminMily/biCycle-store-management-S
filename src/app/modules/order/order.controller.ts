import { Request, Response } from 'express';
import { OrderServices } from './order.services';

const createOrder = async (req: Request, res: Response) => {
  try {
    const { order: orderData } = req.body;

    const result = await OrderServices.orderCreate(orderData);
    //send response
    res.status(200).json({
      success: true,
      message: 'order is create successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went Wrong',
      error: error,
    });
  }
};

const getAllOrder = async (req: Request, res: Response) => {
  try {
    const result = await OrderServices.getAllOrder();

    //send response
    res.status(200).json({
      success: true,
      message: 'Product get successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went Wrong',
      error: error,
    });
  }
};

const getSingleOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const result = await OrderServices.getSingleOrder(id);
    //send response
    res.status(200).json({
      success: true,
      message: 'Single Product get successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went Wrong',
      error: error,
    });
  }
};

const getUpdateOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const body = req.body;

    const result = await OrderServices.getUpdateOrder(id, body);
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went Wrong',
      error: error,
    });
  }
};


const getDeleteOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const result = await OrderServices.getDeleteOrder(id);
    //send response
    res.status(200).json({
      success: true,
      message: 'product delete successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went Wrong',
      error: error,
    });
  }
};



export const OrderControllers = {
    createOrder,
    getAllOrder,
  getSingleOrder,
  getUpdateOrder,
  getDeleteOrder,
};
