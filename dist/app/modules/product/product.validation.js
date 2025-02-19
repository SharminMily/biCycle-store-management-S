"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productValidationSchema = void 0;
const zod_1 = require("zod");
exports.productValidationSchema = zod_1.z.object({
    name: zod_1.z.string(),
    brand: zod_1.z.string(),
    price: zod_1.z.number().positive('Price must be a positive number'),
    image: zod_1.z.string().url('Image must be a valid URL'), // ✅ Should be a string
    type: zod_1.z.enum(['Mountain', 'Road', 'Hybrid', 'BMX', 'Electric']),
    description: zod_1.z.string(),
    quantity: zod_1.z.number().int().nonnegative('Quantity must be non-negative'),
    inStock: zod_1.z.boolean().optional().default(false),
});
exports.default = exports.productValidationSchema;
