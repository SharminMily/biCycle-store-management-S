"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const userValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: 'Name must be provided and must be a string',
        }),
        email: zod_1.z
            .string({
            required_error: 'Email must be provided and must be a string',
        })
            .email(),
        password: zod_1.z
            .string({
            required_error: 'Password is required for your safety',
        })
            .max(20, { message: 'Password can not be more than 20 characters' }),
    }),
});
exports.UserValidation = {
    userValidationSchema,
};
