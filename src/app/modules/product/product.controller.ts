import { Request, Response } from 'express';
import { ProductServices } from './product.services';

const createProduct = async (req: Request, res: Response) => {
  try {
    const { product: productData } = req.body;

    const result = await ProductServices.createProductInDB(productData);
    //send response
    res.status(200).json({
      success: true,
      message: 'Product is create successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went Wrong',
      error: error,
    });
  }
};

const getAllProduct = async (req: Request, res: Response) => {
  try {
    const { searchTerm } = req.query;

    const result = await ProductServices.getAllProductFromDB(searchTerm as string);

    //send response
    res.status(200).json({
      success: true,
      message: 'Product get successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went Wrong',
      error: error,
    });
  }
};

const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const result = await ProductServices.getSingleProduct(id);
    //send response
    res.status(200).json({
      success: true,
      message: 'Single Product get successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went Wrong',
      error: error,
    });
  }
};

const getUpdateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const body = req.body;

    const result = await ProductServices.getUpdateProduct(id, body);
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went Wrong',
      error: error,
    });
  }
};


const getDeleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const result = await ProductServices.getDeleteProduct(id);
    //send response
    res.status(200).json({
      success: true,
      message: 'product delete successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went Wrong',
      error: error,
    });
  }
};




export const ProductControllers = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  getUpdateProduct,
  getDeleteProduct,

};
