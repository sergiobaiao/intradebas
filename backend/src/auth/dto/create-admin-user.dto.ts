import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

const adminRoles = ['admin', 'superadmin'] as const;

export class CreateAdminUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsEnum(adminRoles)
  role!: (typeof adminRoles)[number];

  @IsString()
  @MinLength(6)
  password!: string;
}
