/*
  Warnings:

  - The `cells` column on the `Battle` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BattleCellValue" AS ENUM ('X', 'O', 'EMPTY');

-- AlterTable
ALTER TABLE "Battle" DROP COLUMN "cells",
ADD COLUMN     "cells" "BattleCellValue"[];

-- DropEnum
DROP TYPE "CellValue";
