import { NextFunction, Request, Response } from "express";

export const getVideo = async (req: Request, res: Response, next: NextFunction) => {
    const key = "output/webds_1080/master.m3u8";
    res.json({key});
}