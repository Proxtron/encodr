import connection from "../config/redis.js";
import { Queue } from 'bullmq';
import type { TranscodeJobData, UploadJobData } from "../types/jobs.js";

const transcodingQueue = new Queue<TranscodeJobData>("transcode", { connection });
const uploadQueue = new Queue<UploadJobData>("upload", { connection });

export { transcodingQueue, uploadQueue };