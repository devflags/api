CREATE UNIQUE INDEX "unique_publishable_key_per_environment"
ON "EnvironmentKey" ("environmentId")
WHERE "type" = 'PUBLISHABLE' AND "revokedAt" IS NULL;