import config from '../../config';
import { TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import bcrypt from 'bcrypt';
import { TLoginUser } from './auth.interface';
import AppError from '../../../helpers/AppError';
import status from 'http-status';
import jwt from 'jsonwebtoken';

const register = async (payload: TUser) => {
  const result = await User.create(payload);
  return result;
};

const login = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await User.findOne({ email: payload?.email }).select(
    '+password',
  );

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'This user is not found !');
  }
  //if deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(status.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(status.FORBIDDEN, 'This user is blocked ! !');
  }
  //checking if the password is correct
  const isPasswordMatched = await bcrypt.compare(
    payload?.password,
    user?.password,
  );

  if (!isPasswordMatched) {
    throw new Error('Wrong Password!  😈');
  }

  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(status.FORBIDDEN, 'Password do not matched');
  //token
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
