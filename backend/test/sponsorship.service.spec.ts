import { BadRequestException } from '@nestjs/common';
import { SponsorshipLevel, SponsorStatus } from '@prisma/client';
import { SponsorshipService } from '../src/sponsorship/sponsorship.service';
import { createPrismaMock } from './helpers';

describe('SponsorshipService', () => {
  const prisma = createPrismaMock();
  const service = new SponsorshipService(prisma as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('computes remaining slots from pending and active sponsors', async () => {
    prisma.sponsorshipQuota = {
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'quota-1',
          level: SponsorshipLevel.ouro,
          price: 1000,
          maxSlots: 2,
          courtesyCount: 4,
          benefits: 'Frente camisa',
          backdropPriority: 3,
          sponsors: [
            { id: 's1', status: SponsorStatus.active },
            { id: 's2', status: SponsorStatus.pending },
            { id: 's3', status: SponsorStatus.inactive },
          ],
        },
      ]),
    } as any;

    const result = await service.listQuotas();

    expect(result[0].usedSlots).toBe(2);
    expect(result[0].remainingSlots).toBe(0);
  });

  it('rejects sponsor interest for unknown quota', async () => {
    prisma.sponsorshipQuota = {
      findUnique: jest.fn().mockResolvedValue(null),
    } as any;

    await expect(
      service.createSponsorInterest({
        companyName: 'Acme',
        contactName: 'Joao',
        email: 'joao@acme.com',
        quotaId: 'missing',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('creates pending sponsor interest when slots remain', async () => {
    prisma.sponsorshipQuota = {
      findUnique: jest.fn().mockResolvedValue({
        id: 'quota-1',
        maxSlots: 4,
        sponsors: [{ id: 's1', status: SponsorStatus.active }],
      }),
    } as any;
    prisma.sponsor = {
      create: jest.fn().mockResolvedValue({
        id: 's2',
        companyName: 'Acme',
        contactName: 'Joao',
        email: 'joao@acme.com',
        phone: null,
        status: SponsorStatus.pending,
        quota: {
          id: 'quota-1',
          level: SponsorshipLevel.prata,
          price: 500,
        },
      }),
    } as any;

    const result = await service.createSponsorInterest({
      companyName: 'Acme',
      contactName: 'Joao',
      email: 'Joao@Acme.com',
      quotaId: 'quota-1',
    });

    expect(prisma.sponsor.create).toHaveBeenCalled();
    expect(result.status).toBe('pending');
    expect(result.email).toBe('joao@acme.com');
  });

  it('lists only active sponsors for the public backdrop ordered by priority', async () => {
    prisma.sponsor = {
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'sponsor-ouro',
          companyName: 'Acme Ouro',
          logoUrl: 'https://example.com/ouro.png',
          quota: {
            level: SponsorshipLevel.ouro,
            backdropPriority: 3,
          },
        },
        {
          id: 'sponsor-prata',
          companyName: 'Acme Prata',
          logoUrl: null,
          quota: {
            level: SponsorshipLevel.prata,
            backdropPriority: 2,
          },
        },
      ]),
    } as any;

    const result = await service.listBackdropSponsors();

    expect(prisma.sponsor.findMany).toHaveBeenCalledWith({
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
    expect(result).toHaveLength(2);
    expect(result[0].level).toBe('ouro');
    expect(result[1].level).toBe('prata');
  });

  it('lists sponsors with quota and coupon counts for admin visibility', async () => {
    prisma.sponsor = {
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'sponsor-1',
          companyName: 'Acme',
          contactName: 'Joao',
          email: 'joao@acme.com',
          phone: '86999999999',
          status: SponsorStatus.active,
          createdAt: new Date('2026-04-19T10:00:00Z'),
          coupons: [{ id: 'c1' }, { id: 'c2' }],
          quota: {
            id: 'quota-1',
            level: SponsorshipLevel.ouro,
            price: 1000,
            courtesyCount: 4,
          },
        },
      ]),
    } as any;

    const result = await service.listSponsors();

    expect(result[0]).toMatchObject({
      companyName: 'Acme',
      couponCount: 2,
      quota: {
        level: 'ouro',
        courtesyCount: 4,
      },
    });
  });

  it('lists coupons with sponsor and redeemed athlete context', async () => {
    prisma.coupon = {
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'coupon-1',
          code: 'OURO-AAAA1111',
          status: 'used',
          createdAt: new Date('2026-04-19T10:00:00Z'),
          redeemedAt: new Date('2026-04-19T12:00:00Z'),
          sponsor: {
            id: 'sponsor-1',
            companyName: 'Acme',
          },
          athlete: {
            id: 'athlete-1',
            name: 'Joao Silva',
            cpf: '123.456.789-00',
          },
        },
      ]),
    } as any;

    const result = await service.listCoupons();

    expect(result[0]).toMatchObject({
      code: 'OURO-AAAA1111',
      status: 'used',
      sponsor: {
        companyName: 'Acme',
      },
      athlete: {
        name: 'Joao Silva',
      },
    });
  });

  it('rejects sponsor coupon listing for unknown sponsor', async () => {
    prisma.sponsor = {
      findUnique: jest.fn().mockResolvedValue(null),
    } as any;

    await expect(service.listSponsorCoupons('missing')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('activates sponsor and generates missing courtesy coupons', async () => {
    prisma.sponsor = {
      findUnique: jest.fn().mockResolvedValue({
        id: 'sponsor-1',
        status: SponsorStatus.pending,
        quota: {
          level: SponsorshipLevel.ouro,
          courtesyCount: 2,
        },
        coupons: [],
      }),
    } as any;
    prisma.$transaction.mockImplementation(async (callback: any) =>
      callback({
        sponsor: {
          update: jest.fn().mockResolvedValue({
            id: 'sponsor-1',
            quota: {
              level: SponsorshipLevel.ouro,
            },
            coupons: [],
          }),
          findUniqueOrThrow: jest.fn().mockResolvedValue({
            id: 'sponsor-1',
            status: SponsorStatus.active,
            coupons: [{ id: 'c1' }, { id: 'c2' }],
          }),
        },
        coupon: {
          findUnique: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue({}),
        },
      }),
    );

    const result = await service.activateSponsor('sponsor-1');

    expect(prisma.$transaction).toHaveBeenCalled();
    expect(result.status).toBe('active');
    expect(result.couponsGenerated).toBe(2);
  });

  it('does not generate duplicate coupons when sponsor is already active', async () => {
    prisma.sponsor = {
      findUnique: jest.fn().mockResolvedValue({
        id: 'sponsor-1',
        status: SponsorStatus.active,
        quota: {
          level: SponsorshipLevel.prata,
          courtesyCount: 3,
        },
        coupons: [{ id: 'c1' }, { id: 'c2' }],
      }),
    } as any;

    const result = await service.activateSponsor('sponsor-1');

    expect(result.couponsGenerated).toBe(2);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});
