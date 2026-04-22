import { Injectable, NotFoundException } from '@nestjs/common';
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
}
