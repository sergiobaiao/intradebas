# Implementation Plan: Security Hardening

**Branch**: `054-security-hardening` | **Date**: 2026-05-12 | **Spec**: [/files/intradebas/specs/054-security-hardening/spec.md](/files/intradebas/specs/054-security-hardening/spec.md)
**Input**: Feature specification from `/specs/054-security-hardening/spec.md`

## Summary

Endurecer a autenticacao administrativa e a exposicao de dados pessoais movendo a sessao admin para cookies `HttpOnly`, protegendo endpoints sensiveis de atletas, criando endpoint publico sanitizado, restringindo CORS por origem conhecida e validando upload/credenciais MinIO no backend. O frontend admin passa a operar com `credentials: 'include'` e fetch autenticado no servidor para SSR.

## Technical Context

**Language/Version**: TypeScript 5.7, React 18, Next.js 15, NestJS 10  
**Primary Dependencies**: Next.js App Router, NestJS JWT/Throttler, Prisma, Joi, AWS S3 SDK, Multer  
**Storage**: PostgreSQL, Redis, MinIO/S3-compatible object storage  
**Testing**: Jest no backend, Playwright E2E no frontend, `next build` / `nest build`  
**Target Platform**: Linux containers via Docker Compose  
**Project Type**: Web application (`frontend` + `backend`)  
**Performance Goals**: Manter fluxos admin existentes sem regressao funcional e sem round-trips extras fora do refresh em `401`  
**Constraints**: LGPD por padrao, sem tokens acessiveis por JavaScript, CORS explicito, upload maximo de 20 MB, sem dados mockados  
**Scale/Scope**: Painel admin, endpoints de autenticacao/atletas/equipes/midia e configuracao global do backend

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- `Spec Before Code`: atendido com `spec.md`, `plan.md` e `tasks.md` desta feature.
- `Contract-First Web Delivery`: atendido; a feature altera contratos HTTP de auth/athletes/media e documenta isso em `contracts/security-hardening.md`.
- `Production-Like Local Environment`: atendido; nenhuma mudanca foge da arquitetura Docker/Nest/Next atual.
- `Security and LGPD by Default`: alvo principal da feature; sem conflito.
- `Incremental MVP Slices`: stories independentes preservadas por autenticacao, PII/rate limit e upload/CORS.

Sem violacoes conhecidas.

## Project Structure

### Documentation (this feature)

```text
specs/054-security-hardening/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── security-hardening.md
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── auth/
│   ├── athletes/
│   ├── config/
│   ├── media/
│   ├── shared/
│   └── teams/
└── test/

frontend/
├── app/
│   ├── admin/
│   ├── login/
│   └── lib.ts
└── e2e/
```

**Structure Decision**: Manter a estrutura web atual, concentrando endurecimento do backend em `auth`, `athletes`, `teams`, `config` e `media`, e adaptando o frontend em `app/lib.ts`, `app/login` e páginas admin server-rendered.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
