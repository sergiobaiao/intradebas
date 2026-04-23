import { SportCategory } from '@prisma/client';
import { IsEnum, IsInt, Min } from 'class-validator';

export class CreateScoringConfigDto {
  @IsEnum(SportCategory)
  category!: SportCategory;

  @IsInt()
  @Min(1)
  position!: number;

  @IsInt()
  @Min(0)
  points!: number;
}
