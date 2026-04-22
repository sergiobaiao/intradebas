import { IsInt, Min } from 'class-validator';

export class UpdateScoringConfigDto {
  @IsInt()
  @Min(0)
  points!: number;
}
