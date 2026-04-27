import { IsNotEmpty, IsString } from 'class-validator';

export class GetSponsorPortalSessionDto {
  @IsString()
  @IsNotEmpty()
  token!: string;
}
