# Implementation Plan: Real Media Storage

**Branch**: `026-real-media-storage` | **Date**: 2026-04-22 | **Spec**: [spec.md](./spec.md)

## Summary

Add a multipart upload path for local media, persist uploaded files under backend storage, serve them back through the API, and wire the admin media creation screen to choose between local upload and remote URL creation.

## Technical Context

**Language/Version**: TypeScript, Next.js 15, NestJS 10  
**Primary Dependencies**: NestJS platform-express, multer disk storage, Prisma  
**Testing**: Jest backend tests, backend build, frontend build

## Implementation Strategy

1. Add uploaded-media DTO and media service method for local upload persistence.
2. Add controller routes for multipart upload and public file serving.
3. Add frontend upload helper and local upload UI path in `/admin/midia/nova`.
4. Validate tests and builds.
