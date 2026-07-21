import { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { AppError } from "../error/error.js";
import { getJWTToken } from "../services/auth.js";

export const loginUser = async (req: Request<{}, {}, {
    username: string,
    password: string
}>, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    if(username !== env.CLIENT_USER || password !== env.CLIENT_PASSWORD) {
        throw new AppError("Username or password is incorrect", 400);
    } 

    const token = getJWTToken(username, password);

    res.cookie("token", token);
    return res.status(200).json({ token });
};