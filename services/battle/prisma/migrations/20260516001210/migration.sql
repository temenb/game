/*
  Warnings:

  - Changed the type of `status` on the `Battle` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BattleStatus" AS ENUM ('Active', 'Finished');

-- AlterTable
ALTER TABLE "Battle" DROP COLUMN "status",
ADD COLUMN     "status" "BattleStatus" NOT NULL;

-- DropEnum
DROP TYPE "Status";
