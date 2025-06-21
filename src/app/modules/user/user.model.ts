import { model, Schema } from "mongoose";
import { TUser, userModel } from "./user.interface";
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';
import config from "../../config";


const userSchema = new Schema<TUser, userModel>({ 
  id: { type: String, unique: true, default: uuidv4 }, 
    name: { type: String, required: true , trim: true},
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
           trim: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    // needsPasswordChange: {
    //     type: Boolean,
    //     default: true,
    // },
    role: {
        type: String,
       enum : ['user','admin'],
       default: "user",
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
    phone: { type: String, default: "N/A" },
    address: { type: String, default: "N/A" },
    city: { type: String, default: "N/A" },
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

export const User = model<TUser, userModel>('User', userSchema)