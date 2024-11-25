"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, message: '{VALUE} is not valid' },
    email: { type: String, required: true, message: '{VALUE} is not valid' },
    brand: { type: String, required: true },
    price: {
        type: Number,
        required: true,
        message: 'Price must be a positive number',
    },
    type: {
        type: String,
        enum: ['Mountain', 'Road', 'Hybrid', 'BMX', 'Electric'],
        required: true,
    },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    inStock: { type: Boolean, default: true },
}, { timestamps: true });
exports.ProductModel = (0, mongoose_1.model)('Product', productSchema);
