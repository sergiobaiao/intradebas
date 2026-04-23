import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SportCategory } from '@prisma/client';
import { SettingsService } from '../src/settings/settings.service';
import { createPrismaMock } from './helpers';

describe('SettingsService', () => {
  const prisma = createPrismaMock();
  const service = new SettingsService(prisma as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lists scoring configuration with updater context', async () => {
    prisma.scoringConfig.findMany.mockResolvedValue([
      {
        id: 'cfg-1',
        category: 'coletiva',
        position: 1,
        points: 5,
        updatedByUser: {
          id: 'user-1',
          name: 'Admin',
          email: 'admin@intradebas.local',
        },
      },
    ]);

    const result = await service.listScoringConfig();

    expect(prisma.scoringConfig.findMany).toHaveBeenCalledWith({
      include: {
        updatedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [{ category: 'asc' }, { position: 'asc' }],
    });
    expect(result[0].points).toBe(5);
  });

  it('updates a scoring config row when it exists', async () => {
    prisma.scoringConfig.findUnique.mockResolvedValue({ id: 'cfg-1' });
    prisma.scoringConfig.update.mockResolvedValue({
      id: 'cfg-1',
      category: 'coletiva',
      position: 1,
      points: 7,
      updatedByUser: {
        id: 'user-1',
        name: 'Admin',
        email: 'admin@intradebas.local',
      },
    });

    const result = await service.updateScoringConfig(
      'cfg-1',
      { points: 7 },
      'user-1',
    );

    expect(result.points).toBe(7);
  });

  it('creates a scoring config row when category and position are new', async () => {
    prisma.scoringConfig.findFirst.mockResolvedValue(null);
    prisma.scoringConfig.create.mockResolvedValue({
      id: 'cfg-2',
      category: SportCategory.dupla,
      position: 4,
      points: 1,
      updatedByUser: {
        id: 'user-1',
        name: 'Admin',
        email: 'admin@intradebas.local',
      },
    });

    const result = await service.createScoringConfig(
      { category: SportCategory.dupla, position: 4, points: 1 },
      'user-1',
    );

    expect(result).toMatchObject({
      category: 'dupla',
      position: 4,
      points: 1,
    });
  });

  it('rejects duplicate scoring config rows', async () => {
    prisma.scoringConfig.findFirst.mockResolvedValue({ id: 'cfg-1' });

    await expect(
      service.createScoringConfig(
        { category: SportCategory.coletiva, position: 1, points: 5 },
        'user-1',
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws when scoring config row is missing', async () => {
    prisma.scoringConfig.findUnique.mockResolvedValue(null);

    await expect(
      service.updateScoringConfig('missing', { points: 7 }, 'user-1'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('deletes a scoring config row when it exists', async () => {
    prisma.scoringConfig.findUnique.mockResolvedValue({ id: 'cfg-1' });
    prisma.scoringConfig.delete.mockResolvedValue({ id: 'cfg-1' });

    const result = await service.deleteScoringConfig('cfg-1');

    expect(prisma.scoringConfig.delete).toHaveBeenCalledWith({
      where: { id: 'cfg-1' },
    });
    expect(result).toEqual({
      id: 'cfg-1',
      deleted: true,
    });
  });

  it('throws when deleting a missing scoring config row', async () => {
    prisma.scoringConfig.findUnique.mockResolvedValue(null);

    await expect(service.deleteScoringConfig('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
