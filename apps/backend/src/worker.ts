import "dotenv/config";
import { Worker } from "bullmq";
import { handleTranscode, handleUpload } from "./jobs/transcode/handler.js";
import os from "node:os";
import connection from "./config/redis.js";
import { TranscodeJobData } from "./types/jobs.js";
import { uploadQueue } from "./queues/job-queues.js";
import * as Video from "./db/video.js"
import { jobsCompleted, activeWorkers } from "./services/metrics.js";

/*
Transcode worker handles transcode jobs that spawn ffmpeg child processes. These ffmpeg processes are CPU intensive.
So we are setting the concurrency factor of this to be the number of cores on the machine
*/
const transcodeWorker = new Worker<TranscodeJobData>("transcode", handleTranscode, { connection, concurrency: os.cpus().length });

transcodeWorker.on("active", (job) => {
    activeWorkers.inc();
});

transcodeWorker.on("completed", (job) =>  {
    console.log(`Transcoding job ${job.id} completed`);

    jobsCompleted.inc({ status: "success" });
    activeWorkers.dec();
    
    uploadQueue.add("upload", { uuid: job.data.uuid });
});

transcodeWorker.on("failed", (job, err) => {
    console.error(`Transcoding job ${job?.id} failed`, err);

    jobsCompleted.inc({ status: "failed" });
    activeWorkers.dec();

    if(job) Video.updateStatus(job.data.uuid, "FAILED");
});

/*
Upload worker handles upload jobs that upload HLS segments and playlists to S3. This is an IO intensive job
Concurrency factors are set higher to allow multiple upload jobs to happen at the same time
*/
const uploadWorker = new Worker("upload", handleUpload, { connection, concurrency: 50 });

uploadWorker.on("active", (job) => {
    activeWorkers.inc();
});

uploadWorker.on("completed", (job) => {
    console.log(`Uploading job ${job.id} completed`);

    jobsCompleted.inc({ status: "success" });
    activeWorkers.dec();

    Video.updateStatus(job.data.uuid, "READY")
})

uploadWorker.on("failed", (job, err) => {
    console.error(`Uploading job ${job?.id} failed`, err);

    jobsCompleted.inc({ status: "failed" });
    activeWorkers.dec();

    if(job) Video.updateStatus(job.data.uuid, "FAILED");
});
