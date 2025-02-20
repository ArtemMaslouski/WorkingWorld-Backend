-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "Login" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "Role" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Login_key" ON "User"("Login");
