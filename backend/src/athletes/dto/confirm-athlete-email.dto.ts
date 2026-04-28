import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmAthleteEmailDto {
  @IsString()
  @IsNotEmpty()
  token!: string;
}
