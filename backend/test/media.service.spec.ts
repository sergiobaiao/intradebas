import { NotFoundException } from '@nestjs/common';
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

  it('creates a media item with uploader context', async () => {
    prisma.media.create.mockResolvedValue({
      id: 'media-2',
      type: 'video',
      title: 'Cerimonia',
      url: 'https://example.com/cerimonia',
      thumbnailUrl: 'https://example.com/thumb.jpg',
      provider: 'youtube',
      isFeatured: false,
      sortOrder: 2,
      createdAt: new Date('2026-04-21T12:00:00Z'),
      uploader: {
        id: 'user-1',
        name: 'Admin',
        email: 'admin@intradebas.local',
      },
    });

    const result = await service.create(
      {
        type: 'video',
        title: 'Cerimonia',
        url: 'https://example.com/cerimonia',
        thumbnailUrl: 'https://example.com/thumb.jpg',
        provider: 'youtube',
        isFeatured: false,
        sortOrder: 2,
      },
      'user-1',
    );

    expect(prisma.media.create).toHaveBeenCalledWith({
      data: {
        type: 'video',
        title: 'Cerimonia',
        url: 'https://example.com/cerimonia',
        thumbnailUrl: 'https://example.com/thumb.jpg',
        provider: 'youtube',
        isFeatured: false,
        sortOrder: 2,
        uploadedBy: 'user-1',
      },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    expect(result.uploader.name).toBe('Admin');
  });

  it('updates a media item when it exists', async () => {
    prisma.media.findUnique.mockResolvedValue({ id: 'media-1' });
    prisma.media.update.mockResolvedValue({
      id: 'media-1',
      type: 'photo',
      title: 'Abertura',
      url: 'https://example.com/opening.jpg',
      thumbnailUrl: null,
      provider: 'local',
      isFeatured: true,
      sortOrder: 4,
      createdAt: new Date('2026-04-19T12:00:00Z'),
      uploader: {
        id: 'user-1',
        name: 'Admin',
        email: 'admin@intradebas.local',
      },
    });

    const result = await service.update('media-1', {
      isFeatured: true,
      sortOrder: 4,
    });

    expect(prisma.media.update).toHaveBeenCalledWith({
      where: { id: 'media-1' },
      data: {
        isFeatured: true,
        sortOrder: 4,
      },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    expect(result.isFeatured).toBe(true);
    expect(result.sortOrder).toBe(4);
  });

  it('throws when media item is missing', async () => {
    prisma.media.findUnique.mockResolvedValue(null);

    await expect(service.update('missing', { sortOrder: 1 })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
