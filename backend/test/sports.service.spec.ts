import { NotFoundException } from '@nestjs/common';
import { SportsService } from '../src/sports/sports.service';
import { createPrismaMock } from './helpers';

describe('SportsService', () => {
  const prisma = createPrismaMock();
  const service = new SportsService(prisma as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns a sport detail with associated results', async () => {
    prisma.sport.findUnique.mockResolvedValue({
      id: 'sport-1',
      name: 'Futsal',
      category: 'coletiva',
      description: null,
      isAldebarun: false,
      isActive: true,
      scheduleDate: null,
      scheduleNotes: null,
      createdAt: new Date('2026-04-20T00:00:00Z'),
      updatedAt: new Date('2026-04-20T00:00:00Z'),
      results: [
        {
          id: 'result-1',
          position: 1,
          calculatedPoints: 5,
          resultDate: new Date('2026-04-20T10:00:00Z'),
          team: { id: 'team-1', name: 'Mucura', color: '#E63946', totalScore: 0 },
        },
      ],
    });

    const result = await service.findOne('sport-1');

    expect(result.id).toBe('sport-1');
    expect(result.results).toHaveLength(1);
  });

  it('throws when sport detail is missing', async () => {
    prisma.sport.findUnique.mockResolvedValue(null);

    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
