# Implementation Plan: MinIO Media Storage

**Branch**: `027-minio-media-storage` | **Date**: 2026-04-22 | **Spec**: [spec.md](./spec.md)

## Summary

Replace local media file persistence with a MinIO-backed storage adapter using the S3 SDK, while preserving the admin upload UI and backend file-serving contract.

## Technical Context

**Language/Version**: TypeScript, NestJS 10, S3-compatible SDK  
**Primary Dependencies**: `@aws-sdk/client-s3`, MinIO-compatible endpoint  
**Testing**: Jest backend tests, backend build, frontend build

## Implementation Strategy

1. Add a dedicated media storage service backed by S3/MinIO.
2. Switch upload endpoint to memory buffering and object storage upload.
3. Serve objects back through the API route using the storage adapter.
4. Update media service tests to mock the storage layer.
