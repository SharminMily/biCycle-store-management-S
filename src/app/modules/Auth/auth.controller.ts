import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { AuthService } from "./auth.service";
import { status } from "http-status";


const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);
  // eslint-disable-next-line no-unused-vars
  const { result: user, accessToken  } = result; // destructuring করো

  sendResponse(res, {
    statusCode: status.CREATED,
    status: true,
    message: "User registered successfully",
    token: accessToken, 
    data: {
      user, 
      accessToken,
     
    },
  });
});


const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);
  const { accessToken, refreshToken, user } = result;

  sendResponse(res, {
    statusCode: status.OK,
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


export const AuthControllers = {
    register,
    login,
 
}