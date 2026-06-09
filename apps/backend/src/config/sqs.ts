import { SQSClient } from "@aws-sdk/client-sqs";
import { env } from "./env.js";

export const sqs = new SQSClient({ region: env.AWS_REGION });