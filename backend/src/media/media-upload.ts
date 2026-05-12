import { BadRequestException } from '@nestjs/common';

export const MAX_MEDIA_UPLOAD_SIZE = 20 * 1024 * 1024;
export const ALLOWED_MEDIA_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/quicktime',
] as const;

export function isAllowedMediaMimeType(mimetype?: string | null) {
  return Boolean(mimetype && ALLOWED_MEDIA_MIME_TYPES.includes(mimetype as (typeof ALLOWED_MEDIA_MIME_TYPES)[number]));
}

export function assertValidMediaUpload(file?: {
  mimetype?: string | null;
  size?: number | null;
  buffer?: Buffer | null;
}) {
  if (!isAllowedMediaMimeType(file?.mimetype)) {
    throw new BadRequestException('Tipo de arquivo nao permitido');
  }

  const byteLength = file?.size ?? file?.buffer?.byteLength ?? 0;

  if (byteLength > MAX_MEDIA_UPLOAD_SIZE) {
    throw new BadRequestException('Arquivo excede o tamanho maximo');
  }
}
