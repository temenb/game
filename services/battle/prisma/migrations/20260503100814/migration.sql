-- CreateEnum
CREATE TYPE "CellValue" AS ENUM ('X', 'O', 'EMPTY');

-- CreateTable
CREATE TABLE "Battle" (
    "id" TEXT NOT NULL,
    "cells" JSONB NOT NULL,

    CONSTRAINT "Battle_pkey" PRIMARY KEY ("id")
);
