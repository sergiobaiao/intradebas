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
      .map((team) => ({
        id: team.id,
        name: team.name,
        color: team.color,
        totalScore: team.results.reduce(
          (sum, result) => sum + (result.calculatedPoints ?? 0),
          0,
        ),
      }))
      .sort((left, right) => {
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

    return this.prisma.result.update({
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
}
