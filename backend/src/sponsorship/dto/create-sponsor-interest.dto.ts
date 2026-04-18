import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSponsorInterestDto {
  @IsString()
  @IsNotEmpty()
  companyName!: string;

  @IsString()
  @IsNotEmpty()
  contactName!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  quotaId!: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;
}

