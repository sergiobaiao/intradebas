import { BadRequestException } from '@nestjs/common';
import { CouponStatus, SponsorshipLevel, SponsorStatus } from '@prisma/client';
import { MailService } from '../src/mail/mail.service';
import { SponsorshipService } from '../src/sponsorship/sponsorship.service';
import { createPrismaMock } from './helpers';

describe('SponsorshipService', () => {
  const prisma = createPrismaMock();
  const mailService = {
    sendSponsorPortalAccessEmail: jest.fn(),
  } as unknown as MailService;
  const service = new SponsorshipService(prisma as any, mailService);

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

  it('sends sponsor portal access by e-mail when sponsor exists', async () => {
    prisma.sponsor = {
      ...prisma.sponsor,
      findFirst: jest.fn().mockResolvedValue({
        id: 'sponsor-1',
        companyName: 'Acme',
        contactName: 'Joao',
        email: 'joao@acme.com',
      }),
    } as any;
    prisma.$executeRaw.mockResolvedValue(1);

    const result = await service.requestPortalAccess('JOAO@ACME.COM');

    expect(result).toEqual({ success: true });
    expect(prisma.sponsor.findFirst).toHaveBeenCalledWith({
      where: {
        email: 'joao@acme.com',
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
    expect(mailService.sendSponsorPortalAccessEmail).toHaveBeenCalled();
  });

  it('returns success without e-mailing when sponsor portal access is requested for unknown e-mail', async () => {
    prisma.sponsor = {
      ...prisma.sponsor,
      findFirst: jest.fn().mockResolvedValue(null),
    } as any;

    const result = await service.requestPortalAccess('missing@example.com');

    expect(result).toEqual({ success: true });
    expect(mailService.sendSponsorPortalAccessEmail).not.toHaveBeenCalled();
  });

  it('returns sponsor portal session with coupons for a valid token', async () => {
    prisma.$queryRaw.mockResolvedValue([
      {
        id: 'portal-token-1',
        sponsorId: 'sponsor-1',
        expiresAt: new Date(Date.now() + 60_000),
      },
    ]);
    prisma.sponsor = {
      ...prisma.sponsor,
      findUnique: jest.fn().mockResolvedValue({
        id: 'sponsor-1',
        companyName: 'Acme',
        contactName: 'Joao',
        email: 'joao@acme.com',
        phone: '86999999999',
        logoUrl: null,
        status: SponsorStatus.active,
        paymentDate: new Date('2026-04-20T12:00:00Z'),
        paymentNotes: 'Pago',
        createdAt: new Date('2026-04-19T10:00:00Z'),
        quota: {
          id: 'quota-1',
          level: SponsorshipLevel.ouro,
          price: 1000,
          courtesyCount: 4,
          benefits: 'Frente camisa',
          backdropPriority: 3,
        },
        coupons: [
          {
            id: 'coupon-1',
            code: 'OURO-AAAA1111',
            status: CouponStatus.active,
            createdAt: new Date('2026-04-19T10:00:00Z'),
            redeemedAt: null,
            athlete: null,
          },
        ],
      }),
    } as any;
    prisma.$executeRaw.mockResolvedValue(1);

    const result = await service.getPortalSession('portal-token');

    expect(result.sponsor.companyName).toBe('Acme');
    expect(result.coupons).toHaveLength(1);
    expect(prisma.$executeRaw).toHaveBeenCalled();
  });

  it('rejects expired sponsor portal token', async () => {
    prisma.$queryRaw.mockResolvedValue([
      {
        id: 'portal-token-1',
        sponsorId: 'sponsor-1',
        expiresAt: new Date(Date.now() - 60_000),
      },
    ]);

    await expect(service.getPortalSession('expired')).rejects.toBeInstanceOf(BadRequestException);
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

  it('returns paginated sponsors filtered by status', async () => {
    prisma.sponsor = {
      ...prisma.sponsor,
      count: jest.fn().mockResolvedValue(3),
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'sponsor-1',
          companyName: 'Acme',
          contactName: 'Joao',
          email: 'joao@acme.com',
          phone: '86999999999',
          logoUrl: null,
          status: SponsorStatus.active,
          createdAt: new Date('2026-04-19T10:00:00Z'),
          coupons: [{ id: 'c1' }],
          quota: {
            id: 'quota-1',
            level: SponsorshipLevel.ouro,
            price: 1000,
            courtesyCount: 4,
          },
        },
      ]),
    } as any;

    const result = await service.listSponsorsPage({
      page: '1',
      pageSize: '10',
      status: 'active',
    });

    expect(prisma.sponsor.count).toHaveBeenCalledWith({
      where: {
        status: 'active',
      },
    });
    expect(result.total).toBe(3);
    expect(result.items).toHaveLength(1);
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

  it('returns paginated coupons filtered by status and sponsor', async () => {
    prisma.coupon = {
      ...prisma.coupon,
      count: jest.fn().mockResolvedValue(4),
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'coupon-1',
          code: 'OURO-AAAA1111',
          status: 'active',
          createdAt: new Date('2026-04-19T10:00:00Z'),
          redeemedAt: null,
          sponsor: {
            id: 'sponsor-1',
            companyName: 'Acme',
          },
          athlete: null,
        },
      ]),
    } as any;

    const result = await service.listCouponsPage({
      page: '1',
      pageSize: '10',
      status: 'active',
      sponsorId: 'sponsor-1',
    });

    expect(prisma.coupon.count).toHaveBeenCalledWith({
      where: {
        status: 'active',
        sponsorId: 'sponsor-1',
      },
    });
    expect(result.total).toBe(4);
    expect(result.items).toHaveLength(1);
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
    prisma.auditLog.createMany.mockResolvedValue({ count: 2 });
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

    const result = await service.activateSponsor('sponsor-1', 'admin-1');

    expect(prisma.$transaction).toHaveBeenCalled();
    expect(prisma.auditLog.createMany).toHaveBeenCalled();
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

  it('updates sponsor operational data for admin editing', async () => {
    prisma.sponsor = {
      ...prisma.sponsor,
      findUnique: jest.fn().mockResolvedValue({
        id: 'sponsor-1',
        companyName: 'Acme',
        contactName: 'Joao',
        email: 'joao@acme.com',
        phone: '86999999999',
        logoUrl: null,
        quotaId: 'quota-1',
        status: SponsorStatus.active,
      }),
      update: jest.fn().mockResolvedValue({
        id: 'sponsor-1',
        companyName: 'Acme Atualizada',
        contactName: 'Maria Souza',
        email: 'maria@acme.com',
        phone: '86988887777',
        logoUrl: 'https://example.com/logo.png',
        status: SponsorStatus.inactive,
        createdAt: new Date('2026-04-19T10:00:00Z'),
        coupons: [{ id: 'c1' }],
        quota: {
          id: 'quota-2',
          level: SponsorshipLevel.prata,
          price: 500,
          courtesyCount: 2,
        },
      }),
    } as any;
    prisma.auditLog.createMany.mockResolvedValue({ count: 7 });
    prisma.sponsorshipQuota = {
      ...prisma.sponsorshipQuota,
      findUnique: jest.fn().mockResolvedValue({ id: 'quota-2' }),
    } as any;

    const result = await service.updateSponsor('sponsor-1', {
      companyName: 'Acme Atualizada',
      contactName: 'Maria Souza',
      email: 'Maria@Acme.com',
      phone: '86988887777',
      logoUrl: 'https://example.com/logo.png',
      quotaId: 'quota-2',
      status: SponsorStatus.inactive,
    }, 'admin-1');

    expect(prisma.sponsor.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'sponsor-1' },
        data: expect.objectContaining({
          email: 'maria@acme.com',
          quotaId: 'quota-2',
          status: SponsorStatus.inactive,
        }),
      }),
    );
    expect(prisma.auditLog.createMany).toHaveBeenCalled();
    expect(result).toMatchObject({
      companyName: 'Acme Atualizada',
      status: 'inactive',
      quota: {
        id: 'quota-2',
        level: 'prata',
      },
    });
  });

  it('rejects sponsor editing for invalid quota', async () => {
    prisma.sponsor = {
      ...prisma.sponsor,
      findUnique: jest.fn().mockResolvedValue({ id: 'sponsor-1' }),
    } as any;
    prisma.sponsorshipQuota = {
      ...prisma.sponsorshipQuota,
      findUnique: jest.fn().mockResolvedValue(null),
    } as any;

    await expect(
      service.updateSponsor('sponsor-1', {
        quotaId: 'missing',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('creates an extra coupon for a sponsor with a unique code', async () => {
    prisma.sponsor = {
      ...prisma.sponsor,
      findUnique: jest.fn().mockResolvedValue({
        id: 'sponsor-1',
        quota: {
          level: SponsorshipLevel.ouro,
        },
      }),
    } as any;
    prisma.coupon = {
      ...prisma.coupon,
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({
        id: 'coupon-1',
        code: 'OURO-ABC12345',
        status: CouponStatus.active,
        createdAt: new Date('2026-04-23T10:00:00Z'),
        redeemedAt: null,
        sponsor: {
          id: 'sponsor-1',
          companyName: 'Acme',
        },
        athlete: null,
      }),
    } as any;

    const result = await service.createCouponForSponsor('sponsor-1');

    expect(prisma.coupon.create).toHaveBeenCalled();
    expect(result.status).toBe('active');
  });

  it('expires an active coupon', async () => {
    prisma.coupon = {
      ...prisma.coupon,
      findUnique: jest.fn().mockResolvedValue({
        id: 'coupon-1',
        status: CouponStatus.active,
      }),
      update: jest.fn().mockResolvedValue({
        id: 'coupon-1',
        code: 'OURO-ABC12345',
        status: CouponStatus.expired,
        createdAt: new Date('2026-04-23T10:00:00Z'),
        redeemedAt: null,
        sponsor: {
          id: 'sponsor-1',
          companyName: 'Acme',
        },
        athlete: null,
      }),
    } as any;

    const result = await service.expireCoupon('coupon-1');

    expect(prisma.coupon.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'coupon-1' },
        data: { status: CouponStatus.expired },
      }),
    );
    expect(result.status).toBe('expired');
  });

  it('rejects coupon expiration for used coupons', async () => {
    prisma.coupon = {
      ...prisma.coupon,
      findUnique: jest.fn().mockResolvedValue({
        id: 'coupon-1',
        status: CouponStatus.used,
      }),
    } as any;

    await expect(service.expireCoupon('coupon-1')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
