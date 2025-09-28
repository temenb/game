/*
  Warnings:

  - You are about to drop the column `asteroid_grade` on the `Asteroid` table. All the data in the column will be lost.
  - You are about to drop the column `asteroid_type` on the `Asteroid` table. All the data in the column will be lost.
  - You are about to drop the column `galaxy_id` on the `Asteroid` table. All the data in the column will be lost.
  - You are about to drop the column `owner_id` on the `Asteroid` table. All the data in the column will be lost.
  - You are about to drop the column `owner_type` on the `Asteroid` table. All the data in the column will be lost.
  - You are about to drop the column `resource_amount` on the `Asteroid` table. All the data in the column will be lost.
  - You are about to drop the column `resource_type` on the `Asteroid` table. All the data in the column will be lost.
  - Added the required column `asteroidGrade` to the `Asteroid` table without a default value. This is not possible if the table is not empty.
  - Added the required column `asteroidType` to the `Asteroid` table without a default value. This is not possible if the table is not empty.
  - Added the required column `galaxyId` to the `Asteroid` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Asteroid_galaxy_id_idx";

-- DropIndex
DROP INDEX "public"."Asteroid_owner_id_idx";

-- AlterTable
ALTER TABLE "public"."Asteroid" DROP COLUMN "asteroid_grade",
DROP COLUMN "asteroid_type",
DROP COLUMN "galaxy_id",
DROP COLUMN "owner_id",
DROP COLUMN "owner_type",
DROP COLUMN "resource_amount",
DROP COLUMN "resource_type",
ADD COLUMN     "asteroidGrade" "public"."AsteroidGrade" NOT NULL,
ADD COLUMN     "asteroidType" "public"."AsteroidType" NOT NULL,
ADD COLUMN     "galaxyId" TEXT NOT NULL,
ADD COLUMN     "ownerId" TEXT,
ADD COLUMN     "ownerType" "public"."OwnerType" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "resourceAmount" "public"."ResourceAmount" NOT NULL DEFAULT 'UNKNOWN',
ADD COLUMN     "resourceType" "public"."ResourceType" NOT NULL DEFAULT 'UNKNOWN';

-- CreateIndex
CREATE INDEX "Asteroid_galaxyId_idx" ON "public"."Asteroid"("galaxyId");

-- CreateIndex
CREATE INDEX "Asteroid_ownerId_idx" ON "public"."Asteroid"("ownerId");
