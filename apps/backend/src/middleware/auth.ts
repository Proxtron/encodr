import { NextFunction, Request, Response } from "express";
import { AppError } from "../error/error.js";
import { verifyJWT } from "../services/auth.js";

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies["token"];
    if(!token) {
        throw new AppError("Invalid token. Unauthenticated.", 401);
    }

    if(!verifyJWT(token)) {
        throw new AppError("Invalid token. Unauthenticated.", 401);
    }

    next();
};