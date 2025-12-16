"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderServices = void 0;
const product_model_1 = require("../product/product.model");
const order_model_1 = __importDefault(require("./order.model"));
const AppError_1 = __importDefault(require("../../../helpers/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("../user/user.model");
const order_utils_1 = require("./order.utils");
const mongoose_1 = require("mongoose");
const orderCreate = async (user, // It might be just an ObjectId (string) or the full user document
payload, client_ip) => {
    // console.log('Received user data:', user);
    // If `user` is only an ObjectId (string) or an instance of Types.ObjectId, fetch the full user document
    let fullUser;
    if (typeof user === 'string' || user instanceof mongoose_1.Types.ObjectId) {
        fullUser = await user_model_1.User.findById(user);
    }
    else {
        fullUser = user; // Already a full document
    }
    if (!fullUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    // console.log('Fetched Full User:', fullUser);
    // Declare and initialize totalPrice
    let totalPrice = 0;
    // Fetch product details and calculate total price
    const productDetails = await Promise.all(payload.products.map(async (item) => {
        const product = await product_model_1.ProductModel.findById(item.product);
        if (!product) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Product not found');
        }
        // Calculate subtotal for this product and add it to totalPrice
        totalPrice += (product.price || 0) * item.quantity;
        return { product: product._id, quantity: item.quantity };
    }));
    // Create the order with the correct user ObjectId
    let order = await order_model_1.default.create({
        user: fullUser._id, // Use the ObjectId from the full user document
        products: productDetails,
        totalPrice,
    });
    // Payment integration code
    const shurjopayPayload = {
        amount: totalPrice,
        order_id: order._id,
        currency: 'BDT',
        customer_name: fullUser.name,
        customer_address: fullUser.address,
        customer_email: fullUser.email,
        customer_phone: fullUser.phone,
        customer_city: fullUser.city,
        client_ip,
    };
    // console.log('Payment Payload:', shurjopayPayload);
    const payment = await order_utils_1.orderUtils.makePaymentAsync(shurjopayPayload);
    if (payment?.transactionStatus) {
        order = await order.updateOne({
            transaction: {
                id: payment.sp_order_id,
                transactionStatus: payment.transactionStatus,
            },
        });
    }
    // console.log(payment.checkout_url, 'Payment checkout URL');
    // Return both the checkout URL and the full user document
    return { checkout_url: payment.checkout_url, user: fullUser };
};
const verifyPayment = async (order_id) => {
    const verifiedPayment = await order_utils_1.orderUtils.verifyPaymentAsync(order_id);
    if (verifiedPayment.length) {
        const updatedOrder = await order_model_1.default.findOneAndUpdate({
            'transaction.id': order_id,
        }, {
            'transaction.bank_status': verifiedPayment[0].bank_status,
            'transaction.sp_code': verifiedPayment[0].sp_code,
            'transaction.sp_message': verifiedPayment[0].sp_message,
            'transaction.transactionStatus': verifiedPayment[0].transaction_status,
            'transaction.method': verifiedPayment[0].method,
            'transaction.date_time': verifiedPayment[0].date_time,
            status: verifiedPayment[0].bank_status == 'Success'
                ? 'Paid'
                : verifiedPayment[0].bank_status == 'Failed'
                    ? 'Pending'
                    : verifiedPayment[0].bank_status == 'Cancel'
                        ? 'Cancelled'
                        : '',
        }, { new: true })
            .populate("user", "name email phone address city") // Populate user details
            .populate("products.product", "name price image"); // Populate product details
        if (!updatedOrder) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order not found!");
        }
        return {
            order: updatedOrder,
            payment: verifiedPayment[0], // Include payment details if needed
        };
    }
    throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid payment verification!");
};
//get Order
const getAllOrder = async () => {
    const result = await order_model_1.default.find();
    return result;
};
const getSingleOrder = async (id) => {
    const result = await order_model_1.default.findById(id);
    return result;
};
const getUpdateOrder = async (id, data) => {
    const result = await order_model_1.default.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    return result;
};
const getDeleteOrder = async (id) => {
    const result = await order_model_1.default.findByIdAndDelete(id);
    return result;
};
exports.OrderServices = {
    orderCreate,
    verifyPayment,
    getAllOrder,
    getSingleOrder,
    getUpdateOrder,
    getDeleteOrder,
};
