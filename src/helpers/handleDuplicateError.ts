/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express"
import { status } from "http-status"

export const handlerDuplicateError = (err: any, res: Response) => {
    res.status(status.CONFLICT).json({
        status: false,
        message: err.message,
        error: err
    })
} 