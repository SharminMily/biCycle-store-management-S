/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { userServices } from "./user.services";

import { status } from 'http-status';

const createUser = catchAsync(async (req, res) => {
    const payload = req.body;
    const result = await userServices.createUser(payload);
  
    sendResponse(res, {
      statusCode: status.CREATED,
      message: 'User Created Successfully',
      data: result,
    });
  });

  const getUser = catchAsync(async (req, res) => {
    const result = await userServices.getUser();
  
    sendResponse(res, {
      statusCode: status.OK,
      message: 'User getting Successfully',
      data: result,
    });
  });


  const getSingleUser = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await userServices.getSingleUser(id);
  
    sendResponse(res, {
      statusCode: status.OK,
      message: 'single user get successfully',
      data: result,
    });
  });
  
  const getUpdateUser = catchAsync(async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const result = await userServices.updateUser(id, body);
  
    sendResponse(res, {
      statusCode: status.CREATED,
      message: 'single user user update successfully',
      data: result,
    });
  });
  
  const getDeletedUser = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await userServices.deleteUser(id);
  
    sendResponse(res, {
      statusCode: status.OK,
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


  export const userController = {
    createUser,
    getUser,
    getSingleUser,
    getUpdateUser,
    getDeletedUser,   
  }