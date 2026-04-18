import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateResultDto {
  @IsString()
  @IsNotEmpty()
  sportId!: string;

  @IsString()
  @IsNotEmpty()
  teamId!: string;

  @IsInt()
  @Min(1)
  position!: number;

  @IsOptional()
  @IsNumber()
  rawScore?: number;

  @IsDateString()
  resultDate!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

