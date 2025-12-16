/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
        [x: string]: any;
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
    // Express normalizes headers to lowercase
    const authHeader = req.headers.authorization;

    // Check if authorization header exists and is a valid Bearer token
    if (
      !authHeader ||
      typeof authHeader !== 'string' ||
      !authHeader.startsWith('Bearer ')
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'No token provided!');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token format!');
    }

    // Verify token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, config.jwt_web_token as string) as JwtPayload;
    } catch (err) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token!');
    }

    // Extract userId and role from payload (support both formats)
    let userId: string;
    let roleFromToken: TUserRole | undefined;

    // Type guard to avoid excessive 'any'
    interface NewPayload extends JwtPayload {
      _id?: string;
      role?: TUserRole;
      name?: string;
      email?: string;
    }

    interface OldPayload extends JwtPayload {
      user?: string;
      role?: TUserRole;
    }

    const payload = decoded as NewPayload | OldPayload;

    if ('_id' in payload && payload._id) {
      userId = payload._id;
      roleFromToken = payload.role;
    } else if ('user' in payload && payload.user) {
      userId = payload.user;
      roleFromToken = payload.role;
    } else {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token payload: user ID missing!');
    }

    if (!roleFromToken) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Role missing in token!');
    }

    // Find user in database
    const user = await User.findById(userId).select('name email role status isDeleted');

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User no longer exists!');
    }

    if (user.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'Account has been deleted!');
    }

    if (user.status === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'Account is blocked!');
    }

    // Ensure required fields are present (TypeScript safety)
    if (!user.name || !user.email || !user.role) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'User data incomplete!');
    }

    // Use role from DB for authorization (more secure than token)
    const finalRole = user.role;

    if (requiredRoles.length > 0 && !requiredRoles.includes(finalRole)) {
      throw new AppError(httpStatus.FORBIDDEN, 'You do not have permission for this action!');
    }

    // Attach verified user to request
    req.user = {
      userId: user._id.toString(), // _id is guaranteed to exist after findById success
      name: user.name,
      email: user.email,
      role: finalRole,
    };

    next();
  });
};

export default auth;