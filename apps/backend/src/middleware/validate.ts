import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validationResultMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array().map((error) => error.msg);
    if(errors.length > 0)  return res.status(400).json({message: errors[0]});
    next();
}