import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AthleteStatus,
  AthleteType,
  CouponStatus,
  Prisma,
  ShirtSize,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { UpdateAthleteDto } from './dto/update-athlete.dto';
import { UpdateAthleteStatusDto } from './dto/update-athlete-status.dto';

@Injectable()
export class AthletesService {
  constructor(private readonly prisma: PrismaService) {}

  private toAuditValue(value: unknown) {
    if (value === null || value === undefined) {
      return null;
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    if (Array.isArray(value)) {
      return value.join(', ');
    }

    return String(value);
  }

  private async createAuditEntries(
    athleteId: string,
    athleteName: string,
    changedBy: string | undefined,
    action: string,
    changes: Array<{ fieldChanged?: string; oldValue?: unknown; newValue?: unknown }>,
  ) {
    if (!changedBy || changes.length === 0) {
      return;
    }

    await this.prisma.auditLog.createMany({
      data: changes.map((change) => ({
        entityType: 'athlete',
        entityId: athleteId,
        entityLabel: athleteName,
        action,
        fieldChanged: change.fieldChanged,
        oldValue: this.toAuditValue(change.oldValue),
        newValue: this.toAuditValue(change.newValue),
        changedBy,
      })),
    });
  }

  private normalizePage(value?: string) {
    const parsed = Number(value ?? 1);
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
  }

  private normalizePageSize(value?: string) {
    const parsed = Number(value ?? 12);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return 12;
    }

    return Math.min(Math.floor(parsed), 50);
  }

  private toResponse(athlete: AthleteWithRelations) {
    const sports = athlete.registrations.map(
      (registration: AthleteWithRelations['registrations'][number]) =>
        registration.sport,
    );

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

  async findAll() {
    const athletes = await this.prisma.athlete.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return athletes.map((athlete: AthleteWithRelations) => this.toResponse(athlete));
  }

  async exportCsv() {
    const athletes = await this.prisma.athlete.findMany({
      select: {
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
            name: true,
          },
        },
        registrations: {
          select: {
            sport: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: [{ createdAt: 'desc' }, { name: 'asc' }],
    });

    const header = [
      'nome',
      'cpf',
      'email',
      'telefone',
      'data_nascimento',
      'tipo',
      'status',
      'unidade',
      'camiseta',
      'equipe',
      'modalidades',
      'criado_em',
    ];

    const escape = (value: string | null | undefined) =>
      `"${String(value ?? '').replaceAll('"', '""')}"`;

    const rows = athletes.map((athlete) =>
      [
        athlete.name,
        athlete.cpf,
        athlete.email,
        athlete.phone,
        athlete.birthDate.toISOString().slice(0, 10),
        athlete.type,
        athlete.status,
        athlete.unit,
        athlete.shirtSize,
        athlete.team.name,
        athlete.registrations.map((registration) => registration.sport.name).join('; '),
        athlete.createdAt.toISOString(),
      ]
        .map((value) => escape(value))
        .join(','),
    );

    return [header.join(','), ...rows].join('\n');
  }

  async findOne(id: string) {
    const athlete = await this.prisma.athlete.findUnique({
      where: { id },
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
    });

    if (!athlete) {
      throw new NotFoundException('Atleta nao encontrado');
    }

    return this.toResponse(athlete);
  }

  async findReviewPage(query: {
    page?: string;
    pageSize?: string;
    status?: string;
    teamId?: string;
    search?: string;
  }) {
    const page = this.normalizePage(query.page);
    const pageSize = this.normalizePageSize(query.pageSize);
    const search = query.search?.trim();
    const where: Prisma.AthleteWhereInput = {
      ...(query.status ? { status: query.status as AthleteStatus } : {}),
      ...(query.teamId ? { teamId: query.teamId } : {}),
      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                cpf: {
                  contains: search,
                },
              },
            ],
          }
        : {}),
    };

    const [total, athletes] = await Promise.all([
      this.prisma.athlete.count({ where }),
      this.prisma.athlete.findMany({
        where,
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
        orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      items: athletes.map((athlete: AthleteWithRelations) => this.toResponse(athlete)),
      total,
      page,
      pageSize,
      totalPages: Math.max(Math.ceil(total / pageSize), 1),
    };
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

    const couponCode = dto.couponCode?.trim().toUpperCase();

    const athlete = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      let couponId: string | null = null;

      if (couponCode) {
        const coupon = await tx.coupon.findUnique({
          where: { code: couponCode },
          select: { id: true, status: true },
        });

        if (!coupon || coupon.status !== CouponStatus.active) {
          throw new BadRequestException('Cupom invalido ou indisponivel');
        }

        couponId = coupon.id;
      }

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
            dto.type === 'convidado' && !couponCode
              ? AthleteStatus.pending
              : AthleteStatus.active,
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

      if (couponId) {
        const redeemedCoupon = await tx.coupon.updateMany({
          where: {
            id: couponId,
            status: CouponStatus.active,
          },
          data: {
            status: CouponStatus.used,
            redeemedBy: createdAthlete.id,
            redeemedAt: new Date(),
          },
        });

        if (redeemedCoupon.count !== 1) {
          throw new BadRequestException('Cupom invalido ou indisponivel');
        }
      }

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

  async update(id: string, dto: UpdateAthleteDto, changedBy?: string) {
    const athlete = await this.prisma.athlete.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        birthDate: true,
        unit: true,
        teamId: true,
        shirtSize: true,
        registrations: {
          select: {
            sportId: true,
          },
        },
      },
    });

    if (!athlete) {
      throw new NotFoundException('Atleta nao encontrado');
    }

    if (dto.teamId) {
      const team = await this.prisma.team.findUnique({
        where: { id: dto.teamId },
        select: { id: true },
      });

      if (!team) {
        throw new BadRequestException('Equipe informada e invalida');
      }
    }

    if (dto.sports) {
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
    }

    const updated = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.athlete.update({
        where: { id },
        data: {
          name: dto.name,
          email: dto.email,
          phone: dto.phone,
          birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
          unit: dto.unit,
          teamId: dto.teamId,
          shirtSize: dto.shirtSize as ShirtSize | undefined,
        },
      });

      if (dto.sports) {
        await tx.registration.deleteMany({
          where: {
            athleteId: id,
          },
        });

        await tx.registration.createMany({
          data: dto.sports.map((sportId) => ({
            athleteId: id,
            sportId,
          })),
        });
      }

      return tx.athlete.findUniqueOrThrow({
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
    });

    await this.createAuditEntries(
      id,
      updated.name,
      changedBy,
      'update',
      [
        { fieldChanged: 'name', oldValue: athlete.name, newValue: updated.name },
        { fieldChanged: 'email', oldValue: athlete.email, newValue: updated.email },
        { fieldChanged: 'phone', oldValue: athlete.phone, newValue: updated.phone },
        {
          fieldChanged: 'birthDate',
          oldValue: athlete.birthDate,
          newValue: updated.birthDate,
        },
        { fieldChanged: 'unit', oldValue: athlete.unit, newValue: updated.unit },
        { fieldChanged: 'teamId', oldValue: athlete.teamId, newValue: updated.team.id },
        {
          fieldChanged: 'shirtSize',
          oldValue: athlete.shirtSize,
          newValue: updated.shirtSize,
        },
        {
          fieldChanged: 'sports',
          oldValue: athlete.registrations.map((registration) => registration.sportId).sort(),
          newValue: updated.registrations.map((registration) => registration.sport.id).sort(),
        },
      ].filter(
        (change) =>
          this.toAuditValue(change.oldValue) !== this.toAuditValue(change.newValue),
      ),
    );

    return this.toResponse(updated);
  }

  async updateStatus(id: string, dto: UpdateAthleteStatusDto, changedBy?: string) {
    const athlete = await this.prisma.athlete.findUnique({
      where: { id },
      select: { id: true, name: true, status: true },
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

    await this.createAuditEntries(id, athlete.name, changedBy, 'status_change', [
      {
        fieldChanged: 'status',
        oldValue: athlete.status,
        newValue: updated.status,
      },
    ]);

    return this.toResponse(updated);
  }

  async remove(id: string, changedBy?: string) {
    const athlete = await this.prisma.athlete.findUnique({
      where: { id },
      select: { id: true, name: true },
    });

    if (!athlete) {
      throw new NotFoundException('Atleta nao encontrado');
    }

    const [dependentsCount, resultsCount, redeemedCouponsCount] =
      await Promise.all([
        this.prisma.athlete.count({ where: { titularId: id } }),
        this.prisma.result.count({ where: { athleteId: id } }),
        this.prisma.coupon.count({ where: { athlete: { id } } }),
      ]);

    if (dependentsCount > 0) {
      throw new BadRequestException('Atleta possui dependentes vinculados');
    }

    if (resultsCount > 0) {
      throw new BadRequestException('Atleta possui resultados registrados');
    }

    if (redeemedCouponsCount > 0) {
      throw new BadRequestException('Atleta possui cupom resgatado');
    }

    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.registration.deleteMany({ where: { athleteId: id } });
      await tx.athlete.delete({ where: { id } });
    });

    await this.createAuditEntries(id, athlete.name, changedBy, 'delete', [
      { oldValue: athlete.name, newValue: null },
    ]);

    return { id, deleted: true };
  }

}

type AthleteWithRelations = Prisma.AthleteGetPayload<{
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
