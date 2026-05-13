CREATE TYPE "RankingTieBreakRule" AS ENUM ('alphabetical', 'most_wins', 'most_podiums');

CREATE TABLE "ranking_settings" (
  "id" TEXT NOT NULL,
  "tie_break_rule" "RankingTieBreakRule" NOT NULL DEFAULT 'most_wins',
  "updated_by" TEXT NOT NULL,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ranking_settings_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ranking_settings_updated_by_idx"
ON "ranking_settings"("updated_by");

ALTER TABLE "ranking_settings"
ADD CONSTRAINT "ranking_settings_updated_by_fkey"
FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
