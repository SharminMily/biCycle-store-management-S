import { Router } from "express";
import validateRequest from "../../../middlewares/validateRequest";
import { UserValidation } from "../user/user.validation";
import { AuthControllers } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const authRouter = Router();

authRouter.post('/register', validateRequest(UserValidation.userValidationSchema), AuthControllers.register);
authRouter.post('/login', validateRequest(AuthValidation.loginValidationSchema), AuthControllers.login);



// authRouter.post("/forget-password", validateRequest(AuthValidation.forgetPasswordValidationSchema) ,AuthControllers.forgetPassword)
// authRouter.post("/reset-password" ,AuthControllers.resetPassword)



export default authRouter;