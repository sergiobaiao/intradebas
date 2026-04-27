CREATE TABLE "sponsor_portal_tokens" (
    "id" TEXT NOT NULL,
    "sponsor_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "last_accessed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sponsor_portal_tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "sponsor_portal_tokens_token_hash_key" ON "sponsor_portal_tokens"("token_hash");
CREATE INDEX "sponsor_portal_tokens_sponsor_id_expires_at_idx" ON "sponsor_portal_tokens"("sponsor_id", "expires_at");
CREATE INDEX "sponsor_portal_tokens_expires_at_last_accessed_at_idx" ON "sponsor_portal_tokens"("expires_at", "last_accessed_at");

ALTER TABLE "sponsor_portal_tokens" ADD CONSTRAINT "sponsor_portal_tokens_sponsor_id_fkey" FOREIGN KEY ("sponsor_id") REFERENCES "sponsors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
