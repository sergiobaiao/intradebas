import { BadRequestException, NotFoundException } from '@nestjs/common';
import { LgpdService } from '../src/lgpd/lgpd.service';
import { createPrismaMock } from './helpers';

describe('LgpdService', () => {
  const prisma = createPrismaMock();
  const service = new LgpdService(prisma as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a deletion request and links the athlete when the CPF exists', async () => {
    prisma.$queryRaw.mockResolvedValueOnce([]);
    prisma.athlete.findUnique.mockResolvedValue({ id: 'ath-1' });
    prisma.$queryRaw.mockResolvedValueOnce([
      {
        id: 'req-1',
        athleteId: 'ath-1',
        athleteCpf: '123.456.789-00',
        requesterName: 'Atleta 1',
        email: 'atleta@example.com',
        phone: '86999990000',
        reason: 'Solicito exclusao dos dados apos o evento',
        status: 'pending',
        adminNotes: null,
        requestedAt: new Date('2026-04-24T12:00:00.000Z'),
        updatedAt: new Date('2026-04-24T12:00:00.000Z'),
        reviewedBy: null,
        reviewedAt: null,
      },
    ]);
    prisma.athlete.findMany.mockResolvedValue([
      {
        id: 'ath-1',
        name: 'Atleta 1',
        status: 'active',
        team: {
          id: 'team-1',
          name: 'Mucura',
        },
      },
    ]);
    prisma.user.findMany.mockResolvedValue([]);

    const result = await service.createDeletionRequest({
      athleteCpf: '123.456.789-00',
      requesterName: 'Atleta 1',
      email: 'atleta@example.com',
      phone: '86999990000',
      reason: 'Solicito exclusao dos dados apos o evento',
    });

    expect(prisma.$queryRaw).toHaveBeenCalledTimes(2);
    expect(result.id).toBe('req-1');
  });

  it('rejects a new request when another one is already in progress', async () => {
    prisma.$queryRaw.mockResolvedValueOnce([{ id: 'req-1' }]);

    await expect(
      service.createDeletionRequest({
        athleteCpf: '123.456.789-00',
        requesterName: 'Atleta 1',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('lists deletion requests filtered by status', async () => {
    prisma.$queryRaw.mockResolvedValueOnce([
      {
        id: 'req-1',
        athleteId: null,
        athleteCpf: '123.456.789-00',
        requesterName: 'Atleta 1',
        email: null,
        phone: null,
        reason: null,
        status: 'pending',
        adminNotes: null,
        requestedAt: new Date('2026-04-24T12:00:00.000Z'),
        updatedAt: new Date('2026-04-24T12:00:00.000Z'),
        reviewedBy: null,
        reviewedAt: null,
      },
    ]);
    prisma.athlete.findMany.mockResolvedValue([]);
    prisma.user.findMany.mockResolvedValue([]);

    const result = await service.listDeletionRequests('pending');

    expect(prisma.$queryRaw).toHaveBeenCalled();
    expect(result).toHaveLength(1);
  });

  it('updates request status and writes audit rows', async () => {
    prisma.$queryRaw
      .mockResolvedValueOnce([
        {
          id: 'req-1',
          athleteId: null,
          athleteCpf: '123.456.789-00',
          requesterName: 'Atleta 1',
          email: null,
          phone: null,
          reason: null,
          status: 'pending',
          adminNotes: null,
          requestedAt: new Date('2026-04-24T12:00:00.000Z'),
          updatedAt: new Date('2026-04-24T12:00:00.000Z'),
          reviewedBy: null,
          reviewedAt: null,
        },
      ])
      .mockResolvedValueOnce([
        {
          id: 'req-1',
          athleteId: null,
          athleteCpf: '123.456.789-00',
          requesterName: 'Atleta 1',
          email: null,
          phone: null,
          reason: null,
          status: 'in_review',
          adminNotes: 'Validacao inicial recebida',
          requestedAt: new Date('2026-04-24T12:00:00.000Z'),
          updatedAt: new Date('2026-04-24T12:10:00.000Z'),
          reviewedBy: 'admin-1',
          reviewedAt: new Date('2026-04-24T12:10:00.000Z'),
        },
      ]);
    prisma.athlete.findMany.mockResolvedValue([]);
    prisma.user.findMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        {
          id: 'admin-1',
          name: 'Admin',
          email: 'admin@intradebas.local',
        },
      ]);

    const result = await service.updateDeletionRequest(
      'req-1',
      {
        status: 'in_review',
        adminNotes: 'Validacao inicial recebida',
      },
      'admin-1',
    );

    expect(result.status).toBe('in_review');
    expect(prisma.auditLog.createMany).toHaveBeenCalled();
  });

  it('throws when updating a missing request', async () => {
    prisma.$queryRaw.mockResolvedValueOnce([]);
    prisma.athlete.findMany.mockResolvedValue([]);
    prisma.user.findMany.mockResolvedValue([]);

    await expect(
      service.updateDeletionRequest(
        'missing',
        {
          status: 'resolved',
        },
        'admin-1',
      ),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
