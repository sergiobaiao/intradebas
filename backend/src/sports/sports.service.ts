import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';

@Injectable()
export class SportsService {
  constructor(private readonly prisma: PrismaService) {}

  private toAuditValue(value: unknown) {
    if (value === null || value === undefined) {
      return null;
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    return String(value);
  }

  private async createAuditEntries(
    sportId: string,
    sportName: string,
    changedBy: string | undefined,
    action: string,
    changes: Array<{ fieldChanged?: string; oldValue?: unknown; newValue?: unknown }>,
  ) {
    if (!changedBy || changes.length === 0) {
      return;
    }

    await this.prisma.auditLog.createMany({
      data: changes.map((change) => ({
        entityType: 'sport',
        entityId: sportId,
        entityLabel: sportName,
        action,
        fieldChanged: change.fieldChanged,
        oldValue: this.toAuditValue(change.oldValue),
        newValue: this.toAuditValue(change.newValue),
        changedBy,
      })),
    });
  }

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

  async update(id: string, dto: UpdateSportDto, changedBy?: string) {
    const sport = await this.prisma.sport.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        isActive: true,
        scheduleDate: true,
        scheduleNotes: true,
      },
    });

    if (!sport) {
      throw new NotFoundException('Modalidade nao encontrada');
    }

    const updated = await this.prisma.sport.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        isActive: dto.isActive,
        scheduleDate: dto.scheduleDate ? new Date(dto.scheduleDate) : undefined,
        scheduleNotes: dto.scheduleNotes,
      },
    });

    await this.createAuditEntries(id, updated.name, changedBy, 'update', [
      { fieldChanged: 'name', oldValue: sport.name, newValue: updated.name },
      {
        fieldChanged: 'description',
        oldValue: sport.description,
        newValue: updated.description,
      },
      {
        fieldChanged: 'isActive',
        oldValue: sport.isActive,
        newValue: updated.isActive,
      },
      {
        fieldChanged: 'scheduleDate',
        oldValue: sport.scheduleDate,
        newValue: updated.scheduleDate,
      },
      {
        fieldChanged: 'scheduleNotes',
        oldValue: sport.scheduleNotes,
        newValue: updated.scheduleNotes,
      },
    ].filter(
      (change) =>
        this.toAuditValue(change.oldValue) !== this.toAuditValue(change.newValue),
    ));

    return updated;
  }

  async remove(id: string, changedBy?: string) {
    const sport = await this.prisma.sport.findUnique({
      where: { id },
      select: { id: true, name: true },
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

    await this.createAuditEntries(id, sport.name, changedBy, 'delete', [
      { oldValue: sport.name, newValue: null },
    ]);

    return { id, deleted: true };
  }
}
