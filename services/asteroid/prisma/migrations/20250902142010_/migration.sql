-- CreateEnum
CREATE TYPE "public"."PortalType" AS ENUM ('INACTIVE', 'OUTBOUND', 'INBOUND', 'BIDIRECTIONAL');

-- CreateTable
CREATE TABLE "public"."Portal" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT,
    "galaxyFrom" TEXT NOT NULL,
    "galaxyTo" TEXT NOT NULL,
    "type" "public"."PortalType" NOT NULL DEFAULT 'INACTIVE',
    "asteroidGrade" "public"."AsteroidGrade" NOT NULL,
    "axisX" INTEGER NOT NULL,
    "axisY" INTEGER NOT NULL,
    "health" INTEGER NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Portal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Portal_galaxyFrom_idx" ON "public"."Portal"("galaxyFrom");

-- CreateIndex
CREATE INDEX "Portal_galaxyTo_idx" ON "public"."Portal"("galaxyTo");

-- CreateIndex
CREATE INDEX "Portal_ownerId_idx" ON "public"."Portal"("ownerId");

-- CreateIndex
CREATE INDEX "Portal_axisX_axisY_idx" ON "public"."Portal"("axisX", "axisY");
