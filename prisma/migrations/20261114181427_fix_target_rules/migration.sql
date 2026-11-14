/*
  Warnings:

  - You are about to drop the column `flagId` on the `TargetingRule` table. All the data in the column will be lost.
  - You are about to drop the `ProjectKey` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `flagEnvironmentId` to the `TargetingRule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProjectKey" DROP CONSTRAINT "ProjectKey_environmentId_fkey";

-- DropForeignKey
ALTER TABLE "TargetingRule" DROP CONSTRAINT "TargetingRule_flagId_fkey";

-- DropIndex
DROP INDEX "TargetingRule_flagId_priority_idx";

-- AlterTable
ALTER TABLE "TargetingRule" DROP COLUMN "flagId",
ADD COLUMN     "flagEnvironmentId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "account" ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();

-- AlterTable
ALTER TABLE "invitation" ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();

-- AlterTable
ALTER TABLE "member" ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();

-- AlterTable
ALTER TABLE "organization" ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();

-- AlterTable
ALTER TABLE "session" ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();

-- AlterTable
ALTER TABLE "verification" ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();

-- DropTable
DROP TABLE "ProjectKey";

-- CreateTable
CREATE TABLE "EnvironmentKey" (
    "id" UUID NOT NULL,
    "environmentId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "keyPrefix" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "EnvironmentKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EnvironmentKey_keyHash_key" ON "EnvironmentKey"("keyHash");

-- CreateIndex
CREATE INDEX "EnvironmentKey_environmentId_idx" ON "EnvironmentKey"("environmentId");

-- CreateIndex
CREATE INDEX "TargetingRule_flagEnvironmentId_priority_idx" ON "TargetingRule"("flagEnvironmentId", "priority");

-- AddForeignKey
ALTER TABLE "EnvironmentKey" ADD CONSTRAINT "EnvironmentKey_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TargetingRule" ADD CONSTRAINT "TargetingRule_flagEnvironmentId_fkey" FOREIGN KEY ("flagEnvironmentId") REFERENCES "FlagEnvironment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
