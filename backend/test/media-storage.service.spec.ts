import {
  CreateBucketCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { MediaStorageService } from '../src/media/media-storage.service';

jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn(),
    HeadBucketCommand: jest.fn().mockImplementation((input) => ({ input, kind: 'head-bucket' })),
    CreateBucketCommand: jest.fn().mockImplementation((input) => ({ input, kind: 'create-bucket' })),
    PutObjectCommand: jest.fn().mockImplementation((input) => ({ input, kind: 'put-object' })),
    GetObjectCommand: jest.fn().mockImplementation((input) => ({ input, kind: 'get-object' })),
  };
});

describe('MediaStorageService', () => {
  const originalEnv = process.env;
  const sendMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      MINIO_ENDPOINT: 'minio',
      MINIO_PORT: '9000',
      MINIO_ACCESS_KEY: 'minioadmin',
      MINIO_SECRET_KEY: 'minioadmin',
      MINIO_BUCKET: 'intradebas',
    };
    (S3Client as jest.Mock).mockImplementation(() => ({ send: sendMock }));
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('creates the bucket before upload when it does not exist', async () => {
    sendMock
      .mockRejectedValueOnce(new Error('missing bucket'))
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({});

    const service = new MediaStorageService();

    const result = await service.uploadObject({
      buffer: Buffer.from('file-bytes'),
      mimetype: 'image/jpeg',
      originalname: 'foto.jpg',
    });

    expect(HeadBucketCommand).toHaveBeenCalledWith({ Bucket: 'intradebas' });
    expect(CreateBucketCommand).toHaveBeenCalledWith({ Bucket: 'intradebas' });
    expect(PutObjectCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        Bucket: 'intradebas',
        ContentType: 'image/jpeg',
      }),
    );
    expect(result.url).toMatch(/^\/api\/v1\/media\/files\//);
  });

  it('skips bucket creation when the bucket already exists', async () => {
    sendMock.mockResolvedValueOnce({}).mockResolvedValueOnce({});

    const service = new MediaStorageService();

    await service.uploadObject({
      buffer: Buffer.from('file-bytes'),
      mimetype: 'image/png',
      originalname: 'banner.png',
    });

    expect(CreateBucketCommand).not.toHaveBeenCalled();
    expect(sendMock).toHaveBeenCalledTimes(2);
  });

  it('returns object stream and content type from storage', async () => {
    const body = { pipe: jest.fn() };
    sendMock.mockResolvedValueOnce({
      Body: body,
      ContentType: 'image/webp',
    });

    const service = new MediaStorageService();
    const result = await service.getObject('arquivo.webp');

    expect(GetObjectCommand).toHaveBeenCalledWith({
      Bucket: 'intradebas',
      Key: 'arquivo.webp',
    });
    expect(result).toEqual({
      body,
      contentType: 'image/webp',
    });
  });
});
