"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductControllers = void 0;
const product_services_1 = require("./product.services");
const product_model_1 = require("./product.model");
const product_validation_1 = __importDefault(require("./product.validation"));
const createProduct = async (req, res) => {
    try {
        const productData = req.body;
        const parsedData = product_validation_1.default.parse(productData);
        const newProduct = new product_model_1.ProductModel(parsedData);
        await newProduct.save();
        res.status(200).json({
            message: 'Bicycle created successfully',
            success: true,
            data: newProduct,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error instanceof Error ? error.message : error,
        });
    }
};
const getAllProduct = async (req, res) => {
    try {
        const result = await product_services_1.ProductServices.getAllProductFromDB(req.query);
        if (!result || result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found matching your search criteria",
                error: "Products not found",
            });
        }
        // Send response
        res.status(200).json({
            success: true,
            message: "Products retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        //console.error("Error in getAllProduct:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message || error,
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
        const result = await product_services_1.ProductServices.getUpdateProduct(id, body, { new: true });
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
