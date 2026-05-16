-- CreateEnum
CREATE TYPE "CellValue" AS ENUM ('X', 'O', 'EMPTY');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Active', 'Finished');

-- CreateTable
CREATE TABLE "Battle" (
    "id" TEXT NOT NULL,
    "players" TEXT[],
    "cells" "CellValue"[],
    "status" "Status" NOT NULL,
    "Winner" TEXT,
    "lastMoveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Battle_pkey" PRIMARY KEY ("id")
);
