import { VideoStatus } from "../../generated/prisma/enums.js";
import { prisma } from "../config/prisma.js"

export const retrieve = async (id: number) => {
    return await prisma.video.findUnique({
        where: {id}
    });
}

export const retrieveAll = async () => {
    return await prisma.video.findMany();
}

export const insert = async (extension: string, uploadName: string, uuidName: string, status: VideoStatus) => {
    return await prisma.video.create({
        data: {extension, uploadName, uuidName}
    });
}