import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';

@Injectable()
export class ResultsService {
  constructor(private readonly prisma: PrismaService) {}

  async listResults() {
    return this.prisma.result.findMany({
      include: {
        sport: true,
        team: true,
      },
      orderBy: [{ resultDate: 'desc' }, { createdAt: 'desc' }],
    });
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
    const teams = await this.prisma.team.findMany({
      include: {
        results: {
          select: {
            calculatedPoints: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return teams
      .map((team: RankingTeam) => ({
        id: team.id,
        name: team.name,
        color: team.color,
        totalScore: team.results.reduce(
          (sum: number, result: RankingTeam['results'][number]) =>
            sum + (result.calculatedPoints ?? 0),
          0,
        ),
      }))
      .sort((left: RankingRow, right: RankingRow) => {
        if (right.totalScore !== left.totalScore) {
          return right.totalScore - left.totalScore;
        }

        return left.name.localeCompare(right.name);
      });
  }

  async createResult(dto: CreateResultDto, recordedBy: string) {
    const scoring = await this.resolveScoring(dto.sportId, dto.teamId, dto.position);

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

    const scoring = await this.resolveScoring(sportId, teamId, position);

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

  private async resolveScoring(sportId: string, teamId: string, position: number) {
    const sport = await this.prisma.sport.findUnique({
      where: { id: sportId },
      select: {
        id: true,
        category: true,
      },
    });

    if (!sport) {
      throw new BadRequestException('Modalidade invalida');
    }

    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      select: { id: true },
    });

    if (!team) {
      throw new BadRequestException('Equipe invalida');
    }

    return this.prisma.scoringConfig.findFirst({
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
