import express from 'express'
import { ProductControllers } from './product.controller';


const router = express.Router()

router.post('/create-product', ProductControllers.createProduct);

router.get('/', ProductControllers.getAllProduct);

router.get('/:id', ProductControllers.getSingleProduct);

router.put('/:id', ProductControllers.getUpdateProduct);

router.delete('/:id', ProductControllers.getDeleteProduct)


export const ProductRoutes =  router;