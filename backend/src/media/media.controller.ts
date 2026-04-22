import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { mkdirSync } from 'fs';
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
  findAll() {
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
      storage: diskStorage({
        destination: (_request: any, _file: any, callback: any) => {
          const uploadDir = join(process.cwd(), 'storage', 'media');
          mkdirSync(uploadDir, { recursive: true });
          callback(null, uploadDir);
        },
        filename: (_request: any, file: any, callback: any) => {
          const extension = extname(file.originalname);
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
          callback(null, uniqueName);
        },
      }),
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

  @Get('files/:filename')
  serveFile(@Param('filename') filename: string, @Res() response: any) {
    if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
      throw new BadRequestException('Arquivo invalido');
    }

    return response.sendFile(filename, {
      root: join(process.cwd(), 'storage', 'media'),
    });
  }
}
