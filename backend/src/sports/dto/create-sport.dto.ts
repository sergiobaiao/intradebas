import { SportCategory } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateSportDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEnum(SportCategory)
  category!: SportCategory;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  minParticipants?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxParticipants?: number;

  @IsOptional()
  @IsBoolean()
  isAldebarun?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDateString()
  scheduleDate?: string;

  @IsOptional()
  @IsString()
  scheduleNotes?: string;
}
