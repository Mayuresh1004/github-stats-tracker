/*
  Warnings:

  - A unique constraint covering the columns `[userId,date]` on the table `dailyStats` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "dailyStats_userId_date_key" ON "dailyStats"("userId", "date");
