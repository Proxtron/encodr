import { NextFunction, Request, Response } from "express";
import * as video from "../db/video.js"
import { AppError } from "../error/error.js";
import { buildHlsUrl } from "../services/playback.js";
import { separateNameAndExtension } from "../services/video.js";
import { randomUUID } from "crypto";
import { generatePresignedUploadUrl } from "../services/presign.js";

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
    filename: string
}>, res: Response, next: NextFunction) => {
    const filename = req.body.filename;

    const { basename, extension } = separateNameAndExtension(filename);
    const uuidName = randomUUID();

    const insertedVideo = await video.insert(extension, basename, uuidName);
    const videoId = insertedVideo.id;

    const presignedUrl = await generatePresignedUploadUrl(uuidName);

    return res.json({presignedUrl, videoId});
}