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
    phone: { type: String, default: "N/A" },
    address: { type: String, default: "N/A" },
    city: { type: String, default: "N/A" },
},
{
    timestamps: true
})


// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(8);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const saltRounds = Number(config.bcrypt_salt_rounds) || 10; // Default to 10 if not set
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  return await User.findOne({ id }).select('+password');
};


// set '' after saving password
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});



export const User = model<TUser, userModel>('User', userSchema)