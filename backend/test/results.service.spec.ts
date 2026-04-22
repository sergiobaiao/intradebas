import { BadRequestException, NotFoundException } from '@nestjs/common';
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
});
