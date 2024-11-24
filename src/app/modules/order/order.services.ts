import { IOrder } from "./order.interface";
import { OrderModel } from "./order.model";


const orderCreate = async(order: IOrder) => {
    const result = await OrderModel.create(order);
    return result;
}

const getAllOrder = async() => {
    const result = await OrderModel.find();
    return result;
}

const getSingleOrder = async(id: string) => {
    const result = await OrderModel.findById(id);
    return result;
}

const getUpdateOrder = async(id: string, data: IOrder) => {
    const result = await OrderModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    return result;
}
const getDeleteOrder = async(id: string) => {
    const result = await OrderModel.findByIdAndDelete(id);
    return result;
}

export const OrderServices = {
    orderCreate,
    getAllOrder,
    getSingleOrder ,
    getUpdateOrder,
    getDeleteOrder,
}