import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateResultDto {
  @IsOptional()
  @IsString()
  sportId?: string;

  @IsOptional()
  @IsString()
  teamId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  position?: number;

  @IsOptional()
  @IsNumber()
  rawScore?: number;

  @IsOptional()
  @IsDateString()
  resultDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
