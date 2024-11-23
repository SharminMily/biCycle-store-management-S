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

export const ProductServices = {
    createProductInDB,
    getAllProductFromDB,
}