import { model, Schema } from "mongoose";
import { TUser } from "./user.interface";
import bcrypt from 'bcrypt'
import config from "../../config";

const userSchema = new Schema<TUser>({ 
    id: {
        type: String
    } , 
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value: string) {
              return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value)
            },
            message: '{VALUE} is not a valid email',
          },
          immutable: true,
    },
    password: {
        type: String,
        required: true,
        select: 0
    },
    needsPasswordChange: {
        type: Boolean,
        default: true,
    },
    role: {
        type: String,
       enum : ['user','admin'],
    },
    status: {
        type: String,
    //    enum : UserStatus,
       default: 'in-progress'
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
},
{
    timestamps: true
})

userSchema.pre('save', async function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this; // doc
    // hashing password and save into DB
  
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds),
    );
  
    next();
  });
  
  // set '' after saving password
  userSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
  });



export const User = model<TUser>('User', userSchema)