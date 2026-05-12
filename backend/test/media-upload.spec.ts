import { BadRequestException } from '@nestjs/common';
import {
  assertValidMediaUpload,
  isAllowedMediaMimeType,
  MAX_MEDIA_UPLOAD_SIZE,
} from '../src/media/media-upload';

describe('media upload policy', () => {
  it('accepts configured mime types', () => {
    expect(isAllowedMediaMimeType('image/jpeg')).toBe(true);
    expect(isAllowedMediaMimeType('video/mp4')).toBe(true);
  });

  it('rejects invalid mime types', () => {
    expect(() =>
      assertValidMediaUpload({
        mimetype: 'application/x-msdownload',
        size: 1024,
      }),
    ).toThrow(BadRequestException);
  });

  it('rejects files larger than 20 MB', () => {
    expect(() =>
      assertValidMediaUpload({
        mimetype: 'image/png',
        size: MAX_MEDIA_UPLOAD_SIZE + 1,
      }),
    ).toThrow(BadRequestException);
  });
});
