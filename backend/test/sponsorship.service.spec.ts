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
});

