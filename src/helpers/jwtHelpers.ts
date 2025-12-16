import jwt, { JwtPayload } from 'jsonwebtoken';

// Best practice: use 'string' for secret (99% of cases)
const createToken = (
  payload: Record<string, unknown>,
  secret: string,
  expireTime: string
): string => {
  return jwt.sign(payload, secret as string, {
    expiresIn: expireTime,
  });
};

const createResetToken = (
  payload: Record<string, unknown>,
  secret: string,
  expireTime: string
): string => {
  return jwt.sign(payload, secret, {
    algorithm: 'HS256',      // Now accepted without any issues
    expiresIn: expireTime,
  });
};

const verifyToken = (token: string, secret: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  createToken,
  verifyToken,
  createResetToken,
};