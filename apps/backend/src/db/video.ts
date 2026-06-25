import { VideoStatus } from "../prisma/enums.js";
import { prisma } from "../config/prisma.js"

export const retrieve = async (id: number) => {
    return await prisma.video.findUnique({
        where: {id}
    });
}

export const retrieveAll = async () => {
    return await prisma.video.findMany();
}

export const insert = async (extension: string, title: string, uuidName: string, status: VideoStatus) => {
    return await prisma.video.create({
        data: {extension, title, uuidName, status}
    });
}

export const updateStatus = async (uuidName: string, status: VideoStatus) => {
    return await prisma.video.update({
        where: { uuidName },
        data: { status }
    })
}