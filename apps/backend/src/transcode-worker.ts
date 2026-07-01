import "dotenv/config";
import { Worker } from "bullmq";
import { handleTranscode } from "./jobs/transcode/handler.js";
import os from "node:os";
import connection from "./config/redis.js";
import { TranscodeJobData } from "./types/jobs.js";
import { uploadQueue } from "./queues/job-queues.js";
import * as Video from "./db/video.js"

/*
Transcode worker handles transcode jobs that spawn ffmpeg child processes. These ffmpeg processes are CPU intensive.
So we are setting the concurrency factor of this to be the number of cores on the machine
*/
const transcodeWorker = new Worker<TranscodeJobData>("transcode", handleTranscode, { connection, concurrency: os.cpus().length });

transcodeWorker.on("completed", (job) =>  {
    console.log(`Transcoding job ${job.id} completed`);
    uploadQueue.add("upload", { uuid: job.data.uuid });
});

transcodeWorker.on("failed", (job, err) => {
    console.error(`Transcoding job ${job?.id} failed`, err);
    if(job) Video.updateStatus(job.data.uuid, "FAILED");
});