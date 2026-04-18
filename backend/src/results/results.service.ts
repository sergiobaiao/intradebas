import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResultDto } from './dto/create-result.dto';

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
    const sport = await this.prisma.sport.findUnique({
      where: { id: dto.sportId },
      select: {
        id: true,
        category: true,
      },
    });

    if (!sport) {
      throw new BadRequestException('Modalidade invalida');
    }

    const team = await this.prisma.team.findUnique({
      where: { id: dto.teamId },
      select: { id: true },
    });

    if (!team) {
      throw new BadRequestException('Equipe invalida');
    }

    const scoring = await this.prisma.scoringConfig.findFirst({
      where: {
        category: sport.category,
        position: dto.position,
      },
      select: {
        points: true,
      },
    });

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
}

