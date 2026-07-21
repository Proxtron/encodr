import { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { AppError } from "../error/error.js";
import { verifyJWT } from "../services/auth.js";

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    const tokenHeaderKey = env.TOKEN_HEADER_KEY;
    const token = req.get(tokenHeaderKey);
    if(!token) {
        throw new AppError("Invalid token. Unauthenticated.", 401);
    }

    console.log(verifyJWT(token));
    next();
};