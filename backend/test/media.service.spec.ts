import { NotFoundException } from '@nestjs/common';
import { MediaStorageService } from '../src/media/media-storage.service';
import { MediaService } from '../src/media/media.service';
import { createPrismaMock } from './helpers';

describe('MediaService', () => {
  const prisma = createPrismaMock();
  const mediaStorage = {
    uploadObject: jest.fn(),
    getObject: jest.fn(),
    deleteObject: jest.fn(),
  } as unknown as MediaStorageService;
  const service = new MediaService(prisma as any, mediaStorage);

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

  it('returns paginated media with provider and featured filters', async () => {
    prisma.media.count.mockResolvedValue(2);
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

    const result = await service.findPage({
      page: '1',
      pageSize: '10',
      provider: 'local',
      featured: 'true',
    });

    expect(prisma.media.count).toHaveBeenCalledWith({
      where: {
        provider: 'local',
        isFeatured: true,
      },
    });
    expect(prisma.media.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          provider: 'local',
          isFeatured: true,
        },
        skip: 0,
        take: 10,
      }),
    );
    expect(result.total).toBe(2);
    expect(result.items).toHaveLength(1);
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

  it('creates a local uploaded media item', async () => {
    (mediaStorage.uploadObject as jest.Mock).mockResolvedValue({
      key: 'arquivo.jpg',
      url: '/api/v1/media/files/arquivo.jpg',
    });
    prisma.media.create.mockResolvedValue({
      id: 'media-3',
      type: 'photo',
      title: 'arquivo.jpg',
      url: '/api/v1/media/files/arquivo.jpg',
      thumbnailUrl: '/api/v1/media/files/arquivo.jpg',
      provider: 'local',
      isFeatured: true,
      sortOrder: 3,
      createdAt: new Date('2026-04-22T12:00:00Z'),
      uploader: {
        id: 'user-1',
        name: 'Admin',
        email: 'admin@intradebas.local',
      },
    });

    const result = await service.createUploaded(
      {
        title: 'arquivo.jpg',
        isFeatured: true,
        sortOrder: 3,
      },
      {
        buffer: Buffer.from('image-bytes'),
        mimetype: 'image/jpeg',
        originalname: 'arquivo.jpg',
      },
      'user-1',
    );

    expect(prisma.media.create).toHaveBeenCalledWith({
      data: {
        type: 'photo',
        title: 'arquivo.jpg',
        url: '/api/v1/media/files/arquivo.jpg',
        thumbnailUrl: '/api/v1/media/files/arquivo.jpg',
        provider: 'local',
        isFeatured: true,
        sortOrder: 3,
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
    expect(result.url).toContain('/api/v1/media/files/');
  });

  it('updates a media item when it exists', async () => {
    prisma.media.findUnique.mockResolvedValue({ id: 'media-1' });
    prisma.media.update.mockResolvedValue({
      id: 'media-1',
      type: 'photo',
      title: 'Abertura oficial',
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
      title: 'Abertura oficial',
      isFeatured: true,
      sortOrder: 4,
    });

    expect(prisma.media.update).toHaveBeenCalledWith({
      where: { id: 'media-1' },
      data: {
        title: 'Abertura oficial',
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

  it('deletes a local media item and removes the stored object', async () => {
    prisma.media.findUnique.mockResolvedValue({
      id: 'media-1',
      provider: 'local',
      url: '/api/v1/media/files/arquivo.jpg',
    });
    prisma.media.delete.mockResolvedValue({ id: 'media-1' });

    const result = await service.remove('media-1');

    expect(mediaStorage.deleteObject).toHaveBeenCalledWith('arquivo.jpg');
    expect(prisma.media.delete).toHaveBeenCalledWith({
      where: { id: 'media-1' },
    });
    expect(result).toEqual({
      id: 'media-1',
      deleted: true,
    });
  });

  it('deletes a remote media item without storage cleanup', async () => {
    prisma.media.findUnique.mockResolvedValue({
      id: 'media-2',
      provider: 'youtube',
      url: 'https://youtube.com/watch?v=123',
    });
    prisma.media.delete.mockResolvedValue({ id: 'media-2' });

    await service.remove('media-2');

    expect(mediaStorage.deleteObject).not.toHaveBeenCalled();
    expect(prisma.media.delete).toHaveBeenCalledWith({
      where: { id: 'media-2' },
    });
  });

  it('throws when media item is missing', async () => {
    prisma.media.findUnique.mockResolvedValue(null);

    await expect(service.update('missing', { sortOrder: 1 })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('throws when deleting a missing media item', async () => {
    prisma.media.findUnique.mockResolvedValue(null);

    await expect(service.remove('missing')).rejects.toBeInstanceOf(NotFoundException);
  });
});
