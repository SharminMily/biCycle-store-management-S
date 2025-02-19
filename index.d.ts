import { JwtPayload } from "jsonwebtoken"; 
declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;  
    }
  }
}


// import { TUser } from "./src/app/modules/user/user.interface";


// declare global {
//   namespace Express {
//     interface Request {
//       user: TUser;
//       socketAuthToken: string;
//     }
//   }
// }