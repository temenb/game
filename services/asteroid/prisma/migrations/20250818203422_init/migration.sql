-- CreateEnum
CREATE TYPE "public"."AsteroidType" AS ENUM ('UNKNOWN', 'BASE', 'ASTEROID', 'PORTAL');

-- CreateTable
CREATE TABLE "public"."Asteroid" (
    "id" TEXT NOT NULL,
    "galaxy_id" TEXT NOT NULL,
    "asteroid_type" "public"."AsteroidType" NOT NULL,
    "axisX" INTEGER NOT NULL,
    "axisY" INTEGER NOT NULL,
    "health" INTEGER NOT NULL,
    "isDestroyed" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asteroid_pkey" PRIMARY KEY ("id")
);
