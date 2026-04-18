import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SponsorshipService {
  constructor(private readonly prisma: PrismaService) {}

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
}

