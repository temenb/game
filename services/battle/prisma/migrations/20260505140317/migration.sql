-- CreateEnum
CREATE TYPE "CellValue" AS ENUM ('X', 'O', 'EMPTY');

-- CreateTable
CREATE TABLE "Battle" (
    "id" TEXT NOT NULL,
    "cells" "CellValue"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Battle_pkey" PRIMARY KEY ("id")
);
