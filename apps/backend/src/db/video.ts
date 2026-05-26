import { prisma } from "./prisma.js"

export const retrieve = async (id: number) => {
    return await prisma.video.findUnique({
        where: {id}
    });
}