import express from 'express'
import { StudentControllers } from './product.controller'

const router = express.Router()

router.post('/create-product', StudentControllers.createProduct);

router.get('/', StudentControllers.getAllProduct);

export const ProductRoutes =  router;