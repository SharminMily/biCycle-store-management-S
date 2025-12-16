"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const AppError_1 = __importDefault(require("../../../helpers/AppError"));
const user_model_1 = require("./user.model");
const http_status_1 = require("http-status");
const createUser = async (payload) => {
    const result = await user_model_1.User.create(payload);
    return result;
};
const getUser = async () => {
    const result = await user_model_1.User.find();
    return result;
};
const getSingleUser = async (id) => {
    //   const result = await User.findOne({name:"habi jabi"})
    const result = await user_model_1.User.findById(id);
    return result;
};
const updateUser = async (id, data) => {
    const result = await user_model_1.User.findByIdAndUpdate(id, data, {
        new: true,
    });
    return result;
};
const deleteUser = async (id) => {
    const result = await user_model_1.User.findByIdAndDelete(id);
    return result;
};
const getMe = async (userId) => {
    const user = await user_model_1.User.findById(userId).select('-password');
    if (!user) {
        throw new AppError_1.default(http_status_1.status.NOT_FOUND, 'User not found');
    }
    return user;
};
exports.userServices = {
    createUser,
    getUser,
    getSingleUser,
    updateUser,
    deleteUser,
    getMe
};
