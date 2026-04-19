import { MediaService } from '../src/media/media.service';
import { createPrismaMock } from './helpers';

describe('MediaService', () => {
  const prisma = createPrismaMock();
  const service = new MediaService(prisma as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lists media ordered for admin visibility', async () => {
    prisma.media.findMany.mockResolvedValue([
      {
        id: 'media-1',
        type: 'photo',
        title: 'Abertura',
        url: 'https://example.com/opening.jpg',
        thumbnailUrl: null,
        provider: 'local',
        isFeatured: true,
        sortOrder: 1,
        createdAt: new Date('2026-04-19T12:00:00Z'),
        uploader: {
          id: 'user-1',
          name: 'Admin',
          email: 'admin@intradebas.local',
        },
      },
    ]);

    const result = await service.findAll();

    expect(prisma.media.findMany).toHaveBeenCalledWith({
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    expect(result).toHaveLength(1);
  });
});
