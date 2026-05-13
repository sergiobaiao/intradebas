import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RedisPubSubService } from '../realtime/redis-pubsub.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScoringConfigDto } from './dto/create-scoring-config.dto';
import { UpdateRankingSettingsDto } from './dto/update-ranking-settings.dto';
import { UpdateScoringConfigDto } from './dto/update-scoring-config.dto';

@Injectable()
export class SettingsService {
  private static readonly rankingChannel = 'intradebas:results:ranking-updated';
  private static readonly rankingCacheKey = 'intradebas:results:ranking';

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisPubSub: RedisPubSubService,
  ) {}

  async listScoringConfig() {
    return this.prisma.scoringConfig.findMany({
      include: {
        updatedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [{ category: 'asc' }, { position: 'asc' }],
    });
  }

  async getRankingSettings() {
    const settings = await this.prisma.rankingSettings.findUnique({
      where: { id: 'default' },
      include: {
        updatedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return (
      settings ?? {
        id: 'default',
        tieBreakRule: 'most_wins',
        updatedAt: new Date(0),
        updatedByUser: null,
      }
    );
  }

  async createScoringConfig(dto: CreateScoringConfigDto, updatedBy: string) {
    const existing = await this.prisma.scoringConfig.findFirst({
      where: {
        category: dto.category,
        position: dto.position,
      },
      select: { id: true },
    });

    if (existing) {
      throw new BadRequestException('Ja existe configuracao para esta categoria e posicao');
    }

    return this.prisma.scoringConfig.create({
      data: {
        category: dto.category,
        position: dto.position,
        points: dto.points,
        updatedBy,
      },
      include: {
        updatedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async updateScoringConfig(id: string, dto: UpdateScoringConfigDto, updatedBy: string) {
    const row = await this.prisma.scoringConfig.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!row) {
      throw new NotFoundException('Configuracao de pontuacao nao encontrada');
    }

    return this.prisma.scoringConfig.update({
      where: { id },
      data: {
        points: dto.points,
        updatedBy,
      },
      include: {
        updatedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async deleteScoringConfig(id: string) {
    const row = await this.prisma.scoringConfig.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!row) {
      throw new NotFoundException('Configuracao de pontuacao nao encontrada');
    }

    await this.prisma.scoringConfig.delete({
      where: { id },
    });

    return {
      id,
      deleted: true,
    };
  }

  async updateRankingSettings(dto: UpdateRankingSettingsDto, updatedBy: string) {
    const settings = await this.prisma.rankingSettings.upsert({
      where: { id: 'default' },
      update: {
        tieBreakRule: dto.tieBreakRule,
        updatedBy,
      },
      create: {
        id: 'default',
        tieBreakRule: dto.tieBreakRule,
        updatedBy,
      },
      include: {
        updatedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await this.redisPubSub.deleteCache(SettingsService.rankingCacheKey);
    await this.redisPubSub.publish(SettingsService.rankingChannel, {
      type: 'ranking-updated',
      timestamp: new Date().toISOString(),
    });

    return settings;
  }
}
