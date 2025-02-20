/*
  Warnings:

  - You are about to drop the column `TelephoneNumber` on the `User` table. All the data in the column will be lost.
  - Added the required column `Email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "TelephoneNumber",
ADD COLUMN     "Email" TEXT NOT NULL;
