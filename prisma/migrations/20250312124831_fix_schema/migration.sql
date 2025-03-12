/*
  Warnings:

  - A unique constraint covering the columns `[userInfoId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userInfoId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_userInfoId_key" ON "User"("userInfoId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userInfoId_fkey" FOREIGN KEY ("userInfoId") REFERENCES "UserInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
