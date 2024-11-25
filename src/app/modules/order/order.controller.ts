import { Request, Response } from 'express';
import { OrderServices } from './order.services';
import { ProductModel } from '../product/product.model';
import { OrderModel } from './order.model';
import mongoose from 'mongoose';


const createOrder = async (req: Request, res: Response) => {
  try {
    const { email, product, quantity } = req.body;

    if (mongoose.Types.ObjectId.isValid(product)) {
      const foundProduct = await ProductModel.findById(product);
      if (foundProduct) {
        if (foundProduct.quantity >= quantity) {
          const countedTotalPrice = foundProduct.price * quantity;

          foundProduct.quantity -= quantity;
          if (foundProduct.quantity === 0) {
            foundProduct.inStock = false;
          }
          await foundProduct.save();

          const newOrder = new OrderModel({
            email,
            product,
            quantity,
            totalPrice: countedTotalPrice,
          });
          await newOrder.save();

          res.status(201).json({
            message: 'Order created successfully',
            status: true,
            data: newOrder,
          });
        } else {
          res.status(400).json({ message: 'Insufficient stock available' });
        }
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } else {
      res.status(400).json({ message: 'Invalid product ID' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};
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
    const id = req.params.id;

    const result = await OrderServices.getDeleteOrder(id);
    if (!result) {
      res.status(404).json({
        success: false,
        message: 'Order not found to delete',
        error: 'Resource not found',
      });
    }
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


const calculateAllOrder = async (req: Request, res: Response) => {
  try {
    const result = await OrderModel.aggregate([
      {
        $group: {
          _id: null, // Group all orders
          totalRevenue: { $sum: "$totalPrice" }, // Calculate total revenue
        },
      },
    ]);

    const totalRevenue = result[0]?.totalRevenue || 0;
    // console.log(totalRevenue, 'totalRevenue ')
    res.status(200).json({
      message: 'Revenue calculated successfully',
      status: true,
      data: { totalRevenue },
    })

  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
      status: false,
      error: error,
    });
  }
}


export const OrderControllers = {
  createOrder,
  getAllOrder,
  getSingleOrder,
  getUpdateOrder,
  getDeleteOrder,
  calculateAllOrder 
};
