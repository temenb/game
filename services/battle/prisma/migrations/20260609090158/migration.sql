/*
  Warnings:

  - You are about to drop the column `playersCount` on the `Battle` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "BattleStatus" ADD VALUE 'New';

-- AlterTable
ALTER TABLE "Battle" DROP COLUMN "playersCount";
