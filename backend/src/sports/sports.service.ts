import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';

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
        description: true,
        isAldebarun: true,
        isActive: true,
        scheduleDate: true,
        scheduleNotes: true,
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

  async create(dto: CreateSportDto) {
    return this.prisma.sport.create({
      data: {
        name: dto.name,
        category: dto.category,
        description: dto.description,
        isAldebarun: dto.isAldebarun,
        isActive: dto.isActive,
        scheduleDate: dto.scheduleDate ? new Date(dto.scheduleDate) : undefined,
        scheduleNotes: dto.scheduleNotes,
      },
    });
  }

  async update(id: string, dto: UpdateSportDto) {
    const sport = await this.prisma.sport.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!sport) {
      throw new NotFoundException('Modalidade nao encontrada');
    }

    return this.prisma.sport.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        isActive: dto.isActive,
        scheduleDate: dto.scheduleDate ? new Date(dto.scheduleDate) : undefined,
        scheduleNotes: dto.scheduleNotes,
      },
    });
  }

  async remove(id: string) {
    const sport = await this.prisma.sport.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!sport) {
      throw new NotFoundException('Modalidade nao encontrada');
    }

    const [registrationsCount, resultsCount] = await Promise.all([
      this.prisma.registration.count({ where: { sportId: id } }),
      this.prisma.result.count({ where: { sportId: id } }),
    ]);

    if (registrationsCount > 0) {
      throw new BadRequestException('Modalidade possui atletas inscritos');
    }

    if (resultsCount > 0) {
      throw new BadRequestException('Modalidade possui resultados registrados');
    }

    await this.prisma.sport.delete({ where: { id } });

    return { id, deleted: true };
  }
}
