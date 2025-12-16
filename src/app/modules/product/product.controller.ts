import { Request, Response } from 'express';
import { ProductServices } from './product.services';
import { ProductModel } from './product.model';
import productValidationSchema from './product.validation';

const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body; 
    const parsedData = productValidationSchema.parse(productData);

    const newProduct = new ProductModel(parsedData);
    await newProduct.save();

    res.status(200).json({
      message: 'Bicycle created successfully',
      success: true,
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error instanceof Error ? error.message : error,
    });
  }
};

const getAllProduct = async (req: Request, res: Response) => {
  try {
    const result = await ProductServices.getAllProductFromDB(req.query); 
    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found matching your search criteria",
        error: "Products not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: result,
    });
  } catch (error) {  
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: err.message || error || "Unknown error occurred",
    });
  }
};


const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const result = await ProductServices.getSingleProduct(id);
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

    const result = await ProductServices.getUpdateProduct(id,  body, { new: true });
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
    const { id } = req.params;

    const result = await ProductModel.findByIdAndDelete(id);
    if (!result) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
        error: 'Resource not found',
        data: {},
      });
    }
   
    res.status(200).json({
      success: true,
      message: 'product delete successfully',
      data: {},
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
