/* eslint-disable no-unused-vars */
import { Model } from "mongoose";

export interface TUser { 
    id: string ,  
    email: string,
    password: string,
    // needsPasswordChange: boolean;
    // passwordChangedAt?: Date;
    role:  'user'| 'admin',
    status: 'in-progress' | 'blocked';
    isDeleted: boolean; 
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