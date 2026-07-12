import connection from "../config/redis.js";
import { Queue } from 'bullmq';
import type { TranscodeJobData, UploadJobData } from "../types/jobs.js";

const transcodingQueue = new Queue<TranscodeJobData>("transcode", { connection });
const uploadQueue = new Queue<UploadJobData>("upload", { connection });

const jobs: { name: string; data: TranscodeJobData; }[] =  []

for(let i = 0; i < 24; i++) {
    jobs.push({ name: "transcode", data: { uploadS3Key: "", uuid: String(1) }});
}

transcodingQueue.addBulk(jobs);

export { transcodingQueue, uploadQueue };