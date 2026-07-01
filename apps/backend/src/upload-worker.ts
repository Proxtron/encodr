import "dotenv/config";
import { Worker } from "bullmq";
import { handleUpload } from "./jobs/transcode/handler.js";
import connection from "./config/redis.js";
import * as Video from "./db/video.js"

/*
Upload worker handles upload jobs that upload HLS segments and playlists to S3. This is an IO intensive job
Concurrency factors are set higher to allow multiple upload jobs to happen at the same time
*/
const uploadWorker = new Worker("upload", handleUpload, { connection, concurrency: 50 });

uploadWorker.on("completed", (job) => {
    console.log(`Uploading job ${job.id} completed`);
    Video.updateStatus(job.data.uuid, "READY")
})

uploadWorker.on("failed", (job, err) => {
    console.error(`Uploading job ${job?.id} failed`, err);
    if(job) Video.updateStatus(job.data.uuid, "FAILED");
});