"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const config_1 = __importDefault(require("../../config"));
const userSchema = new mongoose_1.Schema({
    id: { type: String, unique: true, default: uuid_1.v4 },
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value);
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
        enum: ['user', 'admin'],
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
}, {
    timestamps: true
});
userSchema.pre('save', async function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this; // doc
    // hashing password and save into DB
    user.password = await bcrypt_1.default.hash(user.password, Number(config_1.default.bcrypt_salt_rounds));
    next();
});
// set '' after saving password
userSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
});
exports.User = (0, mongoose_1.model)('User', userSchema);
