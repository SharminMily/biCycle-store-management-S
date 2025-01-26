import { Router } from "express";
import { userController } from "./user.controller";

const userRouter = Router();

userRouter.get('/:id', userController.getSingleUser);

userRouter.post('/',  userController.createUser)

// userRouter.post('/create-admin',auth("admin"),  userController.createUser)

userRouter.patch('/:id', userController.getUpdateUser)
userRouter.delete('/:id', userController.getDeletedUser)

// userRouter.get('/', auth(USER_ROLE.admin), userController.getUser);

userRouter.get('/', userController.getUser);

export default userRouter