import { model, Schema } from 'mongoose';
import { Product } from './product.interface';

const productSchema = new Schema<Product>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true , message: '{VALUE} is not valid'},
  brand: { type: String, required: true },
  price: { type: Number, required: true, message: 'Price must be a positive number', },
  type: {
    type: String,
    enum: ['Mountain', 'Road', 'Hybrid', 'BMX', 'Electric'],
    required: true,
  },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  inStock: { type: Boolean, required: true, },
},
{ timestamps: true }
);


export const ProductModel = model<Product>('Product', productSchema);
