/*
  Warnings:

  - You are about to alter the column `key` on the `EnvironmentKey` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the column `publicAccess` on the `FeatureFlag` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EnvironmentKey" ALTER COLUMN "key" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "FeatureFlag" DROP COLUMN "publicAccess";

-- AlterTable
ALTER TABLE "FlagEnvironment" ADD COLUMN     "publicAccess" BOOLEAN NOT NULL DEFAULT false;

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
