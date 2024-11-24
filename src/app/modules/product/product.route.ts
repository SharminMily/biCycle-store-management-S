import express from 'express'
import { StudentControllers } from './product.controller'

const router = express.Router()

router.post('/create-product', StudentControllers.createProduct);

router.get('/', StudentControllers.getAllProduct);

router.get('/:id', StudentControllers.getSingleProduct);

router.put('/:id', StudentControllers.getUpdateProduct);

router.delete('/:id', StudentControllers.getDeleteProduct)

export const ProductRoutes =  router;