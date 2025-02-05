import { model, Schema } from "mongoose";
import { TUser, userModel } from "./user.interface";
import bcrypt from 'bcrypt'

const userSchema = new Schema<TUser, userModel>({ 
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
},
{
    timestamps: true
})

 // set '' after saving password
 userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  return await User.findOne({ id }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};


export const User = model<TUser, userModel>('User', userSchema)