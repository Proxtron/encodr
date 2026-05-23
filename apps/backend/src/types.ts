import type { User as PrismaUser } from "@prisma/client";

export {};

declare global {
    namespace Express {
        interface User extends PrismaUser {}
        interface Request {
            folderPath?: string;
        }
    }
}