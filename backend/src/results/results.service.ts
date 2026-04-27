import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { from, interval, map, Observable, startWith, switchMap } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';

@Injectable()
export class ResultsService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizePage(value?: string) {
    const parsed = Number(value ?? 1);
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
  }

  private normalizePageSize(value?: string) {
    const parsed = Number(value ?? 12);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return 12;
    }

    return Math.min(Math.floor(parsed), 50);
  }

  async listResults() {
    return this.prisma.result.findMany({
      select: {
        id: true,
        position: true,
        rawScore: true,
        calculatedPoints: true,
        resultDate: true,
        notes: true,
        sport: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
            color: true,
            totalScore: true,
          },
        },
      },
      orderBy: [{ resultDate: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async listAldebarunResults() {
    return this.prisma.result.findMany({
      where: {
        sport: {
          isAldebarun: true,
          isActive: true,
        },
      },
      select: {
        id: true,
        position: true,
        rawScore: true,
        calculatedPoints: true,
        resultDate: true,
        notes: true,
        sport: {
          select: {
            id: true,
            name: true,
            category: true,
            description: true,
            scheduleDate: true,
            scheduleNotes: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
            color: true,
            totalScore: true,
          },
        },
      },
      orderBy: [
        { sport: { name: 'asc' } },
        { position: 'asc' },
        { rawScore: 'asc' },
        { resultDate: 'desc' },
      ],
    });
  }

  async listAdminResults(query: {
    page?: string;
    pageSize?: string;
    teamId?: string;
    sportId?: string;
  }) {
    const page = this.normalizePage(query.page);
    const pageSize = this.normalizePageSize(query.pageSize);
    const where: Prisma.ResultWhereInput = {
      ...(query.teamId ? { teamId: query.teamId } : {}),
      ...(query.sportId ? { sportId: query.sportId } : {}),
    };

    const [total, items] = await Promise.all([
      this.prisma.result.count({ where }),
      this.prisma.result.findMany({
        where,
        select: {
          id: true,
          position: true,
          rawScore: true,
          calculatedPoints: true,
          resultDate: true,
          notes: true,
          sport: {
            select: {
              id: true,
              name: true,
              category: true,
            },
          },
          team: {
            select: {
              id: true,
              name: true,
              color: true,
              totalScore: true,
            },
          },
        },
        orderBy: [{ resultDate: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.max(Math.ceil(total / pageSize), 1),
    };
  }

  async listAuditLogs() {
    return this.prisma.resultAuditLog.findMany({
      include: {
        changer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        result: {
          select: {
            id: true,
            sport: {
              select: {
                id: true,
                name: true,
              },
            },
            team: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        changedAt: 'desc',
      },
      take: 20,
    });
  }

  async getRanking() {
    const [aggregated, teams] = await Promise.all([
      this.prisma.result.groupBy({
        by: ['teamId'],
        _sum: {
          calculatedPoints: true,
        },
        where: {
          teamId: {
            not: null,
          },
        },
      }),
      this.prisma.team.findMany({
        select: {
          id: true,
          name: true,
          color: true,
        },
        orderBy: {
          name: 'asc',
        },
      }),
    ]);

    const totalsByTeam = new Map(
      aggregated
        .filter((row) => row.teamId)
        .map((row) => [row.teamId as string, row._sum.calculatedPoints ?? 0]),
    );

    return teams
      .map((team) => ({
        id: team.id,
        name: team.name,
        color: team.color,
        totalScore: totalsByTeam.get(team.id) ?? 0,
      }))
      .sort((left: RankingRow, right: RankingRow) => {
        if (right.totalScore !== left.totalScore) {
          return right.totalScore - left.totalScore;
        }

        return left.name.localeCompare(right.name);
      });
  }

  streamRanking(intervalMs = 5000): Observable<{ data: RankingRow[] }> {
    return interval(intervalMs).pipe(
      startWith(0),
      switchMap(() => from(this.getRanking())),
      map((data) => ({ data })),
    );
  }

  async createResult(dto: CreateResultDto, recordedBy: string) {
    const scoring = await this.resolveScoring(this.prisma, dto.sportId, dto.teamId, dto.position);

    const result = await this.prisma.result.create({
      data: {
        sportId: dto.sportId,
        teamId: dto.teamId,
        position: dto.position,
        rawScore: dto.rawScore,
        calculatedPoints: scoring?.points ?? 0,
        resultDate: new Date(dto.resultDate),
        notes: dto.notes,
        recordedBy,
      },
      include: {
        sport: true,
        team: true,
      },
    });

    return result;
  }

  async createBulkResults(items: CreateResultDto[], recordedBy: string) {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const created: ResultWithRelations[] = [];

      for (const item of items) {
        const scoring = await this.resolveScoring(tx, item.sportId, item.teamId, item.position);
        const result = await tx.result.create({
          data: {
            sportId: item.sportId,
            teamId: item.teamId,
            position: item.position,
            rawScore: item.rawScore,
            calculatedPoints: scoring?.points ?? 0,
            resultDate: new Date(item.resultDate),
            notes: item.notes,
            recordedBy,
          },
          include: {
            sport: true,
            team: true,
          },
        });

        created.push(result as ResultWithRelations);
      }

      return created;
    });
  }

  async updateResult(id: string, dto: UpdateResultDto, recordedBy: string) {
    const existing = await this.prisma.result.findUnique({
      where: { id },
      select: {
        id: true,
        sportId: true,
        teamId: true,
        position: true,
        rawScore: true,
        resultDate: true,
        notes: true,
      },
    });

    if (!existing) {
      throw new NotFoundException('Resultado nao encontrado');
    }

    const sportId = dto.sportId ?? existing.sportId;
    const teamId = dto.teamId ?? existing.teamId;
    const position = dto.position ?? existing.position;

    if (!teamId) {
      throw new BadRequestException('Equipe invalida');
    }

    if (!position) {
      throw new BadRequestException('Posicao invalida');
    }

    const scoring = await this.resolveScoring(this.prisma, sportId, teamId, position);

    const nextResultDate = dto.resultDate ? new Date(dto.resultDate) : existing.resultDate;
    const nextRawScore = dto.rawScore ?? existing.rawScore;
    const nextNotes = dto.notes ?? existing.notes;
    const changedFields = this.collectAuditChanges(existing, {
      sportId,
      teamId,
      position,
      rawScore: nextRawScore,
      resultDate: nextResultDate,
      notes: nextNotes,
    });

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updated = await tx.result.update({
        where: { id },
        data: {
          sportId,
          teamId,
          position,
          rawScore: dto.rawScore,
          calculatedPoints: scoring?.points ?? 0,
          resultDate: dto.resultDate ? new Date(dto.resultDate) : undefined,
          notes: dto.notes,
          recordedBy,
        },
        include: {
          sport: true,
          team: true,
        },
      });

      if (changedFields.length > 0) {
        await tx.resultAuditLog.createMany({
          data: changedFields.map((change) => ({
            resultId: id,
            changedBy: recordedBy,
            fieldChanged: change.fieldChanged,
            oldValue: change.oldValue,
            newValue: change.newValue,
          })),
        });
      }

      return updated;
    });
  }

  private async resolveScoring(
    client: Pick<Prisma.TransactionClient, 'sport' | 'team' | 'scoringConfig'>,
    sportId: string,
    teamId: string,
    position: number,
  ) {
    const sport = await client.sport.findUnique({
      where: { id: sportId },
      select: {
        id: true,
        category: true,
      },
    });

    if (!sport) {
      throw new BadRequestException('Modalidade invalida');
    }

    const team = await client.team.findUnique({
      where: { id: teamId },
      select: { id: true },
    });

    if (!team) {
      throw new BadRequestException('Equipe invalida');
    }

    return client.scoringConfig.findFirst({
      where: {
        category: sport.category,
        position,
      },
      select: {
        points: true,
      },
    });
  }

  private collectAuditChanges(
    existing: {
      sportId: string;
      teamId: string | null;
      position: number | null;
      rawScore: Prisma.Decimal | number | null;
      resultDate: Date;
      notes: string | null;
    },
    next: {
      sportId: string;
      teamId: string;
      position: number;
      rawScore: Prisma.Decimal | number | null;
      resultDate: Date;
      notes: string | null;
    },
  ) {
    const changes: Array<{
      fieldChanged: string;
      oldValue: string | null;
      newValue: string | null;
    }> = [];

    const pairs = [
      ['sportId', existing.sportId, next.sportId],
      ['teamId', existing.teamId, next.teamId],
      ['position', existing.position, next.position],
      ['rawScore', existing.rawScore, next.rawScore],
      ['resultDate', existing.resultDate.toISOString(), next.resultDate.toISOString()],
      ['notes', existing.notes, next.notes],
    ] as const;

    for (const [fieldChanged, oldValue, newValue] of pairs) {
      const normalizedOld = this.normalizeAuditValue(oldValue);
      const normalizedNew = this.normalizeAuditValue(newValue);

      if (normalizedOld !== normalizedNew) {
        changes.push({
          fieldChanged,
          oldValue: normalizedOld,
          newValue: normalizedNew,
        });
      }
    }

    return changes;
  }

  private normalizeAuditValue(value: unknown) {
    if (value == null) {
      return null;
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    return String(value);
  }
}

type ResultWithRelations = Prisma.ResultGetPayload<{
  include: {
    sport: true;
    team: true;
  };
}>;

type RankingTeam = Prisma.TeamGetPayload<{
  include: {
    results: {
      select: {
        calculatedPoints: true;
      };
    };
  };
}>;

type RankingRow = {
  id: string;
  name: string;
  color: string | null;
  totalScore: number;
};
