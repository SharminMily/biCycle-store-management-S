import { ProductModel } from '../product/product.model';
import { IOrder } from './order.interface';
import Order from './order.model';
import AppError from '../../../helpers/AppError';
import { TUser } from '../user/user.interface';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { orderUtils } from './order.utils';
import { Types } from 'mongoose';

const orderCreate = async (
  user: TUser | string, // It might be just an ObjectId (string) or the full user document
  payload: { products: { product: string; quantity: number }[] },
  client_ip: string,
) => {
  console.log('Received user data:', user);

  // If `user` is only an ObjectId (string) or an instance of Types.ObjectId, fetch the full user document
  let fullUser;
  if (typeof user === 'string' || user instanceof Types.ObjectId) {
    fullUser = await User.findById(user);
  } else {
    fullUser = user; // Already a full document
  }

  if (!fullUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  console.log('Fetched Full User:', fullUser);

  // Declare and initialize totalPrice
  let totalPrice = 0;

  // Fetch product details and calculate total price
  const productDetails = await Promise.all(
    payload.products.map(async (item) => {
      const product = await ProductModel.findById(item.product);
      if (!product) {
        throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
      }
      // Calculate subtotal for this product and add it to totalPrice
      totalPrice += (product.price || 0) * item.quantity;
      return { product: product._id, quantity: item.quantity };
    }),
  );

  // Create the order with the correct user ObjectId
  let order = await Order.create({
    user: fullUser._id, // Use the ObjectId from the full user document
    products: productDetails,
    totalPrice,
  });

  // Payment integration code
  const shurjopayPayload = {
    amount: totalPrice,
    order_id: order._id,
    currency: 'BDT',
    customer_name: fullUser.name,
    customer_address: fullUser.address,
    customer_email: fullUser.email,
    customer_phone: fullUser.phone,
    customer_city: fullUser.city,
    client_ip,
  };

  console.log('Payment Payload:', shurjopayPayload);

  const payment = await orderUtils.makePaymentAsync(shurjopayPayload);

  if (payment?.transactionStatus) {
    order = await order.updateOne({
      transaction: {
        id: payment.sp_order_id,
        transactionStatus: payment.transactionStatus,
      },
    });
  }
  console.log(payment.checkout_url, 'Payment checkout URL');

  // Return both the checkout URL and the full user document
  return { checkout_url: payment.checkout_url, user: fullUser };
};

const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

  if (verifiedPayment.length) {
    const updatedOrder = await Order.findOneAndUpdate(
      {
        'transaction.id': order_id,
      },
      {
        'transaction.bank_status': verifiedPayment[0].bank_status,
        'transaction.sp_code': verifiedPayment[0].sp_code,
        'transaction.sp_message': verifiedPayment[0].sp_message,
        'transaction.transactionStatus': verifiedPayment[0].transaction_status,
        'transaction.method': verifiedPayment[0].method,
        'transaction.date_time': verifiedPayment[0].date_time,
        status:
          verifiedPayment[0].bank_status == 'Success'
            ? 'Paid'
            : verifiedPayment[0].bank_status == 'Failed'
              ? 'Pending'
              : verifiedPayment[0].bank_status == 'Cancel'
                ? 'Cancelled'
                : '',
      },
      { new: true } 
    )
    .populate("user", "name email phone address city") // Populate user details
     .populate("products.product", "name price image"); // Populate product details
     if (!updatedOrder) {
      throw new AppError(httpStatus.NOT_FOUND, "Order not found!");
    }

    return {
      order: updatedOrder,
      payment: verifiedPayment[0], // Include payment details if needed
    };
  }

  throw new AppError(httpStatus.BAD_REQUEST, "Invalid payment verification!");
};

//get Order
const getAllOrder = async () => {
  const result = await Order.find();
  return result;
};

const getSingleOrder = async (id: string) => {
  const result = await Order.findById(id);
  return result;
};

const getUpdateOrder = async (id: string, data: IOrder) => {
  const result = await Order.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  return result;
};
const getDeleteOrder = async (id: string) => {
  const result = await Order.findByIdAndDelete(id);
  return result;
};

export const OrderServices = {
  orderCreate,
  verifyPayment,
  getAllOrder,
  getSingleOrder,
  getUpdateOrder,
  getDeleteOrder,
};
