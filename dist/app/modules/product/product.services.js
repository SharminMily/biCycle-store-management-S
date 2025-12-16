"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductServices = void 0;
const product_model_1 = require("./product.model");
const querybuilder_1 = __importDefault(require("../../../builder/querybuilder"));
const createProductInDB = async (product) => {
    // if (await ProductModel.isUserExists(product.id)) {
    //   throw new Error('User already exists!');
    // }
    const result = await product_model_1.ProductModel.create(product);
    return result;
};
const getAllProductFromDB = async (queryParams) => {
    try {
        // console.log("Received Query Params:", queryParams); 
        const query = product_model_1.ProductModel.find();
        const queryBuilder = new querybuilder_1.default(query, queryParams)
            .search(["name", "brand", "type"])
            .filter()
            .paginate()
            .sort()
            .select();
        // console.log("Final Query Before Execution:", queryBuilder.modelQuery.getQuery()); 
        const result = await queryBuilder.modelQuery;
        // console.log("Final Query Results:", result.length); 
        return result;
    }
    catch (error) {
        console.error("Error in getAllProductFromDB:", error);
        throw new Error("Failed to fetch products from DB");
    }
};
const getSingleProduct = async (id) => {
    const result = await product_model_1.ProductModel.findById(id);
    return result;
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const getUpdateProduct = async (id, data, p0) => {
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
