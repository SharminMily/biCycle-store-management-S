/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from './product.interface';
import { ProductModel } from './product.model';
import QueryBuilder from '../../../builder/querybuilder';

const createProductInDB = async (product: Product) => {
  // if (await ProductModel.isUserExists(product.id)) {
  //   throw new Error('User already exists!');
  // }
  const result = await ProductModel.create(product);
  return result;
};

const getAllProductFromDB = async (queryParams: any) => {
  try {
    console.log("Received Query Params:", queryParams); 

    const query = ProductModel.find();
    const queryBuilder = new QueryBuilder(query, queryParams)
      .search(["name", "brand", "type"])
      .filter()
      .paginate()
      .sort()
      .select();

    console.log("Final Query Before Execution:", queryBuilder.modelQuery.getQuery()); 

    const result = await queryBuilder.modelQuery;
    console.log("Final Query Results:", result.length); 

    return result;
  } catch (error) {
    console.error("Error in getAllProductFromDB:", error);
    throw new Error("Failed to fetch products from DB");
  }
};



const getSingleProduct = async (id: string) => {
  const result = await ProductModel.findById(id);
  return result;
};


// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const getUpdateProduct = async (id: string, data: Product, p0?: { new: boolean; }) => {
  const result = await ProductModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  return result;
};
const getDeleteProduct = async (id: string) => {
  const result = await ProductModel.findByIdAndDelete(id);
  return result;
};

export const ProductServices = {
  createProductInDB,
  getAllProductFromDB,
  getSingleProduct,
  getUpdateProduct,
  getDeleteProduct,
};
