import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../../middlewares/auth";

const userRouter = Router();

userRouter.get('/me', auth(), userController.getMe);

userRouter.get('/:id', auth('admin', 'user'), userController.getSingleUser);
userRouter.get('/me',   userController.getUser);

userRouter.post('/',  userController.createUser)

// userRouter.post('/create-admin',auth("admin"),  userController.createUser)

userRouter.patch('/:id', userController.getUpdateUser)
userRouter.delete('/:id',  auth('admin'), userController.getDeletedUser)

// userRouter.get('/', auth(USER_ROLE.admin), userController.getUser);

userRouter.get('/', auth('admin'),  userController.getUser);



export default userRouter