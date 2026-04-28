import { BadRequestException, Injectable } from '@nestjs/common';
import { CouponStatus, Prisma, SponsorStatus } from '@prisma/client';
import { createHash, randomBytes } from 'crypto';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSponsorDto } from './dto/update-sponsor.dto';

@Injectable()
export class SponsorshipService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

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
    sponsorId: string,
    sponsorLabel: string,
    changedBy: string | undefined,
    action: string,
    changes: Array<{ fieldChanged?: string; oldValue?: unknown; newValue?: unknown }>,
  ) {
    if (!changedBy || changes.length === 0) {
      return;
    }

    await this.prisma.auditLog.createMany({
      data: changes.map((change) => ({
        entityType: 'sponsor',
        entityId: sponsorId,
        entityLabel: sponsorLabel,
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

  private parseSponsorStatus(value?: string): SponsorStatus | undefined {
    if (!value) {
      return undefined;
    }

    if (Object.values(SponsorStatus).includes(value as SponsorStatus)) {
      return value as SponsorStatus;
    }

    throw new BadRequestException('Status de patrocinador invalido');
  }

  private parseCouponStatus(value?: string): CouponStatus | undefined {
    if (!value) {
      return undefined;
    }

    if (Object.values(CouponStatus).includes(value as CouponStatus)) {
      return value as CouponStatus;
    }

    throw new BadRequestException('Status de cupom invalido');
  }

  private generateCouponCode(level: string) {
    const randomPart = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
    return `${level.toUpperCase()}-${randomPart}`;
  }

  private hashPortalToken(value: string) {
    return createHash('sha256').update(value).digest('hex');
  }

  async listQuotas() {
    const quotas = await this.prisma.sponsorshipQuota.findMany({
      include: {
        sponsors: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: {
        backdropPriority: 'desc',
      },
    });

    return quotas.map((quota: QuotaWithSponsors) => {
      const usedSlots = quota.sponsors.filter((sponsor: QuotaSponsorStatus) =>
        ['pending', 'active'].includes(sponsor.status),
      ).length;

      return {
        id: quota.id,
        level: quota.level,
        price: Number(quota.price),
        maxSlots: quota.maxSlots,
        usedSlots,
        remainingSlots: Math.max(quota.maxSlots - usedSlots, 0),
        courtesyCount: quota.courtesyCount,
        benefits: quota.benefits,
        backdropPriority: quota.backdropPriority,
      };
    });
  }

  async createSponsorInterest(input: {
    companyName: string;
    contactName: string;
    email: string;
    phone?: string;
    quotaId: string;
    logoUrl?: string;
  }) {
    const quota = await this.prisma.sponsorshipQuota.findUnique({
      where: { id: input.quotaId },
      include: {
        sponsors: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    if (!quota) {
      throw new BadRequestException('Cota de patrocinio invalida');
    }

    const usedSlots = quota.sponsors.filter((sponsor: QuotaSponsorStatus) =>
      ['pending', 'active'].includes(sponsor.status),
    ).length;

    if (usedSlots >= quota.maxSlots) {
      throw new BadRequestException('Esta cota nao possui vagas disponiveis');
    }

    const sponsor = await this.prisma.sponsor.create({
      data: {
        companyName: input.companyName,
        contactName: input.contactName,
        email: input.email.toLowerCase(),
        phone: input.phone,
        quotaId: input.quotaId,
        logoUrl: input.logoUrl,
      },
      include: {
        quota: true,
      },
    });

    return {
      id: sponsor.id,
      companyName: sponsor.companyName,
      contactName: sponsor.contactName,
      email: sponsor.email,
      phone: sponsor.phone,
      status: sponsor.status,
      quota: {
        id: sponsor.quota.id,
        level: sponsor.quota.level,
        price: Number(sponsor.quota.price),
      },
    };
  }

  async requestPortalAccess(email: string) {
    const sponsor = await this.prisma.sponsor.findFirst({
      where: {
        email: email.toLowerCase(),
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        companyName: true,
        contactName: true,
        email: true,
      },
    });

    if (!sponsor) {
      return { success: true };
    }

    const rawToken = randomBytes(24).toString('hex');
    const tokenHash = this.hashPortalToken(rawToken);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

    await this.prisma.$executeRaw(Prisma.sql`
      DELETE FROM "sponsor_portal_tokens"
      WHERE "sponsor_id" = ${sponsor.id}
    `);

    await this.prisma.$executeRaw(Prisma.sql`
      INSERT INTO "sponsor_portal_tokens" (
        "id",
        "sponsor_id",
        "token_hash",
        "expires_at",
        "created_at"
      )
      VALUES (
        gen_random_uuid()::text,
        ${sponsor.id},
        ${tokenHash},
        ${expiresAt},
        NOW()
      )
    `);

    const frontendBaseUrl = process.env.FRONTEND_BASE_URL ?? 'http://localhost:3000';
    const portalUrl = `${frontendBaseUrl}/patrocinador?token=${encodeURIComponent(rawToken)}`;

    await this.mailService.sendSponsorPortalAccessEmail({
      to: sponsor.email,
      name: sponsor.contactName,
      companyName: sponsor.companyName,
      portalUrl,
    });

    return { success: true };
  }

  async getPortalSession(token: string) {
    const tokenHash = this.hashPortalToken(token);
    const rows = await this.prisma.$queryRaw<Array<{
      id: string;
      sponsorId: string;
      expiresAt: Date;
    }>>(Prisma.sql`
      SELECT
        "id",
        "sponsor_id" AS "sponsorId",
        "expires_at" AS "expiresAt"
      FROM "sponsor_portal_tokens"
      WHERE "token_hash" = ${tokenHash}
      LIMIT 1
    `);
    const portalToken = rows[0];

    if (!portalToken || portalToken.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('Link de acesso invalido ou expirado');
    }

    await this.prisma.$executeRaw(Prisma.sql`
      UPDATE "sponsor_portal_tokens"
      SET "last_accessed_at" = ${new Date()}
      WHERE "id" = ${portalToken.id}
    `);

    const sponsor = await this.prisma.sponsor.findUnique({
      where: { id: portalToken.sponsorId },
      include: {
        quota: {
          select: {
            id: true,
            level: true,
            price: true,
            courtesyCount: true,
            benefits: true,
            backdropPriority: true,
          },
        },
        coupons: {
          include: {
            athlete: {
              select: {
                id: true,
                name: true,
                cpf: true,
              },
            },
          },
          orderBy: [{ createdAt: 'desc' }, { code: 'asc' }],
        },
      },
    });

    if (!sponsor) {
      throw new BadRequestException('Patrocinador vinculado ao link nao foi encontrado');
    }

    return {
      sponsor: {
        id: sponsor.id,
        companyName: sponsor.companyName,
        contactName: sponsor.contactName,
        email: sponsor.email,
        phone: sponsor.phone,
        logoUrl: sponsor.logoUrl,
        status: sponsor.status,
        paymentDate: sponsor.paymentDate,
        paymentNotes: sponsor.paymentNotes,
        createdAt: sponsor.createdAt,
        quota: {
          id: sponsor.quota.id,
          level: sponsor.quota.level,
          price: Number(sponsor.quota.price),
          courtesyCount: sponsor.quota.courtesyCount,
          benefits: sponsor.quota.benefits,
          backdropPriority: sponsor.quota.backdropPriority,
        },
      },
      coupons: sponsor.coupons.map((coupon: SponsorPortalCouponWithAthlete) => ({
        id: coupon.id,
        code: coupon.code,
        status: coupon.status,
        createdAt: coupon.createdAt,
        redeemedAt: coupon.redeemedAt,
        athlete: coupon.athlete,
      })),
    };
  }

  async listBackdropSponsors() {
    const sponsors = await this.prisma.sponsor.findMany({
      where: {
        status: SponsorStatus.active,
      },
      include: {
        quota: {
          select: {
            level: true,
            backdropPriority: true,
          },
        },
      },
      orderBy: [{ quota: { backdropPriority: 'desc' } }, { companyName: 'asc' }],
    });

    return sponsors.map((sponsor: BackdropSponsor) => ({
      id: sponsor.id,
      companyName: sponsor.companyName,
      logoUrl: sponsor.logoUrl,
      level: sponsor.quota.level,
      backdropPriority: sponsor.quota.backdropPriority,
    }));
  }

  async listSponsors() {
    const sponsors = await this.prisma.sponsor.findMany({
      include: {
        quota: {
          select: {
            id: true,
            level: true,
            price: true,
            courtesyCount: true,
          },
        },
        coupons: {
          select: {
            id: true,
          },
        },
      },
      orderBy: [{ createdAt: 'desc' }, { companyName: 'asc' }],
    });

    return sponsors.map((sponsor: AdminSponsor) => ({
      id: sponsor.id,
      companyName: sponsor.companyName,
      contactName: sponsor.contactName,
      email: sponsor.email,
      phone: sponsor.phone,
      logoUrl: sponsor.logoUrl,
      status: sponsor.status,
      createdAt: sponsor.createdAt,
      couponCount: sponsor.coupons.length,
      quota: {
        id: sponsor.quota.id,
        level: sponsor.quota.level,
        price: Number(sponsor.quota.price),
        courtesyCount: sponsor.quota.courtesyCount,
      },
    }));
  }

  async listSponsorsPage(query: {
    page?: string;
    pageSize?: string;
    status?: string;
  }) {
    const page = this.normalizePage(query.page);
    const pageSize = this.normalizePageSize(query.pageSize);
    const status = this.parseSponsorStatus(query.status);
    const where: Prisma.SponsorWhereInput = {
      ...(status ? { status } : {}),
    };

    const [total, items] = await Promise.all([
      this.prisma.sponsor.count({ where }),
      this.prisma.sponsor.findMany({
        where,
        include: {
          quota: {
            select: {
              id: true,
              level: true,
              price: true,
              courtesyCount: true,
            },
          },
          coupons: {
            select: {
              id: true,
            },
          },
        },
        orderBy: [{ createdAt: 'desc' }, { companyName: 'asc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      items: items.map((sponsor: AdminSponsor) => ({
        id: sponsor.id,
        companyName: sponsor.companyName,
        contactName: sponsor.contactName,
        email: sponsor.email,
        phone: sponsor.phone,
        logoUrl: sponsor.logoUrl,
        status: sponsor.status,
        createdAt: sponsor.createdAt,
        couponCount: sponsor.coupons.length,
        quota: {
          id: sponsor.quota.id,
          level: sponsor.quota.level,
          price: Number(sponsor.quota.price),
          courtesyCount: sponsor.quota.courtesyCount,
        },
      })),
      total,
      page,
      pageSize,
      totalPages: Math.max(Math.ceil(total / pageSize), 1),
    };
  }

  async listCoupons() {
    const coupons = await this.prisma.coupon.findMany({
      include: {
        sponsor: {
          select: {
            id: true,
            companyName: true,
          },
        },
        athlete: {
          select: {
            id: true,
            name: true,
            cpf: true,
          },
        },
      },
      orderBy: [{ createdAt: 'desc' }, { code: 'asc' }],
    });

    return coupons.map((coupon: AdminCoupon) => ({
      id: coupon.id,
      code: coupon.code,
      status: coupon.status,
      createdAt: coupon.createdAt,
      redeemedAt: coupon.redeemedAt,
      sponsor: coupon.sponsor,
      athlete: coupon.athlete,
    }));
  }

  async listCouponsPage(query: {
    page?: string;
    pageSize?: string;
    status?: string;
    sponsorId?: string;
  }) {
    const page = this.normalizePage(query.page);
    const pageSize = this.normalizePageSize(query.pageSize);
    const status = this.parseCouponStatus(query.status);
    const where: Prisma.CouponWhereInput = {
      ...(status ? { status } : {}),
      ...(query.sponsorId ? { sponsorId: query.sponsorId } : {}),
    };

    const [total, items] = await Promise.all([
      this.prisma.coupon.count({ where }),
      this.prisma.coupon.findMany({
        where,
        include: {
          sponsor: {
            select: {
              id: true,
              companyName: true,
            },
          },
          athlete: {
            select: {
              id: true,
              name: true,
              cpf: true,
            },
          },
        },
        orderBy: [{ createdAt: 'desc' }, { code: 'asc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      items: items.map((coupon: AdminCoupon) => ({
        id: coupon.id,
        code: coupon.code,
        status: coupon.status,
        createdAt: coupon.createdAt,
        redeemedAt: coupon.redeemedAt,
        sponsor: coupon.sponsor,
        athlete: coupon.athlete,
      })),
      total,
      page,
      pageSize,
      totalPages: Math.max(Math.ceil(total / pageSize), 1),
    };
  }

  async listSponsorCoupons(sponsorId: string) {
    const sponsor = await this.prisma.sponsor.findUnique({
      where: { id: sponsorId },
      select: { id: true },
    });

    if (!sponsor) {
      throw new BadRequestException('Patrocinador invalido');
    }

    const coupons = await this.prisma.coupon.findMany({
      where: {
        sponsorId,
      },
      include: {
        sponsor: {
          select: {
            id: true,
            companyName: true,
          },
        },
        athlete: {
          select: {
            id: true,
            name: true,
            cpf: true,
          },
        },
      },
      orderBy: [{ createdAt: 'desc' }, { code: 'asc' }],
    });

    return coupons.map((coupon: AdminCoupon) => ({
      id: coupon.id,
      code: coupon.code,
      status: coupon.status,
      createdAt: coupon.createdAt,
      redeemedAt: coupon.redeemedAt,
      sponsor: coupon.sponsor,
      athlete: coupon.athlete,
    }));
  }

  async activateSponsor(sponsorId: string, changedBy?: string) {
    const sponsor = await this.prisma.sponsor.findUnique({
      where: { id: sponsorId },
      include: {
        quota: true,
        coupons: true,
      },
    });

    if (!sponsor) {
      throw new BadRequestException('Patrocinador invalido');
    }

    if (sponsor.status === 'active') {
      return {
        id: sponsor.id,
        status: sponsor.status,
        couponsGenerated: sponsor.coupons.length,
      };
    }

    if (sponsor.status === SponsorStatus.inactive) {
      await this.ensureQuotaCapacity(sponsor.quota.id, sponsor.id);
    }

    const existingCouponCount = sponsor.coupons.length;
    const missingCoupons = Math.max(sponsor.quota.courtesyCount - existingCouponCount, 0);

    const created = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updatedSponsor = await tx.sponsor.update({
        where: { id: sponsor.id },
        data: {
          status: 'active',
          paymentDate: new Date(),
        },
        include: {
          quota: true,
          coupons: true,
        },
      });

      for (let index = 0; index < missingCoupons; index += 1) {
        let code = this.generateCouponCode(updatedSponsor.quota.level);

        while (await tx.coupon.findUnique({ where: { code }, select: { id: true } })) {
          code = this.generateCouponCode(updatedSponsor.quota.level);
        }

        await tx.coupon.create({
          data: {
            code,
            sponsorId: updatedSponsor.id,
          },
        });
      }

      return tx.sponsor.findUniqueOrThrow({
        where: { id: sponsor.id },
        include: {
          coupons: true,
        },
      });
    });

    await this.createAuditEntries(
      created.id,
      sponsor.companyName,
      changedBy,
      'activate',
      [
        { fieldChanged: 'status', oldValue: sponsor.status, newValue: created.status },
        {
          fieldChanged: 'couponsGenerated',
          oldValue: existingCouponCount,
          newValue: created.coupons.length,
        },
      ],
    );

    return {
      id: created.id,
      status: created.status,
      couponsGenerated: created.coupons.length,
    };
  }

  async updateSponsor(sponsorId: string, input: UpdateSponsorDto, changedBy?: string) {
    const sponsor = await this.prisma.sponsor.findUnique({
      where: { id: sponsorId },
      select: {
        id: true,
        companyName: true,
        contactName: true,
        email: true,
        phone: true,
        logoUrl: true,
        quotaId: true,
        status: true,
      },
    });

    if (!sponsor) {
      throw new BadRequestException('Patrocinador invalido');
    }

    const nextQuotaId = input.quotaId ?? sponsor.quotaId;
    const nextStatus = input.status ?? sponsor.status;

    if (input.quotaId) {
      const quota = await this.prisma.sponsorshipQuota.findUnique({
        where: { id: input.quotaId },
        select: { id: true },
      });

      if (!quota) {
        throw new BadRequestException('Cota de patrocinio invalida');
      }
    }

    if (nextStatus === SponsorStatus.pending || nextStatus === SponsorStatus.active) {
      await this.ensureQuotaCapacity(nextQuotaId, sponsorId);
    }

    const updated = await this.prisma.sponsor.update({
      where: { id: sponsorId },
      data: {
        companyName: input.companyName,
        contactName: input.contactName,
        email: input.email?.toLowerCase(),
        phone: input.phone,
        logoUrl: input.logoUrl,
        quotaId: input.quotaId,
        status: input.status,
      },
      include: {
        quota: {
          select: {
            id: true,
            level: true,
            price: true,
            courtesyCount: true,
          },
        },
        coupons: {
          select: {
            id: true,
          },
        },
      },
    });

    await this.createAuditEntries(sponsorId, updated.companyName, changedBy, 'update', [
      {
        fieldChanged: 'companyName',
        oldValue: sponsor.companyName,
        newValue: updated.companyName,
      },
      {
        fieldChanged: 'contactName',
        oldValue: sponsor.contactName,
        newValue: updated.contactName,
      },
      { fieldChanged: 'email', oldValue: sponsor.email, newValue: updated.email },
      { fieldChanged: 'phone', oldValue: sponsor.phone, newValue: updated.phone },
      { fieldChanged: 'logoUrl', oldValue: sponsor.logoUrl, newValue: updated.logoUrl },
      { fieldChanged: 'quotaId', oldValue: sponsor.quotaId, newValue: updated.quota.id },
      { fieldChanged: 'status', oldValue: sponsor.status, newValue: updated.status },
    ].filter(
      (change) =>
        this.toAuditValue(change.oldValue) !== this.toAuditValue(change.newValue),
    ));

    return {
      id: updated.id,
      companyName: updated.companyName,
      contactName: updated.contactName,
      email: updated.email,
      phone: updated.phone,
      status: updated.status,
      logoUrl: updated.logoUrl,
      createdAt: updated.createdAt,
      couponCount: updated.coupons.length,
      quota: {
        id: updated.quota.id,
        level: updated.quota.level,
        price: Number(updated.quota.price),
        courtesyCount: updated.quota.courtesyCount,
      },
    };
  }

  async createCouponForSponsor(sponsorId: string) {
    const sponsor = await this.prisma.sponsor.findUnique({
      where: { id: sponsorId },
      include: {
        quota: {
          select: {
            level: true,
            courtesyCount: true,
          },
        },
        coupons: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!sponsor) {
      throw new BadRequestException('Patrocinador invalido');
    }

    if (sponsor.coupons.length >= sponsor.quota.courtesyCount) {
      throw new BadRequestException('Patrocinador ja possui todos os cupons de cortesia');
    }

    let code = this.generateCouponCode(sponsor.quota.level);

    while (await this.prisma.coupon.findUnique({ where: { code }, select: { id: true } })) {
      code = this.generateCouponCode(sponsor.quota.level);
    }

    return this.prisma.coupon.create({
      data: {
        code,
        sponsorId: sponsor.id,
      },
      include: {
        sponsor: {
          select: {
            id: true,
            companyName: true,
          },
        },
        athlete: {
          select: {
            id: true,
            name: true,
            cpf: true,
          },
        },
      },
    });
  }

  async expireCoupon(couponId: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id: couponId },
      select: {
        id: true,
        status: true,
      },
    });

    if (!coupon) {
      throw new BadRequestException('Cupom invalido');
    }

    if (coupon.status === CouponStatus.used) {
      throw new BadRequestException('Cupom utilizado nao pode ser expirado');
    }

    if (coupon.status === CouponStatus.expired) {
      throw new BadRequestException('Cupom ja expirado');
    }

    return this.prisma.coupon.update({
      where: { id: couponId },
      data: {
        status: CouponStatus.expired,
      },
      include: {
        sponsor: {
          select: {
            id: true,
            companyName: true,
          },
        },
        athlete: {
          select: {
            id: true,
            name: true,
            cpf: true,
          },
        },
      },
    });
  }

  private async ensureQuotaCapacity(quotaId: string, sponsorId: string) {
    const quota = await this.prisma.sponsorshipQuota.findUnique({
      where: { id: quotaId },
      include: {
        sponsors: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    if (!quota) {
      throw new BadRequestException('Cota de patrocinio invalida');
    }

    const occupiedSlots = quota.sponsors.filter(
      (sponsor) =>
        sponsor.id !== sponsorId &&
        ['pending', 'active'].includes(sponsor.status),
    ).length;

    if (occupiedSlots >= quota.maxSlots) {
      throw new BadRequestException('Esta cota nao possui vagas disponiveis');
    }
  }
}

type QuotaSponsorStatus = {
  id: string;
  status: string;
};

type QuotaWithSponsors = Prisma.SponsorshipQuotaGetPayload<{
  include: {
    sponsors: {
      select: {
        id: true;
        status: true;
      };
    };
  };
}>;

type BackdropSponsor = Prisma.SponsorGetPayload<{
  include: {
    quota: {
      select: {
        level: true;
        backdropPriority: true;
      };
    };
  };
}>;

type AdminSponsor = Prisma.SponsorGetPayload<{
  include: {
    quota: {
      select: {
        id: true;
        level: true;
        price: true;
        courtesyCount: true;
      };
    };
    coupons: {
      select: {
        id: true;
      };
    };
  };
}>;

type AdminCoupon = Prisma.CouponGetPayload<{
  include: {
    sponsor: {
      select: {
        id: true;
        companyName: true;
      };
    };
    athlete: {
      select: {
        id: true;
        name: true;
        cpf: true;
      };
    };
  };
}>;

type SponsorPortalCouponWithAthlete = Prisma.CouponGetPayload<{
  include: {
    athlete: {
      select: {
        id: true;
        name: true;
        cpf: true;
      };
    };
  };
}>;
