/*
  Warnings:

  - Added the required column `playersCount` to the `Battle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Battle" ADD COLUMN     "playersCount" INTEGER NOT NULL;
