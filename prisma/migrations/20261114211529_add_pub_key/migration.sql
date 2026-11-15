/*
  Warnings:

  - Added the required column `type` to the `EnvironmentKey` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EnvironmentKeyType" AS ENUM ('PUBLISHABLE', 'SECRET');

-- AlterTable
ALTER TABLE "EnvironmentKey" ADD COLUMN     "type" "EnvironmentKeyType" NOT NULL;

-- AlterTable
ALTER TABLE "FeatureFlag" ADD COLUMN     "publicAccess" BOOLEAN NOT NULL DEFAULT false;

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
