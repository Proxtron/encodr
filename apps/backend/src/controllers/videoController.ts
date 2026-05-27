import { NextFunction, Request, Response } from "express";
import * as video from "../db/video.js"
import { AppError } from "../error/error.js";

export const getVideo = async (req: Request<{
    id: string
}>, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    const videoInfo = await video.retrieve(id);

    if(!videoInfo) throw new AppError("Video not found", 404);

    const link = `https://df4qrk6fd82vl.cloudfront.net/output/${videoInfo.uuidName}/master.m3u8`;
    return res.json({link});
}