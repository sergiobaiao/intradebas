import { IsEnum, IsOptional, IsString } from 'class-validator';

const lgpdRequestStatuses = ['pending', 'in_review', 'resolved', 'rejected'] as const;

export class UpdateLgpdDeletionRequestDto {
  @IsOptional()
  @IsEnum(lgpdRequestStatuses)
  status?: (typeof lgpdRequestStatuses)[number];

  @IsOptional()
  @IsString()
  adminNotes?: string;
}
