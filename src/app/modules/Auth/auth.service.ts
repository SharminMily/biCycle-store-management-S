import config from '../../config';
import { TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import bcrypt from 'bcrypt';
import { TLoginUser } from './auth.interface';
import AppError from '../../../helpers/AppError';
import status from 'http-status';
import jwt from 'jsonwebtoken';

const register = async (payload: TUser) => {
  payload.password = await bcrypt.hash(payload.password, 10);
  const result = await User.create(payload);
  return result;
};

const login = async (payload: TLoginUser) => {
  // Checking if the user exists
  const user = await User.findOne({ email: payload?.email }).select('+password');

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'This user is not found!');
  }
  // If deleted
  if (user?.isDeleted) {
    throw new AppError(status.FORBIDDEN, 'This user is deleted!');
  }
  // Checking if the user is blocked
  if (user?.status === 'blocked') {
    throw new AppError(status.FORBIDDEN, 'This user is blocked!');
  }
  // Ensure the password is available
  if (!user.password) {
    throw new AppError(status.FORBIDDEN, 'Password not found in database!');
  }
  // Checking if the password is correct
 
  const isPasswordMatched = await bcrypt.compare(payload?.password, user?.password);
  if (!isPasswordMatched) {
    throw new AppError(status.FORBIDDEN, 'Wrong Password!');
  }
  // Token Generation
  const jwtPayload = {
    userId: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_web_token as string, {
    expiresIn: '7d',
  });

  return { user, accessToken };
};

export const AuthService = {
  register,
  login, 
};
