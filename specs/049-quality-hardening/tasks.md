# Tasks: Quality & Production Hardening

**Input**: Design documents from `/specs/049-quality-hardening/`
**Prerequisites**: plan.md, spec.md

## Phase 1: Security & Compliance (US1)

- [ ] T001 [P] Implement `ConfigModule` with Joi/class-validator schema for `process.env` in `backend/src/app.module.ts`
- [ ] T002 [P] Configure `ThrottlerModule` for rate limiting in `backend/src/app.module.ts`
- [ ] T003 [P] Add `helmet` middleware for security headers in `backend/src/main.ts`
- [ ] T004 Create a global `HttpExceptionFilter` to sanitize errors in `backend/src/shared/filters/http-exception.filter.ts`
- [ ] T005 Review and refactor `any` types in `backend/src/athletes/` and `backend/src/sponsorship/`
- [ ] T006 [P] Update `ValidationPipe` in `backend/src/main.ts` with `forbidNonWhitelisted: true`

## Phase 2: Performance & Scalability (US2)

- [ ] T007 [P] Implement Redis-based `CacheModule` for `ResultsController` in `backend/src/results/results.controller.ts`
- [X] T008 [P] Add database indexes for frequently queried fields in `backend/prisma/schema.prisma`
- [X] T009 [P] Optimize `getRanking` query in `backend/src/results/results.service.ts` for large datasets

## Phase 3: Automated Quality (US3)

- [ ] T010 [P] Bootstrap Cypress or Playwright for end-to-end testing in `frontend/`
- [ ] T011 Create E2E test for the public athlete registration flow in `frontend/cypress/e2e/registration.cy.ts`
- [ ] T012 Create E2E test for the public results and ranking flow in `frontend/cypress/e2e/results.cy.ts`
- [X] T013 [P] Add unit tests for edge cases in `backend/src/sponsorship/sponsorship.service.ts` (e.g. concurrent coupon generation)

## Phase 4: Production Readiness

- [ ] T014 [P] Update `docker-compose.prod.yml` with healthchecks and log rotation policies
- [ ] T015 [P] Create a `runbook.md` with common operational tasks and troubleshooting steps
- [ ] T016 Final validation of production builds and environment compatibility
