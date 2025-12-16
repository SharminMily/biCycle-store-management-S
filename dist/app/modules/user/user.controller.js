"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const user_services_1 = require("./user.services");
const uuid_1 = require("uuid");
const http_status_1 = require("http-status");
const createUser = (0, catchAsync_1.default)(async (req, res) => {
    const payload = req.body;
    if (!payload.id) {
        payload.id = (0, uuid_1.v4)(); // Generates a unique UUID
    }
    const result = await user_services_1.userServices.createUser(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.status.CREATED,
        message: 'User Created Successfully',
        data: result,
    });
});
const getUser = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_services_1.userServices.getUser();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.status.OK,
        message: 'User getting Successfully',
        data: result,
    });
});
const getSingleUser = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await user_services_1.userServices.getSingleUser(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.status.OK,
        message: 'single user get successfully',
        data: result,
    });
});
const getUpdateUser = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const result = await user_services_1.userServices.updateUser(id, body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.status.CREATED,
        message: 'single user user update successfully',
        data: result,
    });
});
const getDeletedUser = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await user_services_1.userServices.deleteUser(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.status.OK,
        message: 'user deleted successfully',
        data: [],
    });
});
// export const blockUser = async (req: Request, res: Response): Promise<void> => {
//     const { userId } = req.params;
//     try {
//       const user = await User.findById(userId);
//       if (!user) {
//         res.status(404).json({ success: false, message: "User not found" });
//         return;
//       }
//       user.isBlocked = true;
//       await user.save();
//       res.status(200).json({ success: true, message: "User blocked successfully" });
//     } catch (error) {
//       res.status(500).json({ success: false, message: "Internal server error", error });
//     }
//   };
const getMe = (0, catchAsync_1.default)(async (req, res) => {
    // THIS LINE ONLY — NO req.params ANYWHERE
    const userId = req.user?.userId;
    //   console.log('req.user:', req.user);
    // console.log('userId:', req.user?.userId);
    // console.log('req.params:', req.params);
    if (!userId) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.status.UNAUTHORIZED,
            message: 'Unauthorized - No user data',
            data: null,
        });
    }
    const result = await user_services_1.userServices.getMe(userId); // or getSingleUser if that's your function name
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.status.OK,
        message: 'User retrieved successfully',
        data: result,
    });
});
exports.userController = {
    createUser,
    getUser,
    getSingleUser,
    getUpdateUser,
    getDeletedUser,
    getMe
};
