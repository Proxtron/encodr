import connection from "../config/redis.js";
import { Queue } from 'bullmq';
import type { UploadJobData } from "../types/jobs.js";

const uploadQueue = new Queue<UploadJobData>("upload", { connection });

export { uploadQueue };