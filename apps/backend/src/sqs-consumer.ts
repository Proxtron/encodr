import { Consumer } from "sqs-consumer";
import { env } from "./config/env.js";
import { sqs } from "./config/sqs.js";
import type { S3Event } from "aws-lambda";
import { transcodingQueue } from "./queues/transcodeQueue.js";
import { updateStatus } from "./db/video.js";

const app = Consumer.create({
    queueUrl: env.SQS_QUEUE_URL,
    sqs,
    handleMessage: async (message) => {
        if(!message.Body) return;

        const messageBody = JSON.parse(message.Body) as S3Event;
        if(!messageBody.Records) return; //S3:TestEvent skip

        for(const record of messageBody.Records) {
            const key = record.s3.object.key;
            if(record.s3.configurationId === "transcode-on-upload") {
                await transcodingQueue.add("transcode", {
                    bucket: record.s3.bucket,
                    key
                });

                await updateStatus(key, "QUEUED");
            }
        }
        
        return message;
    }
});

app.start();