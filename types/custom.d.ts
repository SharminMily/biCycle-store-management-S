import { TUser } from '../src/app/modules/user/user.interface';

declare global {
    namespace Express {
      interface Request {
        user?: TUser;
      }
    }
  }