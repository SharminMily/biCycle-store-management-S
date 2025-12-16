"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const auth_service_1 = require("./auth.service");
const http_status_1 = require("http-status");
const register = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.AuthService.register(req.body);
    // eslint-disable-next-line no-unused-vars
    const { result: user, accessToken } = result; // destructuring করো
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.status.CREATED,
        status: true,
        message: "User registered successfully",
        token: accessToken,
        data: {
            user,
            accessToken,
        },
    });
});
const login = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.AuthService.login(req.body);
    const { accessToken, refreshToken, user } = result;
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.status.OK,
        status: true,
        message: "User logged in successfully",
        token: accessToken,
        data: {
            user,
            accessToken,
            refreshToken,
        },
    });
});
// const forgetPassword = catchAsync(async(req:Request, res: Response)=>{
//     const result = await AuthService.forgetPassword(req.body);
//     sendResponse(res,{
//         statusCode: StatusCodes.ACCEPTED,
//         status: true,
//         message: "Password reset link sent to your email",
//         data: result
//     })
// })
// const resetPassword = catchAsync(async(req:Request, res: Response)=>{
//     const result = await AuthService.resetPassword(req.body);
//     sendResponse(res,{
//         statusCode: StatusCodes.ACCEPTED,
//         status: true,
//         message: "password reset successfully",
//         data: result
//     })
// })
exports.AuthControllers = {
    register,
    login,
};
