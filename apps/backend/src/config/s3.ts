import { S3Client } from "@aws-sdk/client-s3";
import { readdir } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { join, relative } from "node:path";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import type { Readable } from "node:stream";
import { env } from "./env.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { type NodeJsClient } from "@smithy/types";

const region = env.AWS_REGION;
const bucketName = env.S3_BUCKET_NAME;

export const s3 = new S3Client({ region }) as NodeJsClient<S3Client>;

export async function getUploadPresignedUrl(fileKey: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
    ContentType: contentType
  });

  try {
    // Generate a URL that is valid for 5 minutes (300 seconds)
    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
    return presignedUrl;
  } catch (error) {
    console.error("Error creating presigned URL", error);
    throw error;
  }
}

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