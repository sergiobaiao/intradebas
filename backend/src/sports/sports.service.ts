import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SportsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.sport.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        category: true,
        isAldebarun: true,
      },
    });
  }

  async findOne(id: string) {
    const sport = await this.prisma.sport.findUnique({
      where: { id },
      include: {
        results: {
          include: {
            team: true,
          },
          orderBy: [{ resultDate: 'desc' }, { createdAt: 'desc' }],
        },
      },
    });

    if (!sport) {
      throw new NotFoundException('Modalidade nao encontrada');
    }

    return sport;
  }
}
