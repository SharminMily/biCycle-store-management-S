"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerDuplicateError = void 0;
const http_status_1 = require("http-status");
const handlerDuplicateError = (err, res) => {
    res.status(http_status_1.status.CONFLICT).json({
        status: false,
        message: err.message,
        error: err
    });
};
exports.handlerDuplicateError = handlerDuplicateError;
