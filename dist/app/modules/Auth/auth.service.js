"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const config_1 = __importDefault(require("../../config"));
const user_model_1 = require("../user/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const AppError_1 = __importDefault(require("../../../helpers/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const auth_utils_1 = require("./auth.utils");
const register = async (payload) => {
    payload.password = await bcrypt_1.default.hash(payload.password, 8);
    const result = await user_model_1.User.create(payload);
    return result;
};
const login = async (payload) => {
    const user = await user_model_1.User.findOne({ email: payload?.email }).select('+password');
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found!');
    }
    if (user?.isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is deleted!');
    }
    if (user?.status === 'blocked') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked!');
    }
    if (!user.password) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Password not found in database!');
    }
    console.log("Entered Password:", `"${payload?.password}"`);
    console.log("Stored Hashed Password:", `"${user?.password}"`);
    // Fix possible whitespace issues
    const enteredPassword = payload?.password.trim();
    // Compare entered password with stored hash
    const isPasswordMatched = await bcrypt_1.default.compare(enteredPassword, user?.password);
    console.log("Password Match Result:", isPasswordMatched);
    if (!isPasswordMatched) {
        console.log("Password does not match! Possible hashing issue.");
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Wrong Password!');
    }
    // Token Generation
    const jwtPayload = {
        user: user._id.toString(),
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_web_token, config_1.default.jwt_access_in);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_web_token, config_1.default.jwt_access_in);
    return { user, accessToken, refreshToken };
};
exports.AuthService = {
    register,
    login,
};
