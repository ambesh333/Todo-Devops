-- CreateEnum
CREATE TYPE "status_type" AS ENUM ('Not_Staretd', 'In_Progress', 'Completed');

-- CreateTable
CREATE TABLE "Todo" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "status_type" NOT NULL DEFAULT 'Not_Staretd',

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Todo_title_key" ON "Todo"("title");
