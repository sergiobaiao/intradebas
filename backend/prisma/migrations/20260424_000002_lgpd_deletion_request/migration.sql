CREATE TYPE "LgpdRequestStatus" AS ENUM ('pending', 'in_review', 'resolved', 'rejected');

CREATE TABLE "lgpd_deletion_request" (
    "id" TEXT NOT NULL,
    "athlete_id" TEXT,
    "athlete_cpf" TEXT NOT NULL,
    "requester_name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "reason" TEXT,
    "status" "LgpdRequestStatus" NOT NULL DEFAULT 'pending',
    "admin_notes" TEXT,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMP(3),

    CONSTRAINT "lgpd_deletion_request_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "lgpd_deletion_request_athlete_cpf_requested_at_idx" ON "lgpd_deletion_request"("athlete_cpf", "requested_at");
CREATE INDEX "lgpd_deletion_request_status_requested_at_idx" ON "lgpd_deletion_request"("status", "requested_at");
CREATE INDEX "lgpd_deletion_request_reviewed_by_reviewed_at_idx" ON "lgpd_deletion_request"("reviewed_by", "reviewed_at");

ALTER TABLE "lgpd_deletion_request" ADD CONSTRAINT "lgpd_deletion_request_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "athletes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "lgpd_deletion_request" ADD CONSTRAINT "lgpd_deletion_request_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
