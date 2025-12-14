/* eslint-disable @typescript-eslint/no-namespace */
// src/middlewares/auth.ts

import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync';
import AppError from '../helpers/AppError';
import config from '../app/config';
import { User } from '../app/modules/user/user.model';
import { TUserRole } from '../app/modules/user/user.interface';

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        name: string;
        email: string;
        role: TUserRole;
      };
    }
  }
}

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'No token provided!');
    }

    const token = authHeader.split(' ')[1];

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, config.jwt_web_token as string) as JwtPayload;
    } catch (err) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token!');
    }

    const { _id, name, email, role } = decoded as {
      _id: string;
      name: string;
      email: string;
      role: TUserRole;
    };

    if (!role) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Role missing in token!');
    }

    // Security check: verify user still exists and not blocked
    const user = await User.findById(_id).select('status isDeleted');

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User no longer exists!');
    }

    if (user.isDeleted || user.status === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'Account is blocked or deleted!');
    }

    // Role check
    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.FORBIDDEN, 'You do not have permission!');
    }

    // Attach to req.user
    req.user = {
      userId: _id,
      name,
      email,
      role,
    };

    next();
  });
};

export default auth;