import { TUserRole } from '../src/app/modules/user/user.interface';

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