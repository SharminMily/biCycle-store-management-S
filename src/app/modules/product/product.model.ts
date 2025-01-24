import { model, Schema } from 'mongoose';
import { Product } from './product.interface';

const productSchema = new Schema<Product>(
  {
    name: { type: String, required: [true, 'Name is required'] },
    brand: { type: String, required: [true, 'Brand is required'] },
    price: { type: Number, required: [true, 'Price is required'] },
    type: {
      type: String,
      enum: ['Mountain', 'Road', 'Hybrid', 'BMX', 'Electric'],
      required: [true, 'Type is required'],
    },
    description: { type: String, required: [true, 'Description is required'] },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      default: 0,
    },
    inStock: {
      type: Boolean,
      required: [true, 'InStock status is required'],
      default: false,
    },
  },
  { timestamps: true },
);

export const ProductModel = model<Product>('Product', productSchema);
