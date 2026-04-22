import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

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
}
