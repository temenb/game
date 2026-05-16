/*
  Warnings:

  - You are about to drop the column `Winner` on the `Battle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Battle" DROP COLUMN "Winner",
ADD COLUMN     "winner" TEXT;
