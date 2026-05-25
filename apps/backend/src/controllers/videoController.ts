import { NextFunction, Request, Response } from "express";
import path from "node:path";

export const getVideo = (req: Request, res: Response, next: NextFunction) => {
    return res.sendFile(path.join(import.meta.dirname));
}