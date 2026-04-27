import { BadRequestException, NotFoundException } from '@nestjs/common';
import { firstValueFrom, take } from 'rxjs';
import { ResultsService } from '../src/results/results.service';
import { createPrismaMock } from './helpers';

describe('ResultsService', () => {
  const prisma = createPrismaMock();
  const service = new ResultsService(prisma as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('aggregates ranking totals by team and sorts descending', async () => {
    prisma.result.groupBy.mockResolvedValue([
      {
        teamId: 'team-1',
        _sum: {
          calculatedPoints: 8,
        },
      },
      {
        teamId: 'team-2',
        _sum: {
          calculatedPoints: 2,
        },
      },
    ]);
    prisma.team.findMany.mockResolvedValue([
      {
        id: 'team-1',
        name: 'Mucura',
        color: '#E63946',
      },
      {
        id: 'team-2',
        name: 'Jacare',
        color: '#2D6A4F',
      },
    ]);

    const ranking = await service.getRanking();

    expect(prisma.result.groupBy).toHaveBeenCalledWith({
      by: ['teamId'],
      _sum: {
        calculatedPoints: true,
      },
      where: {
        teamId: {
          not: null,
        },
      },
    });
    expect(ranking[0]).toMatchObject({ id: 'team-1', totalScore: 8 });
    expect(ranking[1]).toMatchObject({ id: 'team-2', totalScore: 2 });
  });

  it('creates a result with calculated points from scoring config', async () => {
    prisma.sport.findUnique.mockResolvedValue({
      id: 'sport-1',
      category: 'coletiva',
    });
    prisma.team.findUnique.mockResolvedValue({ id: 'team-1' });
    prisma.scoringConfig.findFirst.mockResolvedValue({ points: 5 });
    prisma.result.create.mockResolvedValue({
      id: 'result-1',
      sportId: 'sport-1',
      teamId: 'team-1',
      position: 1,
      calculatedPoints: 5,
      resultDate: new Date('2026-04-18T00:00:00Z'),
      sport: { id: 'sport-1', name: 'Futsal', category: 'coletiva' },
      team: { id: 'team-1', name: 'Mucura', color: '#E63946', totalScore: 0 },
    });

    const result = await service.createResult(
      {
        sportId: 'sport-1',
        teamId: 'team-1',
        position: 1,
        resultDate: '2026-04-18T00:00:00Z',
      },
      'admin-1',
    );

    expect(prisma.result.create).toHaveBeenCalled();
    expect(result.calculatedPoints).toBe(5);
  });

  it('streams the ranking payload for SSE consumers', async () => {
    prisma.result.groupBy.mockResolvedValue([
      {
        teamId: 'team-1',
        _sum: {
          calculatedPoints: 5,
        },
      },
    ]);
    prisma.team.findMany.mockResolvedValue([
      {
        id: 'team-1',
        name: 'Mucura',
        color: '#E63946',
      },
    ]);

    const event = await firstValueFrom(service.streamRanking(1).pipe(take(1)));

    expect(event).toEqual({
      data: [{ id: 'team-1', name: 'Mucura', color: '#E63946', totalScore: 5 }],
    });
  });

  it('lists ALDEBARUN results for the public race ranking', async () => {
    prisma.result.findMany.mockResolvedValue([
      {
        id: 'result-1',
        position: 1,
        rawScore: 1480,
        calculatedPoints: 3,
        resultDate: new Date('2026-05-01T09:00:00Z'),
        notes: 'Percurso principal',
        sport: {
          id: 'sport-2',
          name: 'ALDEBARUN 5K',
          category: 'individual',
          description: 'Corrida da familia',
          scheduleDate: new Date('2026-05-01T07:00:00Z'),
          scheduleNotes: 'Arena central',
        },
        team: {
          id: 'team-1',
          name: 'Mucura',
          color: '#E63946',
          totalScore: 0,
        },
      },
    ]);

    const result = await service.listAldebarunResults();

    expect(prisma.result.findMany).toHaveBeenCalledWith({
      where: {
        sport: {
          isAldebarun: true,
          isActive: true,
        },
      },
      select: {
        id: true,
        position: true,
        rawScore: true,
        calculatedPoints: true,
        resultDate: true,
        notes: true,
        sport: {
          select: {
            id: true,
            name: true,
            category: true,
            description: true,
            scheduleDate: true,
            scheduleNotes: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
            color: true,
            totalScore: true,
          },
        },
      },
      orderBy: [
        { sport: { name: 'asc' } },
        { position: 'asc' },
        { rawScore: 'asc' },
        { resultDate: 'desc' },
      ],
    });
    expect(result[0].sport.name).toBe('ALDEBARUN 5K');
  });

  it('creates results in bulk within a transaction', async () => {
    prisma.$transaction.mockImplementation(async (callback: any) =>
      callback({
        sport: {
          findUnique: jest
            .fn()
            .mockResolvedValue({ id: 'sport-1', category: 'coletiva' }),
        },
        team: {
          findUnique: jest.fn().mockResolvedValue({ id: 'team-1' }),
        },
        scoringConfig: {
          findFirst: jest.fn().mockResolvedValue({ points: 5 }),
        },
        result: {
          create: jest
            .fn()
            .mockResolvedValueOnce({
              id: 'result-1',
              sportId: 'sport-1',
              teamId: 'team-1',
              position: 1,
              calculatedPoints: 5,
              resultDate: new Date('2026-04-18T00:00:00Z'),
              sport: { id: 'sport-1', name: 'Futsal', category: 'coletiva' },
              team: { id: 'team-1', name: 'Mucura', color: '#E63946', totalScore: 0 },
            })
            .mockResolvedValueOnce({
              id: 'result-2',
              sportId: 'sport-1',
              teamId: 'team-1',
              position: 2,
              calculatedPoints: 5,
              resultDate: new Date('2026-04-18T00:00:00Z'),
              sport: { id: 'sport-1', name: 'Futsal', category: 'coletiva' },
              team: { id: 'team-1', name: 'Mucura', color: '#E63946', totalScore: 0 },
            }),
        },
      }),
    );

    const result = await service.createBulkResults(
      [
        {
          sportId: 'sport-1',
          teamId: 'team-1',
          position: 1,
          resultDate: '2026-04-18T00:00:00Z',
        },
        {
          sportId: 'sport-1',
          teamId: 'team-1',
          position: 2,
          resultDate: '2026-04-18T00:00:00Z',
        },
      ],
      'admin-1',
    );

    expect(prisma.$transaction).toHaveBeenCalled();
    expect(result).toHaveLength(2);
  });

  it('rejects bulk creation without partial persistence when a row is invalid', async () => {
    prisma.$transaction.mockImplementation(async (callback: any) =>
      callback({
        sport: {
          findUnique: jest
            .fn()
            .mockResolvedValueOnce({ id: 'sport-1', category: 'coletiva' })
            .mockResolvedValueOnce(null),
        },
        team: {
          findUnique: jest.fn().mockResolvedValue({ id: 'team-1' }),
        },
        scoringConfig: {
          findFirst: jest.fn().mockResolvedValue({ points: 5 }),
        },
        result: {
          create: jest.fn().mockResolvedValue({
            id: 'result-1',
          }),
        },
      }),
    );

    await expect(
      service.createBulkResults(
        [
          {
            sportId: 'sport-1',
            teamId: 'team-1',
            position: 1,
            resultDate: '2026-04-18T00:00:00Z',
          },
          {
            sportId: 'missing',
            teamId: 'team-1',
            position: 2,
            resultDate: '2026-04-18T00:00:00Z',
          },
        ],
        'admin-1',
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects invalid sport on result creation', async () => {
    prisma.sport.findUnique.mockResolvedValue(null);

    await expect(
      service.createResult(
        {
          sportId: 'missing',
          teamId: 'team-1',
          position: 1,
          resultDate: '2026-04-18T00:00:00Z',
        },
        'admin-1',
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('updates a result and recalculates points from scoring config', async () => {
    prisma.result.findUnique.mockResolvedValue({
      id: 'result-1',
      sportId: 'sport-1',
      teamId: 'team-1',
      position: 3,
      rawScore: 10,
      resultDate: new Date('2026-04-18T00:00:00Z'),
      notes: 'Antes',
    });
    prisma.sport.findUnique.mockResolvedValue({
      id: 'sport-1',
      category: 'coletiva',
    });
    prisma.team.findUnique.mockResolvedValue({ id: 'team-2' });
    prisma.scoringConfig.findFirst.mockResolvedValue({ points: 3 });
    prisma.$transaction.mockImplementation(async (callback: any) =>
      callback({
        result: {
          update: jest.fn().mockResolvedValue({
            id: 'result-1',
            sportId: 'sport-1',
            teamId: 'team-2',
            position: 2,
            calculatedPoints: 3,
            resultDate: new Date('2026-04-19T00:00:00Z'),
            sport: { id: 'sport-1', name: 'Futsal', category: 'coletiva' },
            team: { id: 'team-2', name: 'Jacare', color: '#2D6A4F', totalScore: 0 },
          }),
        },
        resultAuditLog: {
          createMany: jest.fn().mockResolvedValue({ count: 4 }),
        },
      }),
    );

    const result = await service.updateResult(
      'result-1',
      {
        teamId: 'team-2',
        position: 2,
        resultDate: '2026-04-19T00:00:00Z',
      },
      'admin-1',
    );

    expect(prisma.$transaction).toHaveBeenCalled();
    expect(result.calculatedPoints).toBe(3);
  });

  it('rejects result update when the result does not exist', async () => {
    prisma.result.findUnique.mockResolvedValue(null);

    await expect(
      service.updateResult(
        'missing',
        {
          position: 1,
        },
        'admin-1',
      ),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('does not create audit rows when an update keeps the same values', async () => {
    prisma.result.findUnique.mockResolvedValue({
      id: 'result-1',
      sportId: 'sport-1',
      teamId: 'team-1',
      position: 1,
      rawScore: 12,
      resultDate: new Date('2026-04-19T00:00:00Z'),
      notes: 'Sem mudanca',
    });
    prisma.sport.findUnique.mockResolvedValue({
      id: 'sport-1',
      category: 'coletiva',
    });
    prisma.team.findUnique.mockResolvedValue({ id: 'team-1' });
    prisma.scoringConfig.findFirst.mockResolvedValue({ points: 5 });

    const auditCreateMany = jest.fn();
    prisma.$transaction.mockImplementation(async (callback: any) =>
      callback({
        result: {
          update: jest.fn().mockResolvedValue({
            id: 'result-1',
            sportId: 'sport-1',
            teamId: 'team-1',
            position: 1,
            calculatedPoints: 5,
            resultDate: new Date('2026-04-19T00:00:00Z'),
            sport: { id: 'sport-1', name: 'Futsal', category: 'coletiva' },
            team: { id: 'team-1', name: 'Mucura', color: '#E63946', totalScore: 0 },
          }),
        },
        resultAuditLog: {
          createMany: auditCreateMany,
        },
      }),
    );

    await service.updateResult(
      'result-1',
      {
        teamId: 'team-1',
        position: 1,
        resultDate: '2026-04-19T00:00:00Z',
        rawScore: 12,
        notes: 'Sem mudanca',
      },
      'admin-1',
    );

    expect(auditCreateMany).not.toHaveBeenCalled();
  });

  it('lists recent audit logs in reverse chronological order', async () => {
    prisma.resultAuditLog.findMany.mockResolvedValue([
      {
        id: 'audit-1',
        fieldChanged: 'position',
        oldValue: '3',
        newValue: '2',
        changedAt: new Date('2026-04-19T12:00:00Z'),
        changer: {
          id: 'admin-1',
          name: 'Administrador',
          email: 'admin@intradebas.local',
        },
        result: {
          id: 'result-1',
          sport: { id: 'sport-1', name: 'Futsal' },
          team: { id: 'team-1', name: 'Mucura' },
        },
      },
    ]);

    const auditLogs = await service.listAuditLogs();

    expect(prisma.resultAuditLog.findMany).toHaveBeenCalledWith({
      include: {
        changer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        result: {
          select: {
            id: true,
            sport: {
              select: {
                id: true,
                name: true,
              },
            },
            team: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        changedAt: 'desc',
      },
      take: 20,
    });
    expect(auditLogs).toHaveLength(1);
  });

  it('returns paginated admin results with filters', async () => {
    prisma.result.count.mockResolvedValue(3);
    prisma.result.findMany.mockResolvedValue([
      {
        id: 'result-1',
        position: 1,
        rawScore: 10,
        calculatedPoints: 5,
        resultDate: new Date('2026-04-20T10:00:00Z'),
        notes: null,
        sport: { id: 'sport-1', name: 'Futsal', category: 'coletiva' },
        team: { id: 'team-1', name: 'Mucura', color: '#E63946', totalScore: 10 },
      },
    ]);

    const result = await service.listAdminResults({
      page: '1',
      pageSize: '10',
      teamId: 'team-1',
      sportId: 'sport-1',
    });

    expect(prisma.result.count).toHaveBeenCalledWith({
      where: {
        teamId: 'team-1',
        sportId: 'sport-1',
      },
    });
    expect(prisma.result.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          teamId: 'team-1',
          sportId: 'sport-1',
        },
        skip: 0,
        take: 10,
      }),
    );
    expect(result.total).toBe(3);
    expect(result.items).toHaveLength(1);
  });
});
