import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Readable } from 'node:stream';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateMediaDto } from './dto/create-media.dto';
import { CreateUploadedMediaDto } from './dto/create-uploaded-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('provider') provider?: string,
    @Query('featured') featured?: string,
  ) {
    if (page || pageSize || provider || featured) {
      return this.mediaService.findPage({
        page,
        pageSize,
        provider,
        featured,
      });
    }

    return this.mediaService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() dto: CreateMediaDto,
    @Req() request: { user: { sub: string } },
  ) {
    return this.mediaService.create(dto, request.user.sub);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  upload(
    @Body() dto: CreateUploadedMediaDto,
    @UploadedFile() file: any,
    @Req() request: { user: { sub: string } },
  ) {
    if (!file) {
      throw new BadRequestException('Arquivo de midia e obrigatorio');
    }

    return this.mediaService.createUploaded(dto, file, request.user.sub);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateMediaDto) {
    return this.mediaService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.mediaService.remove(id);
  }

  @Get('files/:filename')
  async serveFile(@Param('filename') filename: string, @Res() response: any) {
    if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
      throw new BadRequestException('Arquivo invalido');
    }

    const stored = await this.mediaService.getStoredFile(filename);
    response.setHeader('Content-Type', stored.contentType);
    const stream = stored.body;

    if (!(stream instanceof Readable)) {
      throw new BadRequestException('Arquivo indisponivel para streaming');
    }

    return stream.pipe(response);
  }
}
