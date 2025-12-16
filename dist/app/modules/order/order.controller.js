"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderControllers = void 0;
const order_services_1 = require("./order.services");
const order_model_1 = __importDefault(require("./order.model"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../../helpers/AppError"));
// interface AuthenticatedRequest extends Request {
//   user?: { email: string; role: string };
// }
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const createOrder = (0, catchAsync_1.default)(async (req, res, next) => {
    if (!req.user) {
        return next(new AppError_1.default(http_status_1.default.UNAUTHORIZED, "User not authenticated"));
    }
    const user = req.user._id;
    const order = await order_services_1.OrderServices.orderCreate(user, req.body, req.ip);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        message: "Order placed successfully",
        data: order,
    });
});
const verifyPayment = (0, catchAsync_1.default)(async (req, res) => {
    const result = await order_services_1.OrderServices.verifyPayment(req.query.sp_trxn_id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        message: "Order verified successfully",
        data: result,
    });
});
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
        const result = await order_model_1.default.findByIdAndDelete(id);
        if (!result) {
            res.status(404).json({
                success: false,
                message: 'Order not found to delete',
                error: 'Resource not found',
                data: [],
            });
        }
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
        const result = await order_model_1.default.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalPrice' },
                },
            },
        ]);
        const totalRevenue = result[0]?.totalRevenue || 0;
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
    verifyPayment,
    getAllOrder,
    getSingleOrder,
    getUpdateOrder,
    getDeleteOrder,
    calculateAllOrder,
};
