/*
  Warnings:

  - A unique constraint covering the columns `[uuidName]` on the table `Video` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uploadName` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uuidName` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "uploadName" TEXT NOT NULL,
ADD COLUMN     "uuidName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Video_uuidName_key" ON "Video"("uuidName");
