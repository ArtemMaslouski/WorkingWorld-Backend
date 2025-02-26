-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "Title" TEXT NOT NULL,
    "Address" TEXT NOT NULL,
    "BeginAt" TEXT NOT NULL,
    "EndAt" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Cost" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
