
import AppError from "../../../helpers/AppError";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { status } from "http-status";

const createUser = async(payload: TUser): Promise< TUser> => {
     const result = await User.create(payload);
      return result;
}

const getUser = async () => {
    const result = await User.find()
    return result
  }
  
  const getSingleUser = async (id: string) => {
    //   const result = await User.findOne({name:"habi jabi"})
    const result = await User.findById(id)
    return result
  }
  
  const updateUser = async (id: string, data: TUser) => {
    const result = await User.findByIdAndUpdate(id, data, {
      new: true,
    })
    return result
  }
  
  const deleteUser = async (id: string) => {
    const result = await User.findByIdAndDelete(id)
    return result
  }



const getMe = async (userId: string) => {
  const user = await User.findById(userId).select('-password');

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  return user;
}; 

export const userServices = {
    createUser,
    getUser,
    getSingleUser,
    updateUser,
    deleteUser,
    getMe
}


