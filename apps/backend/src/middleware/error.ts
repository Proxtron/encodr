import type { Request, Response, NextFunction } from "express";
import { AppError } from "../error/error.js";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    if(err instanceof AppError) {
        return res.status(err.statusCode).json({message: err.message});
    }
    return res.status(500).json({message: "Something went wrong"});
}