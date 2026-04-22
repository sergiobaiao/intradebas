import { IsHexColor, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsHexColor()
  color?: string;
}
