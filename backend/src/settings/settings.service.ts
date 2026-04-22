import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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
}
