import {
  CreateBucketCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { extname } from 'path';

@Injectable()
export class MediaStorageService {
  private readonly bucket = process.env.MINIO_BUCKET ?? 'intradebas';
  private readonly client: S3Client;
  private bucketReady = false;

  constructor() {
    const endpoint = `${process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http'}://${process.env.MINIO_ENDPOINT ?? 'minio'}:${process.env.MINIO_PORT ?? '9000'}`;

    this.client = new S3Client({
      region: 'us-east-1',
      endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY ?? 'minioadmin',
        secretAccessKey: process.env.MINIO_SECRET_KEY ?? 'minioadmin',
      },
    });
  }

  async uploadObject(file: {
    buffer: Buffer;
    mimetype: string;
    originalname?: string;
  }) {
    await this.ensureBucket();

    const extension = extname(file.originalname ?? '');
    const key = `${randomUUID()}${extension}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return {
      key,
      url: `/api/v1/media/files/${key}`,
    };
  }

  async getObject(key: string) {
    const response = await this.client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );

    return {
      body: response.Body,
      contentType: response.ContentType ?? 'application/octet-stream',
    };
  }

  private async ensureBucket() {
    if (this.bucketReady) {
      return;
    }

    try {
      await this.client.send(
        new HeadBucketCommand({
          Bucket: this.bucket,
        }),
      );
    } catch {
      await this.client.send(
        new CreateBucketCommand({
          Bucket: this.bucket,
        }),
      );
    }

    this.bucketReady = true;
  }
}
