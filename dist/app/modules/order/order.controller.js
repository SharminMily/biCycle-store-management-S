"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderControllers = void 0;
const order_services_1 = require("./order.services");
const product_model_1 = require("../product/product.model");
const order_model_1 = require("./order.model");
const mongoose_1 = __importDefault(require("mongoose"));
const createOrder = async (req, res) => {
    try {
        const { email, product, quantity } = req.body;
        if (mongoose_1.default.Types.ObjectId.isValid(product)) {
            const foundProduct = await product_model_1.ProductModel.findById(product);
            if (foundProduct) {
                if (foundProduct.quantity >= quantity) {
                    const countedTotalPrice = foundProduct.price * quantity;
                    foundProduct.quantity -= quantity;
                    if (foundProduct.quantity === 0) {
                        foundProduct.inStock = false;
                    }
                    await foundProduct.save();
                    const newOrder = new order_model_1.OrderModel({
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
                }
                else {
                    res.status(400).json({ message: 'Insufficient stock available' });
                }
            }
            else {
                res.status(404).json({ message: 'Product not found' });
            }
        }
        else {
            res.status(400).json({ message: 'Invalid product ID' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};
const getAllOrder = async (req, res) => {
    try {
        const result = await order_services_1.OrderServices.getAllOrder();
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went Wrong',
            error: error,
        });
    }
};
const getSingleOrder = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await order_services_1.OrderServices.getSingleOrder(id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went Wrong',
            error: error,
        });
    }
};
const getUpdateOrder = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const result = await order_services_1.OrderServices.getUpdateOrder(id, body);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went Wrong',
            error: error,
        });
    }
};
const getDeleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await order_model_1.OrderModel.findByIdAndDelete(id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went Wrong',
            error: error,
        });
    }
};
const calculateAllOrder = async (req, res) => {
    try {
        const result = await order_model_1.OrderModel.aggregate([
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
    }
    catch (error) {
        res.status(500).json({
            message: 'Something went wrong',
            status: false,
            error: error,
        });
    }
};
exports.OrderControllers = {
    createOrder,
    getAllOrder,
    getSingleOrder,
    getUpdateOrder,
    getDeleteOrder,
    calculateAllOrder,
};
