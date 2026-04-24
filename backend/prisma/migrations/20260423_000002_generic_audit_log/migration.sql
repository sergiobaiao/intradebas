CREATE TABLE "audit_log" (
    "id" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "entity_label" TEXT,
    "action" TEXT NOT NULL,
    "field_changed" TEXT,
    "old_value" TEXT,
    "new_value" TEXT,
    "changed_by" TEXT NOT NULL,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "audit_log_changed_at_idx" ON "audit_log"("changed_at");
CREATE INDEX "audit_log_entity_type_changed_at_idx" ON "audit_log"("entity_type", "changed_at");
CREATE INDEX "audit_log_entity_type_entity_id_changed_at_idx" ON "audit_log"("entity_type", "entity_id", "changed_at");
CREATE INDEX "audit_log_changed_by_changed_at_idx" ON "audit_log"("changed_by", "changed_at");

ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
