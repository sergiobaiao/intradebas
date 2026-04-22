# Implementation Plan: Media Upload Admin

**Branch**: `020-media-upload-admin` | **Date**: 2026-04-21 | **Spec**: [spec.md](./spec.md)

## Summary

Add an authenticated media creation endpoint plus a dedicated admin form that captures URL-based media metadata and writes it to the database with uploader attribution.

## Technical Context

**Language/Version**: TypeScript, Next.js 15, NestJS 10, Prisma  
**Primary Dependencies**: Next.js App Router, NestJS, Prisma, class-validator  
**Storage**: PostgreSQL via Prisma  
**Testing**: Jest backend service tests, backend build, frontend build  

## Implementation Strategy

1. Add a create-media DTO and service/controller method using the authenticated user id.
2. Extend backend mocks and media tests for creation behavior.
3. Add frontend helper and a dedicated `/admin/midia/nova` page.
4. Link the media index and dashboard to the new creation flow.
