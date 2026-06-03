import path from "node:path";

export const separateNameAndExtension = (filename: string) => {
    const extension = path.extname(filename);
    const basename = path.basename(filename, extension);
    return { basename, extension }
}