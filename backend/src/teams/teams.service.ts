import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.team.findMany({
      orderBy: [{ totalScore: 'desc' }, { name: 'asc' }],
    });
  }

  async findOne(id: string) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            athletes: true,
          },
        },
      },
    });

    if (!team) {
      throw new NotFoundException('Equipe nao encontrada');
    }

    return {
      ...team,
      athletesCount: team._count.athletes,
    };
  }

  async findAthletes(id: string) {
    await this.findOne(id);

    const athletes = await this.prisma.athlete.findMany({
      where: { teamId: id },
      select: {
        id: true,
        name: true,
        cpf: true,
        email: true,
        phone: true,
        birthDate: true,
        type: true,
        status: true,
        unit: true,
        shirtSize: true,
        createdAt: true,
        team: {
          select: {
            id: true,
            name: true,
            color: true,
            totalScore: true,
          },
        },
        registrations: {
          select: {
            sport: {
              select: {
                id: true,
                name: true,
                category: true,
              },
            },
          },
        },
      },
      orderBy: [{ status: 'asc' }, { name: 'asc' }],
    });

    return athletes.map((athlete: TeamAthleteWithRelations) => ({
      id: athlete.id,
      name: athlete.name,
      cpf: athlete.cpf,
      email: athlete.email,
      phone: athlete.phone,
      birthDate: athlete.birthDate,
      type: athlete.type,
      status: athlete.status,
      unit: athlete.unit,
      shirtSize: athlete.shirtSize,
      createdAt: athlete.createdAt,
      team: athlete.team,
      sports: athlete.registrations.length
        ? athlete.registrations.map(
            (registration: TeamAthleteWithRelations['registrations'][number]) =>
              registration.sport,
          )
        : [],
    }));
  }

  async create(dto: CreateTeamDto) {
    return this.prisma.team.create({
      data: {
        name: dto.name,
        color: dto.color,
      },
    });
  }

  async update(id: string, dto: UpdateTeamDto) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!team) {
      throw new NotFoundException('Equipe nao encontrada');
    }

    return this.prisma.team.update({
      where: { id },
      data: {
        name: dto.name,
        color: dto.color,
      },
    });
  }

  async remove(id: string) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!team) {
      throw new NotFoundException('Equipe nao encontrada');
    }

    const [athletesCount, resultsCount] = await Promise.all([
      this.prisma.athlete.count({ where: { teamId: id } }),
      this.prisma.result.count({ where: { teamId: id } }),
    ]);

    if (athletesCount > 0) {
      throw new BadRequestException('Equipe possui atletas vinculados');
    }

    if (resultsCount > 0) {
      throw new BadRequestException('Equipe possui resultados registrados');
    }

    await this.prisma.team.delete({ where: { id } });

    return { id, deleted: true };
  }
}

type TeamAthleteWithRelations = Prisma.AthleteGetPayload<{
  select: {
    id: true;
    name: true;
    cpf: true;
    email: true;
    phone: true;
    birthDate: true;
    type: true;
    status: true;
    unit: true;
    shirtSize: true;
    createdAt: true;
    team: {
      select: {
        id: true;
        name: true;
        color: true;
        totalScore: true;
      };
    };
    registrations: {
      select: {
        sport: {
          select: {
            id: true;
            name: true;
            category: true;
          };
        };
      };
    };
  };
}>;
