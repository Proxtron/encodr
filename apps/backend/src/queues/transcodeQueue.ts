import connection from "../config/redis.js";
import { Queue } from 'bullmq';

const transcodingQueue = new Queue('transcode', {connection});
export { transcodingQueue };