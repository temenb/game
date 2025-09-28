/*
  Warnings:

  - You are about to drop the column `isDestroyed` on the `Asteroid` table. All the data in the column will be lost.
  - Added the required column `asteroid_grade` to the `Asteroid` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."AsteroidGrade" AS ENUM ('UNKNOWN', 'BROKEN', 'NORMAL', 'GOOD', 'LEGEND', 'EPIC', 'RELICT');

-- CreateEnum
CREATE TYPE "public"."ResourceAmount" AS ENUM ('UNKNOWN', 'LOW', 'NORMAL', 'HIGHT');

-- CreateEnum
CREATE TYPE "public"."ResourceType" AS ENUM ('UNKNOWN', 'IRON', 'CRYSTAL');

-- CreateEnum
CREATE TYPE "public"."OwnerType" AS ENUM ('NONE', 'PLAYER', 'GUILD');

-- AlterTable
ALTER TABLE "public"."Asteroid" DROP COLUMN "isDestroyed",
ADD COLUMN     "asteroid_grade" "public"."AsteroidGrade" NOT NULL,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "owner_id" TEXT,
ADD COLUMN     "owner_type" "public"."OwnerType" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "resource_amount" "public"."ResourceAmount" NOT NULL DEFAULT 'UNKNOWN',
ADD COLUMN     "resource_type" "public"."ResourceType" NOT NULL DEFAULT 'UNKNOWN';

-- CreateIndex
CREATE INDEX "Asteroid_galaxy_id_idx" ON "public"."Asteroid"("galaxy_id");

-- CreateIndex
CREATE INDEX "Asteroid_owner_id_idx" ON "public"."Asteroid"("owner_id");

-- CreateIndex
CREATE INDEX "Asteroid_axisX_axisY_idx" ON "public"."Asteroid"("axisX", "axisY");
