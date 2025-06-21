"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const AppError_1 = __importDefault(require("../helpers/AppError"));
const config_1 = __importDefault(require("../app/config"));
const user_model_1 = require("../app/modules/user/user.model");
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)(async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                console.error("⛔ No token found in request headers!");
                throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Token missing! You are not authorized.');
            }
            const token = authHeader.split(' ')[1];
            console.log("🔹 Received Token:", token);
            let decoded;
            try {
                decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_web_token);
            }
            catch (error) {
                console.error("⛔ JWT Verification Failed:", error.message);
                throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid or expired token');
            }
            console.log("✅ Token Decoded:", decoded);
            const { role, user: userId } = decoded;
            const userAuth = await user_model_1.User.findOne({ _id: userId });
            if (!userAuth) {
                console.error("⛔ User not found for token:", userId);
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
            }
            if (userAuth.status === 'blocked') {
                throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'User is blocked!');
            }
            if (requiredRoles.length && !requiredRoles.includes(role)) {
                throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized!');
            }
            req.user = userAuth;
            next();
        }
        catch (error) {
            console.error("⛔ Auth Middleware Error:", error.message);
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid or expired token');
        }
    });
};
exports.default = auth;
