import { BadRequestException, Injectable } from '@nestjs/common';
import { SponsorStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

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

    return quotas.map((quota) => {
      const usedSlots = quota.sponsors.filter((sponsor) =>
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

    const usedSlots = quota.sponsors.filter((sponsor) =>
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

    return sponsors.map((sponsor) => ({
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

    return sponsors.map((sponsor) => ({
      id: sponsor.id,
      companyName: sponsor.companyName,
      contactName: sponsor.contactName,
      email: sponsor.email,
      phone: sponsor.phone,
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

    return coupons.map((coupon) => ({
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

    return coupons.map((coupon) => ({
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

    const created = await this.prisma.$transaction(async (tx) => {
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
}
