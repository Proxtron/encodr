import type { Request, Response, NextFunction } from "express";
import { AppError } from "../error/error.js";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { randomUUID } from "node:crypto";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error({ err, path: req.path, method: req.method }, err.message);
    if(err instanceof AppError) {
        return res.status(err.statusCode).json({message: err.message});
    }

    const message = env.NODE_ENV === "production" ? "Something went wrong" : err.message
    res.set("X-Request-Id", randomUUID());
    return res.status(500).json({ message });
}