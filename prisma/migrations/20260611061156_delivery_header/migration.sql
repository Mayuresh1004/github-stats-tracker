/*
  Warnings:

  - A unique constraint covering the columns `[deliveryId]` on the table `GithubEvents` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "GithubEvents" ADD COLUMN     "deliveryId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "GithubEvents_deliveryId_key" ON "GithubEvents"("deliveryId");
