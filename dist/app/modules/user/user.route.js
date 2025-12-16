"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const userRouter = (0, express_1.Router)();
userRouter.get('/me', (0, auth_1.default)(), user_controller_1.userController.getMe);
userRouter.get('/:id', (0, auth_1.default)('admin', 'user'), user_controller_1.userController.getSingleUser);
// userRouter.get('/me',   userController.getUser);
userRouter.post('/', user_controller_1.userController.createUser);
// userRouter.post('/create-admin',auth("admin"),  userController.createUser)
userRouter.patch('/:id', user_controller_1.userController.getUpdateUser);
userRouter.delete('/:id', (0, auth_1.default)('admin'), user_controller_1.userController.getDeletedUser);
// userRouter.get('/', auth(USER_ROLE.admin), userController.getUser);
userRouter.get('/', (0, auth_1.default)('admin'), user_controller_1.userController.getUser);
exports.default = userRouter;
