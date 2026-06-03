import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { AppError } from "../error/error.js";

export const validationResultMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array().map((error) => error.msg);
    if(errors.length > 0)  return next(new AppError(errors[0], 400));
    next();
}