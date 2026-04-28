CREATE TYPE "AthletePortalTokenPurpose" AS ENUM ('email_confirmation', 'portal_access');

ALTER TABLE "athletes"
ADD COLUMN "email_verified_at" TIMESTAMP(3);

CREATE TABLE "athlete_portal_tokens" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "athlete_id" TEXT NOT NULL,
  "token_hash" TEXT NOT NULL,
  "purpose" "AthletePortalTokenPurpose" NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "last_accessed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "athlete_portal_tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "athlete_portal_tokens_token_hash_key"
ON "athlete_portal_tokens"("token_hash");

CREATE INDEX "athlete_portal_tokens_athlete_id_purpose_expires_at_idx"
ON "athlete_portal_tokens"("athlete_id", "purpose", "expires_at");

CREATE INDEX "athlete_portal_tokens_expires_at_last_accessed_at_idx"
ON "athlete_portal_tokens"("expires_at", "last_accessed_at");

ALTER TABLE "athlete_portal_tokens"
ADD CONSTRAINT "athlete_portal_tokens_athlete_id_fkey"
FOREIGN KEY ("athlete_id") REFERENCES "athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
