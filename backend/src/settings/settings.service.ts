import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScoringConfigDto } from './dto/create-scoring-config.dto';
import { UpdateScoringConfigDto } from './dto/update-scoring-config.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

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
}
