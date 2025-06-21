/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TUserRole } from '../app/modules/user/user.interface';
import catchAsync from '../utils/catchAsync';
import AppError from '../helpers/AppError';
import config from '../app/config';
import { User } from '../app/modules/user/user.model';


const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error("⛔ No token found in request headers!");
        throw new AppError(httpStatus.UNAUTHORIZED, 'Token missing! You are not authorized.');
      }

      const token = authHeader.split(' ')[1];
      console.log("🔹 Received Token:", token);

      let decoded;
      try {
        decoded = jwt.verify(token, config.jwt_web_token as string) as JwtPayload;
      } catch (error) {
        console.error("⛔ JWT Verification Failed:",  (error as Error).message);
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token');
      }

      console.log("✅ Token Decoded:", decoded);

      const { role, user: userId } = decoded;

      const userAuth = await User.findOne({ _id: userId });

      if (!userAuth) {
        console.error("⛔ User not found for token:", userId);
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
      }

      if (userAuth.status === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'User is blocked!');
      }

      if (requiredRoles.length && !requiredRoles.includes(role)) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
      }

      req.user = userAuth;
      next();
    } catch (error) {
      console.error("⛔ Auth Middleware Error:",  (error as Error).message);
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token');
    }
  });
};


export default auth;