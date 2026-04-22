-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('superadmin', 'admin');

-- CreateEnum
CREATE TYPE "AthleteType" AS ENUM ('titular', 'familiar', 'convidado');

-- CreateEnum
CREATE TYPE "AthleteStatus" AS ENUM ('pending', 'active', 'rejected');

-- CreateEnum
CREATE TYPE "ShirtSize" AS ENUM ('PP', 'P', 'M', 'G', 'GG', 'XGG');

-- CreateEnum
CREATE TYPE "SportCategory" AS ENUM ('coletiva', 'individual', 'dupla', 'fitness');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('registered', 'confirmed', 'disqualified');

-- CreateEnum
CREATE TYPE "SponsorStatus" AS ENUM ('pending', 'active', 'inactive');

-- CreateEnum
CREATE TYPE "CouponStatus" AS ENUM ('active', 'used', 'expired');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('photo', 'video');

-- CreateEnum
CREATE TYPE "MediaProvider" AS ENUM ('local', 'youtube', 'vimeo');

-- CreateEnum
CREATE TYPE "SponsorshipLevel" AS ENUM ('bronze', 'prata', 'ouro');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "mascot_image" TEXT,
    "total_score" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "athletes" (
    "id" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "unit" TEXT,
    "type" "AthleteType" NOT NULL,
    "titular_id" TEXT,
    "team_id" TEXT NOT NULL,
    "shirt_size" "ShirtSize" NOT NULL,
    "status" "AthleteStatus" NOT NULL DEFAULT 'pending',
    "lgpd_consent" BOOLEAN NOT NULL DEFAULT false,
    "lgpd_consent_at" TIMESTAMP(3),
    "lgpd_consent_ip" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "athletes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sports" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "SportCategory" NOT NULL,
    "description" TEXT,
    "min_participants" INTEGER NOT NULL DEFAULT 1,
    "max_participants" INTEGER,
    "is_aldebarun" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "schedule_date" TIMESTAMP(3),
    "schedule_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registrations" (
    "id" TEXT NOT NULL,
    "athlete_id" TEXT NOT NULL,
    "sport_id" TEXT NOT NULL,
    "partner_id" TEXT,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'registered',
    "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "results" (
    "id" TEXT NOT NULL,
    "sport_id" TEXT NOT NULL,
    "athlete_id" TEXT,
    "team_id" TEXT,
    "position" INTEGER,
    "raw_score" DECIMAL(10,3),
    "calculated_points" INTEGER,
    "result_date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "recorded_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "result_audit_log" (
    "id" TEXT NOT NULL,
    "result_id" TEXT NOT NULL,
    "changed_by" TEXT NOT NULL,
    "field_changed" TEXT NOT NULL,
    "old_value" TEXT,
    "new_value" TEXT,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "result_audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scoring_config" (
    "id" TEXT NOT NULL,
    "category" "SportCategory" NOT NULL,
    "position" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "updated_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scoring_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsorship_quotas" (
    "id" TEXT NOT NULL,
    "level" "SponsorshipLevel" NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "max_slots" INTEGER NOT NULL,
    "used_slots" INTEGER NOT NULL DEFAULT 0,
    "courtesy_count" INTEGER NOT NULL,
    "benefits" TEXT,
    "backdrop_priority" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sponsorship_quotas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsors" (
    "id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "contact_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "quota_id" TEXT NOT NULL,
    "logo_url" TEXT,
    "status" "SponsorStatus" NOT NULL DEFAULT 'pending',
    "payment_date" TIMESTAMP(3),
    "payment_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sponsors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "sponsor_id" TEXT NOT NULL,
    "status" "CouponStatus" NOT NULL DEFAULT 'active',
    "redeemed_by" TEXT,
    "redeemed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "title" TEXT,
    "url" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "provider" "MediaProvider" NOT NULL DEFAULT 'local',
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "uploaded_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lgpd_consent_log" (
    "id" TEXT NOT NULL,
    "athlete_cpf" TEXT NOT NULL,
    "athlete_name" TEXT,
    "consented_at" TIMESTAMP(3) NOT NULL,
    "ip_address" TEXT NOT NULL,
    "user_agent" TEXT,
    "policy_version" TEXT NOT NULL DEFAULT 'v1.0',

    CONSTRAINT "lgpd_consent_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "teams_name_key" ON "teams"("name");

-- CreateIndex
CREATE INDEX "teams_total_score_name_idx" ON "teams"("total_score", "name");

-- CreateIndex
CREATE UNIQUE INDEX "athletes_cpf_key" ON "athletes"("cpf");

-- CreateIndex
CREATE INDEX "athletes_team_id_status_created_at_idx" ON "athletes"("team_id", "status", "created_at");

-- CreateIndex
CREATE INDEX "athletes_status_created_at_idx" ON "athletes"("status", "created_at");

-- CreateIndex
CREATE INDEX "athletes_titular_id_idx" ON "athletes"("titular_id");

-- CreateIndex
CREATE INDEX "sports_is_active_schedule_date_idx" ON "sports"("is_active", "schedule_date");

-- CreateIndex
CREATE INDEX "sports_category_name_idx" ON "sports"("category", "name");

-- CreateIndex
CREATE INDEX "registrations_sport_id_status_idx" ON "registrations"("sport_id", "status");

-- CreateIndex
CREATE INDEX "registrations_partner_id_idx" ON "registrations"("partner_id");

-- CreateIndex
CREATE UNIQUE INDEX "registrations_athlete_id_sport_id_key" ON "registrations"("athlete_id", "sport_id");

-- CreateIndex
CREATE INDEX "results_result_date_created_at_idx" ON "results"("result_date", "created_at");

-- CreateIndex
CREATE INDEX "results_team_id_result_date_idx" ON "results"("team_id", "result_date");

-- CreateIndex
CREATE INDEX "results_sport_id_result_date_idx" ON "results"("sport_id", "result_date");

-- CreateIndex
CREATE INDEX "results_team_id_sport_id_idx" ON "results"("team_id", "sport_id");

-- CreateIndex
CREATE INDEX "results_recorded_by_idx" ON "results"("recorded_by");

-- CreateIndex
CREATE INDEX "result_audit_log_changed_at_idx" ON "result_audit_log"("changed_at");

-- CreateIndex
CREATE INDEX "result_audit_log_result_id_changed_at_idx" ON "result_audit_log"("result_id", "changed_at");

-- CreateIndex
CREATE INDEX "result_audit_log_changed_by_changed_at_idx" ON "result_audit_log"("changed_by", "changed_at");

-- CreateIndex
CREATE INDEX "scoring_config_updated_by_idx" ON "scoring_config"("updated_by");

-- CreateIndex
CREATE UNIQUE INDEX "scoring_config_category_position_key" ON "scoring_config"("category", "position");

-- CreateIndex
CREATE UNIQUE INDEX "sponsorship_quotas_level_key" ON "sponsorship_quotas"("level");

-- CreateIndex
CREATE INDEX "sponsorship_quotas_backdrop_priority_idx" ON "sponsorship_quotas"("backdrop_priority");

-- CreateIndex
CREATE INDEX "sponsors_quota_id_status_idx" ON "sponsors"("quota_id", "status");

-- CreateIndex
CREATE INDEX "sponsors_status_created_at_idx" ON "sponsors"("status", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_code_key" ON "coupons"("code");

-- CreateIndex
CREATE INDEX "coupons_sponsor_id_status_created_at_idx" ON "coupons"("sponsor_id", "status", "created_at");

-- CreateIndex
CREATE INDEX "coupons_redeemed_by_idx" ON "coupons"("redeemed_by");

-- CreateIndex
CREATE INDEX "coupons_status_redeemed_at_idx" ON "coupons"("status", "redeemed_at");

-- CreateIndex
CREATE INDEX "media_is_featured_sort_order_created_at_idx" ON "media"("is_featured", "sort_order", "created_at");

-- CreateIndex
CREATE INDEX "media_uploaded_by_created_at_idx" ON "media"("uploaded_by", "created_at");

-- CreateIndex
CREATE INDEX "lgpd_consent_log_athlete_cpf_consented_at_idx" ON "lgpd_consent_log"("athlete_cpf", "consented_at");

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_titular_id_fkey" FOREIGN KEY ("titular_id") REFERENCES "athletes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "sports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "athletes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "sports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "athletes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_recorded_by_fkey" FOREIGN KEY ("recorded_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result_audit_log" ADD CONSTRAINT "result_audit_log_result_id_fkey" FOREIGN KEY ("result_id") REFERENCES "results"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result_audit_log" ADD CONSTRAINT "result_audit_log_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scoring_config" ADD CONSTRAINT "scoring_config_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_quota_id_fkey" FOREIGN KEY ("quota_id") REFERENCES "sponsorship_quotas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_sponsor_id_fkey" FOREIGN KEY ("sponsor_id") REFERENCES "sponsors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_redeemed_by_fkey" FOREIGN KEY ("redeemed_by") REFERENCES "athletes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

