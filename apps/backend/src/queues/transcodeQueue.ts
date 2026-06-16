import { env } from "../config/env.js";
import connection from "../config/redis.js";
import { Queue } from 'bullmq';
import type { TranscodeJobData } from "../types/jobs.js";

const transcodingQueue = new Queue<TranscodeJobData>(env.BULLMQ_QUEUE_NAME, { connection });

export { transcodingQueue };