import { prisma } from "./prisma.js"

export const retrieve = async (id: number) => {
    return await prisma.video.findUnique({
        where: {id}
    });
}

export const retrieveAll = async () => {
    return await prisma.video.findMany();
}