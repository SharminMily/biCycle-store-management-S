"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    name: { type: String, required: [true, 'Name is required'] },
    brand: { type: String, required: [true, 'Brand is required'] },
    price: { type: Number, required: [true, 'Price is required'] },
    image: { type: String, required: [true, 'Image is required'] },
    type: {
        type: String,
        enum: ['Mountain', 'Road', 'Hybrid', 'BMX', 'Electric'],
        required: [true, 'Type is required'],
    },
    description: { type: String, required: [true, 'Description is required'] },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        default: 0,
    },
    inStock: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
exports.ProductModel = (0, mongoose_1.model)('Product', productSchema);
