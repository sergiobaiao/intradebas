import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AthleteStatus, AthleteType, Prisma, ShirtSize } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { UpdateAthleteStatusDto } from './dto/update-athlete-status.dto';

@Injectable()
export class AthletesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const athletes = await this.prisma.athlete.findMany({
      include: {
        team: true,
        registrations: {
          include: {
            sport: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return athletes.map((athlete) => this.toResponse(athlete));
  }

  async findOne(id: string) {
    const athlete = await this.prisma.athlete.findUnique({
      where: { id },
      include: {
        team: true,
        registrations: {
          include: {
            sport: true,
          },
        },
      },
    });

    if (!athlete) {
      throw new NotFoundException('Atleta nao encontrado');
    }

    return this.toResponse(athlete);
  }

  async create(dto: CreateAthleteDto) {
    if (!dto.lgpdConsent) {
      throw new BadRequestException('Aceite LGPD e obrigatorio');
    }

    const duplicate = await this.prisma.athlete.findUnique({
      where: { cpf: dto.cpf },
      select: { id: true },
    });

    if (duplicate) {
      throw new ConflictException('CPF ja cadastrado no sistema');
    }

    const team = await this.prisma.team.findUnique({
      where: { id: dto.teamId },
      select: { id: true },
    });

    if (!team) {
      throw new BadRequestException('Equipe informada e invalida');
    }

    let titularId: string | undefined;
    if (dto.type !== 'titular') {
      if (!dto.titularId) {
        throw new BadRequestException(
          'Familiares e convidados devem informar um titular',
        );
      }

      const titular = await this.prisma.athlete.findUnique({
        where: { id: dto.titularId },
        select: { id: true, type: true },
      });

      if (!titular || titular.type !== AthleteType.titular) {
        throw new BadRequestException('Titular informado e invalido');
      }

      titularId = titular.id;
    }

    const sports = await this.prisma.sport.findMany({
      where: {
        id: {
          in: dto.sports,
        },
      },
      select: {
        id: true,
      },
    });

    if (sports.length !== dto.sports.length) {
      throw new BadRequestException('Existe modalidade invalida na inscricao');
    }

    const athlete = await this.prisma.$transaction(async (tx) => {
      const createdAthlete = await tx.athlete.create({
        data: {
          name: dto.name,
          cpf: dto.cpf,
          email: dto.email,
          phone: dto.phone,
          birthDate: new Date(dto.birthDate),
          unit: dto.unit,
          type: dto.type as AthleteType,
          titularId,
          teamId: dto.teamId,
          shirtSize: dto.shirtSize as ShirtSize,
          status:
            dto.type === 'convidado' ? AthleteStatus.pending : AthleteStatus.active,
          lgpdConsent: dto.lgpdConsent,
          lgpdConsentAt: new Date(),
        },
      });

      await tx.registration.createMany({
        data: dto.sports.map((sportId) => ({
          athleteId: createdAthlete.id,
          sportId,
        })),
      });

      return tx.athlete.findUniqueOrThrow({
        where: { id: createdAthlete.id },
        include: {
          team: true,
          registrations: {
            include: {
              sport: true,
            },
          },
        },
      });
    });

    return this.toResponse(athlete);
  }

  async updateStatus(id: string, dto: UpdateAthleteStatusDto) {
    const athlete = await this.prisma.athlete.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!athlete) {
      throw new NotFoundException('Atleta nao encontrado');
    }

    const updated = await this.prisma.athlete.update({
      where: { id },
      data: {
        status: dto.status as AthleteStatus,
      },
      include: {
        team: true,
        registrations: {
          include: {
            sport: true,
          },
        },
      },
    });

    return this.toResponse(updated);
  }

  private toResponse(
    athlete: Prisma.AthleteGetPayload<{
      include: {
        team: true;
        registrations: {
          include: {
            sport: true;
          };
        };
      };
    }>,
  ) {
    const sports = athlete.registrations.map((registration) => registration.sport);

    return {
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
      sports,
    };
  }
}
