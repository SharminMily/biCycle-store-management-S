"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductServices = void 0;
const product_model_1 = require("./product.model");
const createProductInDB = async (product) => {
    // if (await ProductModel.isUserExists(product.id)) {
    //   throw new Error('User already exists!');
    // }
    const result = await product_model_1.ProductModel.create(product);
    return result;
};
const getAllProductFromDB = async (searchTerm) => {
    let query = {};
    if (searchTerm) {
        query = {
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } }, // Matches `name`
                { brand: { $regex: searchTerm, $options: 'i' } }, // Matches `brand`
                { type: { $regex: searchTerm, $options: 'i' } }, // Matches `type`
            ],
        };
    }
    const result = await product_model_1.ProductModel.find(query);
    return result;
};
const getSingleProduct = async (id) => {
    const result = await product_model_1.ProductModel.findById(id);
    return result;
};
const getUpdateProduct = async (id, data) => {
    const result = await product_model_1.ProductModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    return result;
};
const getDeleteProduct = async (id) => {
    const result = await product_model_1.ProductModel.findByIdAndDelete(id);
    return result;
};
exports.ProductServices = {
    createProductInDB,
    getAllProductFromDB,
    getSingleProduct,
    getUpdateProduct,
    getDeleteProduct,
};
