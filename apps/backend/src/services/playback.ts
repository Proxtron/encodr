import { env } from "../config/env.js";

const CDN_HOST = env.CDN_HOST;

const buildHlsUrl = (uuidName: string) => {
    return `${CDN_HOST}/output/${uuidName}/master.m3u8`;
}

export { buildHlsUrl };