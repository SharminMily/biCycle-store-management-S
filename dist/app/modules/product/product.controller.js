"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductControllers = void 0;
const product_services_1 = require("./product.services");
const product_model_1 = require("./product.model");
const createProduct = async (req, res) => {
    try {
        const { product: productData } = req.body;
        const result = await product_services_1.ProductServices.createProductInDB(productData);
        //send response
        res.status(200).json({
            message: 'Bicycle created successfully',
            success: true,
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
const getAllProduct = async (req, res) => {
    try {
        const { searchTerm } = req.query;
        const result = await product_services_1.ProductServices.getAllProductFromDB(searchTerm);
        if (!result || result.length === 0) {
            res.status(404).json({
                success: false,
                message: 'No products found matching your search criteria',
                error: 'Products not found',
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
const getSingleProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await product_services_1.ProductServices.getSingleProduct(id);
        if (!result) {
            res.status(404).json({
                success: false,
                message: 'Product not found ',
                error: 'Resource not found',
            });
        }
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
const getUpdateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const result = await product_services_1.ProductServices.getUpdateProduct(id, body);
        if (!result) {
            res.status(404).json({
                success: false,
                message: 'Product not found ',
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
const getDeleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await product_model_1.ProductModel.findByIdAndDelete(id);
        if (!result) {
            res.status(404).json({
                success: false,
                message: 'Product not found',
                error: 'Resource not found',
                data: {},
            });
        }
        //send response
        res.status(200).json({
            success: true,
            message: 'product delete successfully',
            data: {},
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
exports.ProductControllers = {
    createProduct,
    getAllProduct,
    getSingleProduct,
    getUpdateProduct,
    getDeleteProduct,
};
