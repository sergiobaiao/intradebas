import { BadRequestException, Injectable } from '@nestjs/common';
import { CouponStatus, Prisma, SponsorStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSponsorDto } from './dto/update-sponsor.dto';

@Injectable()
export class SponsorshipService {
  constructor(private readonly prisma: PrismaService) {}

  private generateCouponCode(level: string) {
    const randomPart = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
    return `${level.toUpperCase()}-${randomPart}`;
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

  async activateSponsor(sponsorId: string) {
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

    return {
      id: created.id,
      status: created.status,
      couponsGenerated: created.coupons.length,
    };
  }

  async updateSponsor(sponsorId: string, input: UpdateSponsorDto) {
    const sponsor = await this.prisma.sponsor.findUnique({
      where: { id: sponsorId },
      select: { id: true },
    });

    if (!sponsor) {
      throw new BadRequestException('Patrocinador invalido');
    }

    if (input.quotaId) {
      const quota = await this.prisma.sponsorshipQuota.findUnique({
        where: { id: input.quotaId },
        select: { id: true },
      });

      if (!quota) {
        throw new BadRequestException('Cota de patrocinio invalida');
      }
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
          },
        },
      },
    });

    if (!sponsor) {
      throw new BadRequestException('Patrocinador invalido');
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
