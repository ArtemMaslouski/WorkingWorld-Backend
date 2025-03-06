/*
  Warnings:

  - You are about to drop the column `Title` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "Title",
ADD COLUMN     "Category" TEXT NOT NULL DEFAULT 'Uncategorized',
ADD COLUMN     "Subcategory" TEXT NOT NULL DEFAULT 'None';
