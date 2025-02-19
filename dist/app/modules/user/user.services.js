"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const user_model_1 = require("./user.model");
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
exports.userServices = {
    createUser,
    getUser,
    getSingleUser,
    updateUser,
    deleteUser
};
