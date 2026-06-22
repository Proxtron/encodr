import { getUploadPresignedUrl } from "../config/s3.js";

export const generatePresignedUploadUrl = async (uuidName: string) => {
    const mimeType = "video/mp4";
    const fileKey = `uploads/${uuidName}.mp4`;
    const presignedUrl = await getUploadPresignedUrl(fileKey, mimeType);
    return presignedUrl;
}