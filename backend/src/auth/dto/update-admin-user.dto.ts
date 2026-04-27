import { IsBoolean, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

const adminRoles = ['admin', 'superadmin'] as const;

export class UpdateAdminUserDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsEnum(adminRoles)
  role?: (typeof adminRoles)[number];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
