import { Request, Response }from 'express';
import { ProductServices } from './product.services';



const createProduct = async(req: Request, res: Response) => {
  
    try {
      const { product: productData } = req.body;

      const result = await ProductServices.createProductInDB(productData);
   //send response
    res.status(200).json({
      success: true,
      message: 'Product is create successfully',
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
}

const getAllProduct = async(req: Request, res: Response) => {
  try {
    const { product: productData } = req.body;

    const result = await ProductServices.createProductInDB(productData);
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
}



export const StudentControllers = {
    createProduct,
    getAllProduct,
   
  };
  