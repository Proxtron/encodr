import type { Request, Response, NextFunction } from "express";
import { AppError } from "../error/error.js";
import { env } from "../config/env.js";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    if(err instanceof AppError) {
        return res.status(err.statusCode).json({message: err.message});
    }

    const message = env.NODE_ENV === "production" ? "Something went wrong" : err.message
    return res.status(500).json({ message });
}