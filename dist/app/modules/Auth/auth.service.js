"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const config_1 = __importDefault(require("../../config"));
const user_model_1 = require("../user/user.model");
const auth_utils_1 = require("./auth.utils");
const register = async (payload) => {
    const result = await user_model_1.User.create(payload);
    return result;
};
const login = async (payload) => {
    // checking if the user is exist
    const user = await user_model_1.User.findOne({ email: payload?.email }).select("+password");
    if (!user) {
        throw new Error('This user is not found !');
    }
    // checking if the user is inactive
    const userStatus = user?.isDeleted;
    if (userStatus === true) {
        throw new Error('This user is blocked ! !');
    }
    //checking if the password is correct
    // const isPasswordMatched = await bcrypt.compare(
    //   payload?.password,
    //   user?.password
    // )
    // if (!isPasswordMatched) {
    //   throw new Error('Wrong Password!!! Tell me who are you? 😈')
    // }
    const jwtPayload = {
        user: user._id.toString(),
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_web_token, config_1.default.jwt_access_in // Ensure this is set correctly (e.g., "1h" for 1 hour)
    );
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_web_token, config_1.default.jwt_access_in);
    return { user, accessToken, refreshToken };
};
exports.AuthService = {
    register,
    login,
};
