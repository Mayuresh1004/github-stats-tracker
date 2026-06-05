/*
  Warnings:

  - Added the required column `prs_merged` to the `dailyStats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dailyStats" ADD COLUMN     "prs_merged" INTEGER NOT NULL;
