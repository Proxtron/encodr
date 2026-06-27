import { NextFunction, Request, Response } from "express";
import * as video from "../db/video.js"
import { AppError } from "../error/error.js";
import { buildHlsUrl } from "../services/playback.js";
import { randomUUID } from "crypto";
import { generatePresignedUploadUrl } from "../services/presign.js";
import { register } from "prom-client"

export const getVideo = async (req: Request<{
    id: string
}>, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    const videoInfo = await video.retrieve(id);

    if(!videoInfo) throw new AppError("Video not found", 404);

    const link = buildHlsUrl(videoInfo.uuidName);
    return res.json({link});
}

export const getAllVideos = async (req: Request, res: Response, next: NextFunction) => {
    const videos = await video.retrieveAll();
    return res.json({videos});
}

export const insertVideo = async (req: Request<{}, {}, {
    title: string,
}>, res: Response, next: NextFunction) => {
    const { title } = req.body
    const uuidName = randomUUID();

    const insertedVideo = await video.insert("mp4", title, uuidName, "PENDING");
    const videoId = insertedVideo.id;

    const presignedUrl = await generatePresignedUploadUrl(uuidName);

    return res.json({presignedUrl, videoId});
}

export const getMetrics = async (req: Request, res: Response, next: NextFunction) => {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
}