import { z } from "zod";

const schema = z.object({
    // server
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

    // database
    DATABASE_URL: z.string().url(),

    // redis
    REDIS_URL: z.string().url(),

    // aws
    AWS_REGION: z.string(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    S3_BUCKET_NAME: z.string(),
    // SQS_QUEUE_URL: z.string().url(),

    // delivery
    CDN_HOST: z.string(),

    // client
    CLIENT_HOST: z.string().url()
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
    process.exit(1);
}

export const env = parsed.data;