import { Product } from "./product.interface";
import { ProductModel } from "./product.model";

const createProductInDB = async(product: Product) => {
    const result = await ProductModel.create(product);
    return result;
}

const getAllProductFromDB = async() => {
    const result = await ProductModel.find();
    return result;
}

const getSingleProduct = async(id: string) => {
    const result = await ProductModel.findById(id);
    return result;
}

const getUpdateProduct = async(id: string, data: Product) => {
    const result = await ProductModel.findByIdAndUpdate(id, data);
    return result;
}
const getDeleteProduct = async(id: string) => {
    const result = await ProductModel.findByIdAndDelete(id);
    return result;
}

export const ProductServices = {
    createProductInDB,
    getAllProductFromDB,
    getSingleProduct ,
    getUpdateProduct,
    getDeleteProduct,
}