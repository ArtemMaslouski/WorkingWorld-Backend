/*
  Warnings:

  - You are about to drop the column `Login` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `Role` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[TelephoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `TelephoneNumber` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_Login_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "Login",
DROP COLUMN "Role",
ADD COLUMN     "TelephoneNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_TelephoneNumber_key" ON "User"("TelephoneNumber");
