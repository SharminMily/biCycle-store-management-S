import { model, Schema } from "mongoose";
import { Product } from "./product.interface";

const productSchema = new Schema<Product>({
    name: {type: String, required: true},
    brand: {type: String, required: true},
    price: {type: Number, required: true},
    type: {
        type: String,
        enum:  ['Mountain', 'Road', 'Hybrid', 'BMX', 'Electric'], 
        required: true
    },
    description: {type: String, required: true},
})


export const ProductModel = model<Product>('Product', productSchema)