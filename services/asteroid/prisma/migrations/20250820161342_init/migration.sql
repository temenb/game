/*
  Warnings:

  - The values [HIGHT] on the enum `ResourceAmount` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."ResourceAmount_new" AS ENUM ('UNKNOWN', 'LOW', 'NORMAL', 'HEIGHT');
ALTER TABLE "public"."Asteroid" ALTER COLUMN "resource_amount" DROP DEFAULT;
ALTER TABLE "public"."Asteroid" ALTER COLUMN "resource_amount" TYPE "public"."ResourceAmount_new" USING ("resource_amount"::text::"public"."ResourceAmount_new");
ALTER TYPE "public"."ResourceAmount" RENAME TO "ResourceAmount_old";
ALTER TYPE "public"."ResourceAmount_new" RENAME TO "ResourceAmount";
DROP TYPE "public"."ResourceAmount_old";
ALTER TABLE "public"."Asteroid" ALTER COLUMN "resource_amount" SET DEFAULT 'UNKNOWN';
COMMIT;
