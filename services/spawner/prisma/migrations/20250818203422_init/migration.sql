-- CreateEnum
CREATE TYPE "public"."SpawnType" AS ENUM ('UNKNOWN', 'BASE', 'ASTEROID', 'PORTAL');

-- CreateTable
CREATE TABLE "public"."Spawner" (
    "id" TEXT NOT NULL,
    "galaxy_id" TEXT NOT NULL,
    "spawn_type" "public"."SpawnType" NOT NULL,
    "axisX" INTEGER NOT NULL,
    "axisY" INTEGER NOT NULL,
    "health" INTEGER NOT NULL,
    "isDestroyed" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Spawn_pkey" PRIMARY KEY ("id")
);
