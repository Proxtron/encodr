import { Job } from "bullmq";
import type { Processor } from "bullmq";
import { TranscodeJobData } from "../../types/jobs.js";
import { getFile } from "../../config/s3.js";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { createWriteStream } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import { transcode } from "./ffmpeg.js";

export const handleTranscode: Processor = async (job: Job<TranscodeJobData>) => {
    const { uploadS3Key, uuid } = job.data;

    const tempUploadDirectory = `tmp/uploads/`;
    const tempUploadPath = `${tempUploadDirectory}${uuid}.mp4`;
    try {
        const s3Stream = await getFile(uploadS3Key) as Readable;
        if(!s3Stream) {
            throw new Error(`File not retrieved from S3 bucket with key: ${uploadS3Key}`)
        }

        await step(`download ${uploadS3Key} -> ${tempUploadPath}`, async () => {
            await mkdir(tempUploadDirectory, { recursive: true });
            const tempUploadPathWriteStream = createWriteStream(tempUploadPath);
            await pipeline(s3Stream, tempUploadPathWriteStream);
        });

        // const height = await step(`probe height of ${tempUploadPath}`, () => probeHeight(tempUploadPath));
        const tempOutputDirectory = `tmp/output/${uuid}/`;
        await step(`transcode ${tempUploadPath} and generate hls segments and playlists in ${tempOutputDirectory}`, async () => {
            await transcode(tempUploadPath, tempOutputDirectory);
        });
    } finally {
        // await rm(`tmp/`, { force: true, recursive: true })
    }
}



const step = async <T>(context: string, fn: () => Promise<T>): Promise<T> => {
    try {
        return await fn();
    } catch(error) {
        throw new Error(context, { cause: error });
    }
}