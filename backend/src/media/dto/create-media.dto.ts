import { MediaProvider, MediaType } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class CreateMediaDto {
  @IsEnum(MediaType)
  type!: MediaType;

  @IsOptional()
  @IsString()
  title?: string;

  @IsUrl()
  url!: string;

  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @IsEnum(MediaProvider)
  provider!: MediaProvider;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
