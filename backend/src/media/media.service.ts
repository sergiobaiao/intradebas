import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { CreateUploadedMediaDto } from './dto/create-uploaded-media.dto';
import { MediaStorageService } from './media-storage.service';
import { UpdateMediaDto } from './dto/update-media.dto';

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaStorage: MediaStorageService,
  ) {}

  async findAll() {
    return this.prisma.media.findMany({
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
  }

  async create(dto: CreateMediaDto, uploadedBy: string) {
    return this.prisma.media.create({
      data: {
        type: dto.type,
        title: dto.title,
        url: dto.url,
        thumbnailUrl: dto.thumbnailUrl,
        provider: dto.provider,
        isFeatured: dto.isFeatured,
        sortOrder: dto.sortOrder,
        uploadedBy,
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
  }

  async createUploaded(
    dto: CreateUploadedMediaDto,
    file: { buffer: Buffer; mimetype: string; originalname?: string },
    uploadedBy: string,
  ) {
    const type = file.mimetype.startsWith('video/') ? 'video' : 'photo';
    const stored = await this.mediaStorage.uploadObject(file);

    return this.prisma.media.create({
      data: {
        type,
        title: dto.title ?? file.originalname ?? stored.key,
        url: stored.url,
        thumbnailUrl: type === 'photo' ? stored.url : undefined,
        provider: 'local',
        isFeatured: dto.isFeatured,
        sortOrder: dto.sortOrder,
        uploadedBy,
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
  }

  async update(id: string, dto: UpdateMediaDto) {
    const media = await this.prisma.media.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!media) {
      throw new NotFoundException('Midia nao encontrada');
    }

    return this.prisma.media.update({
      where: { id },
      data: {
        title: dto.title,
        isFeatured: dto.isFeatured,
        sortOrder: dto.sortOrder,
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
  }

  async remove(id: string) {
    const media = await this.prisma.media.findUnique({
      where: { id },
      select: {
        id: true,
        provider: true,
        url: true,
      },
    });

    if (!media) {
      throw new NotFoundException('Midia nao encontrada');
    }

    if (media.provider === 'local') {
      const key = this.extractStoredFileKey(media.url);

      if (key) {
        await this.mediaStorage.deleteObject(key);
      }
    }

    await this.prisma.media.delete({
      where: { id },
    });

    return {
      id,
      deleted: true,
    };
  }

  async getStoredFile(key: string) {
    return this.mediaStorage.getObject(key);
  }

  private extractStoredFileKey(url: string) {
    const prefix = '/api/v1/media/files/';

    if (!url.startsWith(prefix)) {
      return null;
    }

    return url.slice(prefix.length);
  }
}
