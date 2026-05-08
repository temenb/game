/*
  Warnings:

  - Added the required column `status` to the `Battle` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('New', 'Active', 'Finished');

-- AlterTable
ALTER TABLE "Battle" ADD COLUMN     "Winner" TEXT,
ADD COLUMN     "status" "Status" NOT NULL;
