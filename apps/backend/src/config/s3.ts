import { S3Client } from "@aws-sdk/client-s3";
import { readdir } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { join, relative } from "node:path";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import type { Readable } from "node:stream";

const region = process.env.AWS_REGION;
if (!region) throw new Error("AWS_REGION env var is not set");
export const s3 = new S3Client({ region });

const bucketName = process.env.S3_BUCKET_NAME;
if (!bucketName) throw new Error("S3_BUCKET_NAME env var is not set");

export async function uploadFile(
    fileName: string,
    body: Buffer | Uint8Array | string | Readable,
    contentType?: string,
) {
    await s3.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: body,
        ContentType: contentType,
    }));
}

export async function getFile(fileName: string) {
    const result = await s3.send(new GetObjectCommand({
        Bucket: bucketName,
        Key: fileName,
    }));
    return result.Body; // a Readable stream in Node
}

export async function uploadFolder(localDir: string, s3Prefix: string) {
    const files = await readdir(localDir, { recursive: true, withFileTypes: true });

    for (const f of files) {
        if (!f.isFile()) continue;
        const fullPath = join(f.parentPath, f.name);
        const key = `${s3Prefix}/${relative(localDir, fullPath)}`;

        await s3.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: createReadStream(fullPath),
        }));
    }
}