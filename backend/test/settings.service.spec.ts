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
});
