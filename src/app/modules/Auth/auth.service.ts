import config from '../../config';
import { TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { createToken } from './auth.utils';

const register = async (payload: TUser) => {
  const result = await User.create(payload)
  //return result
  const jwtPayload = {
    user: result._id.toString(),
    role: result.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_web_token as string,
    config.jwt_access_in as string // Ensure this is set correctly (e.g., "1h" for 1 hour)
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_web_token as string,
    config.jwt_access_in as string
  );

  return { result, accessToken, refreshToken };
};


const login = async (payload: TLoginUser) => {
// checking if the user is exist
const user = await User.findOne({ email: payload?.email }).select("+password");

if (!user) {
  throw new Error('This user is not found !')
}

// checking if the user is inactive
const userStatus = user?.isDeleted

if (userStatus === true) {
  throw new Error('This user is blocked ! !')
}
  const jwtPayload = {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,   
    role: user.role
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
