"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderUtils = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const shurjopay_1 = __importDefault(require("shurjopay"));
const config_1 = __importDefault(require("../../config"));
const shurjopay = new shurjopay_1.default();
shurjopay.config(config_1.default.sp.sp_endpoint, config_1.default.sp.sp_username, config_1.default.sp.sp_password, config_1.default.sp.sp_prefix, config_1.default.sp.sp_return_url);
//console.log(shurjopay)
const makePaymentAsync = async (paymentPayload) => {
    return new Promise((resolve, reject) => {
        shurjopay.makePayment(paymentPayload, (response) => resolve(response), (error) => reject(error));
    });
};
const verifyPaymentAsync = (order_id) => {
    return new Promise((resolve, reject) => {
        shurjopay.verifyPayment(order_id, (response) => resolve(response), (error) => reject(error));
    });
};
exports.orderUtils = {
    makePaymentAsync,
    verifyPaymentAsync,
};
