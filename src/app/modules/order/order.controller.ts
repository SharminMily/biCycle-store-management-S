import { NextFunction, Request, Response } from 'express';
import { OrderServices } from './order.services';
import { ProductModel } from '../product/product.model';
import mongoose from 'mongoose';
import Order from './order.model';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import httpStatus from "http-status";

interface AuthenticatedRequest extends Request {
  user?: { email: string; role: string };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const createOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user =  req.user._id ;

  const order = await OrderServices.orderCreate(user, req.body, req.ip!);

    sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Order placed successfully",
    data: order, 
  });
});

const verifyPayment = catchAsync(async (req, res) => {
  const result = await OrderServices.verifyPayment(req.query.sp_trxn_id as string);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Order verified successfully",
    data: result, // Now includes full order, user, and product details
  });
});


//
const getAllOrder = async (req: Request, res: Response) => {
  try {
    const result = await OrderServices.getAllOrder();
    if (!result) {
      res.status(404).json({
        success: false,
        message: 'Order not found',
        error: 'Resource not found',
      });
    }
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
    if (!result) {
      res.status(404).json({
        success: false,
        message: 'Order not found ',
        error: 'Resource not found',
      });
    }
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
    if (!result) {
      res.status(404).json({
        success: false,
        message: 'Order not found ',
        error: 'Resource not found',
      });
    }
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
    const { id } = req.params;

    const result = await Order.findByIdAndDelete(id);
    if (!result) {
      res.status(404).json({
        success: false,
        message: 'Order not found to delete',
        error: 'Resource not found',
        data: [],
      });
    }
    //send response
    res.status(200).json({
      success: true,
      message: 'Order delete successfully',
      data: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went Wrong',
      error: error,
    });
  }
};

const calculateAllOrder = async (req: Request, res: Response) => {
  try {
    const result = await Order.aggregate([
      {
        $group: {
          _id: null, // Group all orders
          totalRevenue: { $sum: '$totalPrice' }, // Calculate total revenue
        },
      },
    ]);

    const totalRevenue = result[0]?.totalRevenue || 0;
    // console.log(totalRevenue, 'totalRevenue ')
    res.status(200).json({
      message: 'Revenue calculated successfully',
      status: true,
      data: { totalRevenue },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
      status: false,
      error: error,
    });
  }
};

export const OrderControllers = {
  createOrder,
  verifyPayment,
  getAllOrder,
  getSingleOrder,
  getUpdateOrder,
  getDeleteOrder,
  calculateAllOrder,
};
