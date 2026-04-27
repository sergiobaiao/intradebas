# Plan: Quality & Production Hardening

## Architecture
The hardening phase will introduce cross-cutting concerns that affect both services.

### Backend Hardening
- **Security**: Integration of `ThrottlerModule` (Rate Limit) and `helmet`.
- **Validation**: Global `ValidationPipe` with `forbidNonWhitelisted: true`.
- **Error Handling**: Global `HttpExceptionFilter` to sanitize error responses in production.
- **Config**: Implementation of a `ConfigModule` with schema validation for all `process.env`.

### Performance
- **Caching**: Use `CacheModule` with Redis store for `GET /api/v1/results/ranking`.
- **Database**: Add explicit indexes in `schema.prisma` for `athlete.cpf`, `sponsor.email`, and `results.sport_id`.

### Testing
- **Frontend**: Bootstrap Vitest/Cypress for critical public flows.
- **Backend**: Add stress tests/benchmarks for the ranking engine.

## Implementation Steps
1. Setup global security modules (Throttler, Helmet).
2. Centralize backend error handling.
3. Validate and strongly type all environment variables.
4. Refactor `any` types in core services.
5. Implement Redis caching for ranking.
6. Add database indexes.
7. Bootstrap frontend testing.
