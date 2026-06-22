export const buildS3UploadPath = (uuidName: string, ext: string) => `uploads/${uuidName}.${ext}`;
export const buildS3OutputPrefix = (uuidName: string) => `output/${uuidName}/`;
export const buildS3PlaylistPath = (uuidName: string) => `output/${uuidName}/master.m3u8`;

export const extractUuidFromS3UploadPath = (key: string) => {
    //key = uploads/{uuidName}.{ext}
    const slashSeparated = key.split("/");
    const afterSlash = slashSeparated[1]; //{uuidName}.{ext}
    if(!afterSlash) return undefined;

    const periodSeparated = afterSlash.split(".");
    const beforePeriod = periodSeparated[0]; //{uuidName}

    return beforePeriod;
}