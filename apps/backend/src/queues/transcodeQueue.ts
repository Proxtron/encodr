import connection from "../config/redis.js";
import { Queue } from 'bullmq';
import type { TranscodeJobData } from "../types/jobs.js";

const transcodingQueue = new Queue<TranscodeJobData>("transcode", { connection });

export { transcodingQueue };