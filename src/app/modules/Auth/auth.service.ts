import config from '../../config';
import { TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import bcrypt from 'bcrypt';
import AppError from '../../../helpers/AppError';
import status from 'http-status';
import { TLoginUser } from './auth.interface';
import { createToken } from './auth.utils';

const register = async (payload: TUser) => {
  payload.password = await bcrypt.hash(payload.password, 8);
  const result = await User.create(payload);
  return result;
};

const login = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload?.email }).select('+password');

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'This user is not found!');
  }

  if (user?.isDeleted) {
    throw new AppError(status.FORBIDDEN, 'This user is deleted!');
  }

  if (user?.status === 'blocked') {
    throw new AppError(status.FORBIDDEN, 'This user is blocked!');
  }

  if (!user.password) {
    throw new AppError(status.FORBIDDEN, 'Password not found in database!');
  }

  console.log("Entered Password:", `"${payload?.password}"`);
  console.log("Stored Hashed Password:", `"${user?.password}"`);

  // Fix possible whitespace issues
  const enteredPassword = payload?.password.trim();

  // Compare entered password with stored hash
  const isPasswordMatched = await bcrypt.compare(enteredPassword, user?.password);

  console.log("Password Match Result:", isPasswordMatched);

  if (!isPasswordMatched) {
    console.log("Password does not match! Possible hashing issue.");
    throw new AppError(status.FORBIDDEN, 'Wrong Password!');
  }

  // Token Generation
  const jwtPayload = {
    user: user._id.toString(), 
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_web_token as string,
    config.jwt_access_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_web_token as string,
    config.jwt_access_in as string
  );

  return { user, accessToken, refreshToken };
};

export const AuthService = {
  register,
  login, 
};
