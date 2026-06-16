import { Worker } from "bullmq";
import { env } from "./config/env.js";
import { handleTranscode } from "./jobs/transcode/handler.js";
import os from "node:os";
import connection from "./config/redis.js";
import { TranscodeJobData } from "./types/jobs.js";

/*
Transcode worker handles transcode jobs that spawn ffmpeg child processes. These ffmpeg processes are CPU intensive.
So we are setting the concurrency factor of this to be the number of cores on the machine
*/
const transcodeWorker = new Worker<TranscodeJobData>(env.BULLMQ_QUEUE_NAME, handleTranscode, { connection, concurrency: os.cpus().length });

transcodeWorker.on("completed", (job) => console.log(`Job ${job.id} completed`));
transcodeWorker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed: ${err}`);
})

/*
Upload worker handles upload jobs that upload HLS segments and playlists to S3. This is an IO intensive job
Concurrency factors are set higher to allow multiple upload jobs to happen at the same time
*/
// const uploadWorker = new Worker(env.BULLMQ_QUEUE_NAME, handleUpload, { connection, concurrency: 50 });