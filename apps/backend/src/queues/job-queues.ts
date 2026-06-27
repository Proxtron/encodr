import connection from "../config/redis.js";
import { Queue } from 'bullmq';
import type { TranscodeJobData, UploadJobData } from "../types/jobs.js";
import { queueDepth } from "../services/metrics.js";

const transcodingQueue = new Queue<TranscodeJobData>("transcode", { connection });
const uploadQueue = new Queue<UploadJobData>("upload", { connection });

setInterval(async () => {
    const transcodeWaiting = await transcodingQueue.getWaitingCount();
    const uploadWaiting = await uploadQueue.getWaitingCount();
    queueDepth.set({ queue: 'transcode' }, transcodeWaiting);
    queueDepth.set({ queue: 'upload' }, uploadWaiting);
}, 5000);

export { transcodingQueue, uploadQueue };