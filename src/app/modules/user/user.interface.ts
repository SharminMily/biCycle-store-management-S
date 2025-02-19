/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { Model, ObjectId } from "mongoose";
import { USER_ROLE } from "./user.constant";

export interface TUser {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _id: any | ObjectId;
    user: unknown; 
    id: string ,  
    name: string,
    email: string,
    password: string,
    // needsPasswordChange: boolean;
    // passwordChangedAt?: Date;
    role:  'user'| 'admin',
    status: 'in-progress' | 'blocked';
    isDeleted: boolean;
    phone?: string;
    address?: string;
    city?: string;
    createdAt: Date;
    updatedAt: Date;
  
}

export interface userModel extends Model<TUser>{
    myStaticMethod(): number;
    isUserExistsByCustomId(id: string): Promise<TUser>;
    isPasswordMatched(
      plainTextPassword: string,
      hashedPassword: string,
    ): Promise<boolean>;
    // isJWTIssuedBeforePasswordChanged(
    //   passwordChangedTimestamp: Date,
    //   jwtIssuedTimestamp: number,
    // ): boolean;
  }

// export interface userModel extends Model<TUser>{
//     myStaticMethod(): number;
// }
export type TUserRole = keyof typeof USER_ROLE;