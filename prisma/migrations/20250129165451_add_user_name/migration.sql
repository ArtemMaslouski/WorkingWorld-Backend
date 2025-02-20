/*
  Warnings:

  - A unique constraint covering the columns `[UserName]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `UserName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_TelephoneNumber_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "UserName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_UserName_key" ON "User"("UserName");
