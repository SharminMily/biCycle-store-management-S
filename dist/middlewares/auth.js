"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
// src/middlewares/auth.ts
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
        // Express normalizes headers to lowercase
        const authHeader = req.headers.authorization;
        // Check if authorization header exists and is a valid Bearer token
        if (!authHeader ||
            typeof authHeader !== 'string' ||
            !authHeader.startsWith('Bearer ')) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'No token provided!');
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid token format!');
        }
        // Verify token
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_web_token);
        }
        catch (err) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid or expired token!');
        }
        // Extract userId and role from payload (support both formats)
        let userId;
        let roleFromToken;
        const payload = decoded;
        if ('_id' in payload && payload._id) {
            userId = payload._id;
            roleFromToken = payload.role;
        }
        else if ('user' in payload && payload.user) {
            userId = payload.user;
            roleFromToken = payload.role;
        }
        else {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid token payload: user ID missing!');
        }
        if (!roleFromToken) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Role missing in token!');
        }
        // Find user in database
        const user = await user_model_1.User.findById(userId).select('name email role status isDeleted');
        if (!user) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User no longer exists!');
        }
        if (user.isDeleted) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Account has been deleted!');
        }
        if (user.status === 'blocked') {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Account is blocked!');
        }
        // Ensure required fields are present (TypeScript safety)
        if (!user.name || !user.email || !user.role) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'User data incomplete!');
        }
        // Use role from DB for authorization (more secure than token)
        const finalRole = user.role;
        if (requiredRoles.length > 0 && !requiredRoles.includes(finalRole)) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You do not have permission for this action!');
        }
        // Attach verified user to request
        req.user = {
            userId: user._id.toString(), // _id is guaranteed to exist after findById success
            name: user.name,
            email: user.email,
            role: finalRole,
        };
        next();
    });
};
exports.default = auth;
