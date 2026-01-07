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
  userId: string | Types.ObjectId, // Comes from req.user._id
  payload: { products: { product: string; quantity: number }[] },
  client_ip: string,
) => {
  // Convert userId to ObjectId if it's a string (this fixes "User not found!")
  const validUserId =
    typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

  // Fetch the full user document
  const fullUser = await User.findById(validUserId);

  if (!fullUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // Calculate total price and validate products
  let totalPrice = 0;

  const productDetails = await Promise.all(
    payload.products.map(async (item) => {
      // Convert product ID to ObjectId as well (safety)
      const productId =
        typeof item.product === 'string'
          ? new Types.ObjectId(item.product)
          : item.product;

      const product = await ProductModel.findById(productId);

      if (!product) {
        throw new AppError(httpStatus.NOT_FOUND, `Product not found: ${item.product}`);
      }

      if (product.stock < item.quantity) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Insufficient stock for product: ${product.name}`,
        );
      }

      // Reduce stock (optional: do this atomically later if needed)
      // await ProductModel.updateOne({ _id: productId }, { $inc: { stock: -item.quantity } });

      const subtotal = (product.price || 0) * item.quantity;
      totalPrice += subtotal;

      return {
        product: product._id,
        quantity: item.quantity,
      };
    }),
  );

  // Create the order
  const order = await Order.create({
    user: fullUser._id,
    products: productDetails,
    totalPrice,
  });

  // Prepare payment payload for ShurjoPay
  const shurjopayPayload = {
    amount: totalPrice,
    order_id: order._id.toString(),
    currency: 'BDT',
    customer_name: fullUser.name,
    customer_address: fullUser.address || 'N/A',
    customer_email: fullUser.email,
    customer_phone: fullUser.phone,
    customer_city: fullUser.city || 'Dhaka',
    client_ip,
  };

  // Initiate payment
  const payment = await orderUtils.makePaymentAsync(shurjopayPayload);

  let checkout_url = '';

  if (payment?.checkout_url) {
    checkout_url = payment.checkout_url;

    // Update order with transaction info
    await Order.updateOne(
      { _id: order._id },
      {
        transaction: {
          id: payment.sp_order_id,
          transactionStatus: payment.transactionStatus || 'Pending',
        },
      },
    );
  }

  // Return checkout URL and user info (useful for frontend)
  return {
    checkout_url,
    order,
    user: {
      name: fullUser.name,
      email: fullUser.email,
      phone: fullUser.phone,
    },
  };
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
