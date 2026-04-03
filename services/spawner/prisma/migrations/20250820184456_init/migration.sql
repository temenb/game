/*
  Warnings:

  - You are about to drop the column `spawn_grade` on the `Spawn` table. All the data in the column will be lost.
  - You are about to drop the column `spawn_type` on the `Spawn` table. All the data in the column will be lost.
  - You are about to drop the column `galaxy_id` on the `Spawn` table. All the data in the column will be lost.
  - You are about to drop the column `owner_id` on the `Spawn` table. All the data in the column will be lost.
  - You are about to drop the column `owner_type` on the `Spawn` table. All the data in the column will be lost.
  - You are about to drop the column `resource_amount` on the `Spawn` table. All the data in the column will be lost.
  - You are about to drop the column `resource_type` on the `Spawn` table. All the data in the column will be lost.
  - Added the required column `spawnGrade` to the `Spawn` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spawnType` to the `Spawn` table without a default value. This is not possible if the table is not empty.
  - Added the required column `galaxyId` to the `Spawn` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Spawn_galaxy_id_idx";

-- DropIndex
DROP INDEX "public"."Spawn_owner_id_idx";

-- AlterTable
ALTER TABLE "public"."Spawn" DROP COLUMN "spawn_grade",
DROP COLUMN "spawn_type",
DROP COLUMN "galaxy_id",
DROP COLUMN "owner_id",
DROP COLUMN "owner_type",
DROP COLUMN "resource_amount",
DROP COLUMN "resource_type",
ADD COLUMN     "spawnGrade" "public"."SpawnGrade" NOT NULL,
ADD COLUMN     "spawnType" "public"."SpawnType" NOT NULL,
ADD COLUMN     "galaxyId" TEXT NOT NULL,
ADD COLUMN     "ownerId" TEXT,
ADD COLUMN     "ownerType" "public"."OwnerType" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "resourceAmount" "public"."ResourceAmount" NOT NULL DEFAULT 'UNKNOWN',
ADD COLUMN     "resourceType" "public"."ResourceType" NOT NULL DEFAULT 'UNKNOWN';

-- CreateIndex
CREATE INDEX "Spawn_galaxyId_idx" ON "public"."Spawn"("galaxyId");

-- CreateIndex
CREATE INDEX "Spawn_ownerId_idx" ON "public"."Spawn"("ownerId");
