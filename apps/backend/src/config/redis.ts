import { Redis } from "ioredis";
import { env } from "./env.js";

const connection = new Redis(env.REDIS_URL, {maxRetriesPerRequest: null});
export default connection