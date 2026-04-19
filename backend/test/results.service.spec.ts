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
    prisma.team.findMany.mockResolvedValue([
      {
        id: 'team-1',
        name: 'Mucura',
        color: '#E63946',
        results: [{ calculatedPoints: 3 }, { calculatedPoints: 5 }],
      },
      {
        id: 'team-2',
        name: 'Jacare',
        color: '#2D6A4F',
        results: [{ calculatedPoints: 2 }],
      },
    ]);

    const ranking = await service.getRanking();

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
    });
    prisma.sport.findUnique.mockResolvedValue({
      id: 'sport-1',
      category: 'coletiva',
    });
    prisma.team.findUnique.mockResolvedValue({ id: 'team-2' });
    prisma.scoringConfig.findFirst.mockResolvedValue({ points: 3 });
    prisma.result.update.mockResolvedValue({
      id: 'result-1',
      sportId: 'sport-1',
      teamId: 'team-2',
      position: 2,
      calculatedPoints: 3,
      resultDate: new Date('2026-04-19T00:00:00Z'),
      sport: { id: 'sport-1', name: 'Futsal', category: 'coletiva' },
      team: { id: 'team-2', name: 'Jacare', color: '#2D6A4F', totalScore: 0 },
    });

    const result = await service.updateResult(
      'result-1',
      {
        teamId: 'team-2',
        position: 2,
        resultDate: '2026-04-19T00:00:00Z',
      },
      'admin-1',
    );

    expect(prisma.result.update).toHaveBeenCalled();
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
});
