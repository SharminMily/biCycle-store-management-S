"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const user_validation_1 = require("../user/user.validation");
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const authRouter = (0, express_1.Router)();
authRouter.post('/register', (0, validateRequest_1.default)(user_validation_1.UserValidation.userValidationSchema), auth_controller_1.AuthControllers.register);
authRouter.post('/login', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.loginValidationSchema), auth_controller_1.AuthControllers.login);
// authRouter.post("/forget-password", validateRequest(AuthValidation.forgetPasswordValidationSchema) ,AuthControllers.forgetPassword)
// authRouter.post("/reset-password" ,AuthControllers.resetPassword)
exports.default = authRouter;
