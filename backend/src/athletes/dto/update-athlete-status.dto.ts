import { IsEnum } from 'class-validator';

const athleteStatuses = ['pending', 'active', 'rejected'] as const;

export class UpdateAthleteStatusDto {
  @IsEnum(athleteStatuses)
  status!: (typeof athleteStatuses)[number];
}

