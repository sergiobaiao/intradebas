import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

const athleteTypes = ['titular', 'familiar', 'convidado'] as const;
const shirtSizes = ['PP', 'P', 'M', 'G', 'GG', 'XGG'] as const;

export class CreateAthleteDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'CPF deve estar no formato 000.000.000-00',
  })
  cpf!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsDateString()
  birthDate!: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsEnum(athleteTypes)
  type!: (typeof athleteTypes)[number];

  @IsOptional()
  @IsString()
  titularId?: string;

  @IsString()
  @IsNotEmpty()
  teamId!: string;

  @IsEnum(shirtSizes)
  shirtSize!: (typeof shirtSizes)[number];

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @Type(() => String)
  sports!: string[];

  @IsBoolean()
  lgpdConsent!: boolean;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  couponCode?: string;
}
