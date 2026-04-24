import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLgpdDeletionRequestDto } from './dto/create-lgpd-deletion-request.dto';
import { UpdateLgpdDeletionRequestDto } from './dto/update-lgpd-deletion-request.dto';

const lgpdRequestStatuses = ['pending', 'in_review', 'resolved', 'rejected'] as const;
type LgpdRequestStatusValue = (typeof lgpdRequestStatuses)[number];

type RawLgpdDeletionRequestRow = {
  id: string;
  athleteId: string | null;
  athleteCpf: string;
  requesterName: string;
  email: string | null;
  phone: string | null;
  reason: string | null;
  status: LgpdRequestStatusValue;
  adminNotes: string | null;
  requestedAt: Date;
  updatedAt: Date;
  reviewedBy: string | null;
  reviewedAt: Date | null;
};

@Injectable()
export class LgpdService {
  constructor(private readonly prisma: PrismaService) {}

  async createDeletionRequest(dto: CreateLgpdDeletionRequestDto) {
    const existing = await this.prisma.$queryRaw<Array<{ id: string }>>(Prisma.sql`
      SELECT id
      FROM "lgpd_deletion_request"
      WHERE "athlete_cpf" = ${dto.athleteCpf}
        AND "status" IN ('pending', 'in_review')
      LIMIT 1
    `);

    if (existing.length > 0) {
      throw new BadRequestException('Ja existe uma solicitacao LGPD em andamento para este CPF');
    }

    const athlete = await this.prisma.athlete.findUnique({
      where: {
        cpf: dto.athleteCpf,
      },
      select: {
        id: true,
      },
    });

    const rows = await this.prisma.$queryRaw<RawLgpdDeletionRequestRow[]>(Prisma.sql`
      INSERT INTO "lgpd_deletion_request" (
        "id",
        "athlete_id",
        "athlete_cpf",
        "requester_name",
        "email",
        "phone",
        "reason",
        "status",
        "requested_at",
        "updated_at"
      )
      VALUES (
        gen_random_uuid()::text,
        ${athlete?.id ?? null},
        ${dto.athleteCpf},
        ${dto.requesterName},
        ${dto.email ?? null},
        ${dto.phone ?? null},
        ${dto.reason ?? null},
        'pending',
        NOW(),
        NOW()
      )
      RETURNING
        "id",
        "athlete_id" AS "athleteId",
        "athlete_cpf" AS "athleteCpf",
        "requester_name" AS "requesterName",
        "email",
        "phone",
        "reason",
        "status",
        "admin_notes" AS "adminNotes",
        "requested_at" AS "requestedAt",
        "updated_at" AS "updatedAt",
        "reviewed_by" AS "reviewedBy",
        "reviewed_at" AS "reviewedAt"
    `);

    return (await this.hydrateRows(rows))[0];
  }

  async listDeletionRequests(status?: string) {
    const normalizedStatus = this.normalizeStatus(status);
    const rows = await this.prisma.$queryRaw<RawLgpdDeletionRequestRow[]>(Prisma.sql`
      SELECT
        "id",
        "athlete_id" AS "athleteId",
        "athlete_cpf" AS "athleteCpf",
        "requester_name" AS "requesterName",
        "email",
        "phone",
        "reason",
        "status",
        "admin_notes" AS "adminNotes",
        "requested_at" AS "requestedAt",
        "updated_at" AS "updatedAt",
        "reviewed_by" AS "reviewedBy",
        "reviewed_at" AS "reviewedAt"
      FROM "lgpd_deletion_request"
      ${normalizedStatus ? Prisma.sql`WHERE "status" = ${normalizedStatus}` : Prisma.empty}
      ORDER BY "requested_at" DESC
    `);

    return this.hydrateRows(rows);
  }

  async updateDeletionRequest(id: string, dto: UpdateLgpdDeletionRequestDto, changedBy: string) {
    const existing = (await this.listDeletionRequests()).find((row) => row.id === id);

    if (!existing) {
      throw new NotFoundException('Solicitacao LGPD nao encontrada');
    }

    const nextStatus = this.normalizeStatus(dto.status) ?? existing.status;
    const nextNotes = dto.adminNotes ?? existing.adminNotes;
    const reviewed = nextStatus !== 'pending';

    const rows = await this.prisma.$queryRaw<RawLgpdDeletionRequestRow[]>(Prisma.sql`
      UPDATE "lgpd_deletion_request"
      SET
        "status" = ${nextStatus},
        "admin_notes" = ${nextNotes ?? null},
        "reviewed_by" = ${reviewed ? changedBy : null},
        "reviewed_at" = ${reviewed ? new Date() : null},
        "updated_at" = NOW()
      WHERE "id" = ${id}
      RETURNING
        "id",
        "athlete_id" AS "athleteId",
        "athlete_cpf" AS "athleteCpf",
        "requester_name" AS "requesterName",
        "email",
        "phone",
        "reason",
        "status",
        "admin_notes" AS "adminNotes",
        "requested_at" AS "requestedAt",
        "updated_at" AS "updatedAt",
        "reviewed_by" AS "reviewedBy",
        "reviewed_at" AS "reviewedAt"
    `);

    const updated = (await this.hydrateRows(rows))[0];
    const auditRows: Prisma.AuditLogCreateManyInput[] = [];

    if (existing.status !== updated.status) {
      auditRows.push({
        entityType: 'lgpd_request',
        entityId: updated.id,
        entityLabel: `${updated.requesterName} · ${updated.athleteCpf}`,
        action: 'update',
        fieldChanged: 'status',
        oldValue: existing.status,
        newValue: updated.status,
        changedBy,
      });
    }

    if ((existing.adminNotes ?? '') !== (updated.adminNotes ?? '')) {
      auditRows.push({
        entityType: 'lgpd_request',
        entityId: updated.id,
        entityLabel: `${updated.requesterName} · ${updated.athleteCpf}`,
        action: 'update',
        fieldChanged: 'adminNotes',
        oldValue: existing.adminNotes ?? null,
        newValue: updated.adminNotes ?? null,
        changedBy,
      });
    }

    if (auditRows.length > 0) {
      await this.prisma.auditLog.createMany({
        data: auditRows,
      });
    }

    return updated;
  }

  private normalizeStatus(status?: string): LgpdRequestStatusValue | undefined {
    if (!status) {
      return undefined;
    }

    if (!lgpdRequestStatuses.includes(status as LgpdRequestStatusValue)) {
      throw new BadRequestException('Status LGPD invalido');
    }

    return status as LgpdRequestStatusValue;
  }

  private async hydrateRows(rows: RawLgpdDeletionRequestRow[]) {
    const athleteIds = [...new Set(rows.map((row) => row.athleteId).filter(Boolean))] as string[];
    const reviewerIds = [...new Set(rows.map((row) => row.reviewedBy).filter(Boolean))] as string[];

    const [athletes, reviewers] = await Promise.all([
      athleteIds.length > 0
        ? this.prisma.athlete.findMany({
            where: {
              id: {
                in: athleteIds,
              },
            },
            select: {
              id: true,
              name: true,
              status: true,
              team: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          })
        : Promise.resolve([]),
      reviewerIds.length > 0
        ? this.prisma.user.findMany({
            where: {
              id: {
                in: reviewerIds,
              },
            },
            select: {
              id: true,
              name: true,
              email: true,
            },
          })
        : Promise.resolve([]),
    ]);

    const athleteMap = new Map(athletes.map((athlete) => [athlete.id, athlete]));
    const reviewerMap = new Map(reviewers.map((reviewer) => [reviewer.id, reviewer]));

    return rows.map((row) => ({
      id: row.id,
      athleteCpf: row.athleteCpf,
      requesterName: row.requesterName,
      email: row.email,
      phone: row.phone,
      reason: row.reason,
      status: row.status,
      adminNotes: row.adminNotes,
      requestedAt: row.requestedAt,
      updatedAt: row.updatedAt,
      reviewedAt: row.reviewedAt,
      athlete: row.athleteId ? athleteMap.get(row.athleteId) ?? null : null,
      reviewer: row.reviewedBy ? reviewerMap.get(row.reviewedBy) ?? null : null,
    }));
  }
}
