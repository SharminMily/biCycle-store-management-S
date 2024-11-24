import { model, Schema } from "mongoose";
import { IOrder } from "./order.interface";


const orderSchema = new Schema<IOrder>(
    {
      email: { type: String, required: true },
      product: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      totalPrice: { type: Number, required: true, min: 0 },
    },
    { timestamps: true }
  );


  export const OrderModel = model<IOrder>("Order", orderSchema);