"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderServices = void 0;
const product_model_1 = require("../product/product.model");
const order_model_1 = require("./order.model");
const orderCreate = async (order) => {
    const { product, quantity } = order;
    // find cicyle
    const productData = await product_model_1.ProductModel.findById(product);
    if (!productData) {
        throw new Error('Product not found');
    }
    // check stock quantity
    if (productData.quantity < quantity) {
        throw new Error('Insufficient stock');
    }
    // quantity update
    productData.quantity -= quantity;
    if (productData.quantity === 0) {
        productData.inStock = false;
    }
    // save cycle
    await productData.save();
    // new order create
    // order save
    const result = await order_model_1.OrderModel.create(order);
    return result;
};
const getAllOrder = async () => {
    const result = await order_model_1.OrderModel.find();
    return result;
};
const getSingleOrder = async (id) => {
    const result = await order_model_1.OrderModel.findById(id);
    return result;
};
const getUpdateOrder = async (id, data) => {
    const result = await order_model_1.OrderModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    return result;
};
const getDeleteOrder = async (id) => {
    const result = await order_model_1.OrderModel.findByIdAndDelete(id);
    return result;
};
exports.OrderServices = {
    orderCreate,
    getAllOrder,
    getSingleOrder,
    getUpdateOrder,
    getDeleteOrder,
};
