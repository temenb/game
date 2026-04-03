/*
  Warnings:

  - You are about to drop the column `isDestroyed` on the `Spawner` table. All the data in the column will be lost.
  - Added the required column `spawn_grade` to the `Spawner` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."SpawnGrade" AS ENUM ('UNKNOWN', 'BROKEN', 'NORMAL', 'GOOD', 'LEGEND', 'EPIC', 'RELICT');

-- CreateEnum
CREATE TYPE "public"."ResourceAmount" AS ENUM ('UNKNOWN', 'LOW', 'NORMAL', 'HIGHT');

-- CreateEnum
CREATE TYPE "public"."ResourceType" AS ENUM ('UNKNOWN', 'IRON', 'CRYSTAL');

-- CreateEnum
CREATE TYPE "public"."OwnerType" AS ENUM ('NONE', 'PLAYER', 'GUILD');

-- AlterTable
ALTER TABLE "public"."Spawner" DROP COLUMN "isDestroyed",
ADD COLUMN     "spawn_grade" "public"."SpawnGrade" NOT NULL,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "owner_id" TEXT,
ADD COLUMN     "owner_type" "public"."OwnerType" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "resource_amount" "public"."ResourceAmount" NOT NULL DEFAULT 'UNKNOWN',
ADD COLUMN     "resource_type" "public"."ResourceType" NOT NULL DEFAULT 'UNKNOWN';

-- CreateIndex
CREATE INDEX "Spawn_galaxy_id_idx" ON "public"."Spawner"("galaxy_id");

-- CreateIndex
CREATE INDEX "Spawn_owner_id_idx" ON "public"."Spawner"("owner_id");

-- CreateIndex
CREATE INDEX "Spawn_axisX_axisY_idx" ON "public"."Spawner"("axisX", "axisY");
