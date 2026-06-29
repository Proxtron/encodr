import { Consumer } from "sqs-consumer";
import { env } from "./config/env.js";
import { sqs } from "./config/sqs.js";
import type { S3Event } from "aws-lambda";
import { transcodingQueue } from "./queues/job-queues.js";
import { updateStatus } from "./db/video.js";
import { extractUuidFromS3UploadPath } from "./services/video.js";
import express from "express";
import { register } from "prom-client";

const app = Consumer.create({
    queueUrl: env.SQS_QUEUE_URL,
    sqs,
    handleMessage: async (message) => {
        if(!message.Body) return message;

        const messageBody = JSON.parse(message.Body) as S3Event;
        if(!messageBody.Records) return message; //S3:TestEvent skip

        for(const record of messageBody.Records) {
            if(record.s3.configurationId !== "transcode-on-upload") continue;

            const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));
            const uuid = extractUuidFromS3UploadPath(key);
            if(!uuid) {
                console.error(`Could not extract uuid from key: ${key}`);
                continue;
            }

            const job = await transcodingQueue.add("transcode", { uploadS3Key: key, uuid });
            await updateStatus(uuid, "QUEUED");
        }
        
        return message;
    }
});

app.start();

// Serves metrics running on this worker process to prometheus
const metricsApi = express();

metricsApi.get("/metrics", async (req, res) => {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
});

metricsApi.listen(env.SQS_CONSUMER_PORT, () => {
    console.log(`SQS Consumer HTTP Metrics API started on port ${env.SQS_CONSUMER_PORT}`);
});