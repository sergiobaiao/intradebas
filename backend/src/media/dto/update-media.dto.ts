import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export class UpdateMediaDto {
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
