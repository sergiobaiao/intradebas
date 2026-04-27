import { IsEmail } from 'class-validator';

export class RequestSponsorPortalAccessDto {
  @IsEmail()
  email!: string;
}
