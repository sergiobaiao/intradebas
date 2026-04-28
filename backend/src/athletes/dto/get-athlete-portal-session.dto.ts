import { IsNotEmpty, IsString } from 'class-validator';

export class GetAthletePortalSessionDto {
  @IsString()
  @IsNotEmpty()
  token!: string;
}
