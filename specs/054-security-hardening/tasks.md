# Tasks: Security Hardening

**Input**: Design documents from `/specs/054-security-hardening/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/security-hardening.md

**Tests**: Obrigatorios nesta feature.

## Phase 1: Setup

- [x] T001 Atualizar `.specify/feature.json` e artefatos da feature em `specs/054-security-hardening/`

## Phase 2: Foundational

- [x] T002 Criar utilitarios de cookies/CORS/upload em `backend/src/auth/`, `backend/src/config/` e `backend/src/media/`
- [x] T003 Criar helper server-side autenticado para SSR admin em `frontend/app/admin/admin-data.ts`

## Phase 3: User Story 1 - Sessao admin segura (Priority: P1) 🎯 MVP

**Goal**: Remover tokens admin do JavaScript e manter autenticacao funcional no painel.

**Independent Test**: Login admin funciona, `document.cookie` nao exibe tokens e `/admin/dashboard` continua carregando.

- [x] T004 [P] [US1] Adicionar testes de cookies/guard em `backend/test/auth.cookies.spec.ts` e `backend/test/jwt-auth.guard.spec.ts`
- [x] T005 [US1] Mover login/refresh/logout para cookies `HttpOnly` em `backend/src/auth/auth.controller.ts`
- [x] T006 [US1] Aceitar token em cookie no guard em `backend/src/auth/jwt-auth.guard.ts`
- [x] T007 [US1] Migrar login admin e helpers admin para `credentials: 'include'` em `frontend/app/login/page.tsx` e `frontend/app/lib.ts`
- [x] T008 [US1] Trocar telas admin SSR para helper autenticado em `frontend/app/admin/dashboard/page.tsx`, `frontend/app/admin/atletas/[id]/page.tsx` e `frontend/app/admin/equipes/[id]/page.tsx`

## Phase 4: User Story 2 - PII protegida e rate limit sensivel (Priority: P1)

**Goal**: Bloquear acesso anonimo a PII de atletas e endurecer rotas de auth contra abuso.

**Independent Test**: `GET /athletes` e `GET /athletes/:id` sem auth retornam `401`; `GET /athletes/public` segue publico; login/forgot/reset limitam em 5 req/min.

- [x] T009 [P] [US2] Adicionar testes de atletas/rate limit em `backend/test/athletes.service.spec.ts` e `backend/test/auth.controller.spec.ts`
- [x] T010 [US2] Proteger endpoints sensiveis e publicar endpoint sanitizado em `backend/src/athletes/athletes.controller.ts`, `backend/src/athletes/athletes.service.ts` e `backend/src/teams/teams.controller.ts`
- [x] T011 [US2] Aplicar throttle por rota em `backend/src/auth/auth.controller.ts`

## Phase 5: User Story 3 - CORS, upload e MinIO endurecidos (Priority: P2)

**Goal**: Restringir origens, validar uploads e impedir credenciais padrao inseguras em producao.

**Independent Test**: origem externa nao permitida nao recebe CORS; upload invalido falha; ambiente de producao exige credenciais MinIO explicitas.

- [x] T012 [P] [US3] Adicionar testes de CORS/upload/env em `backend/test/media.service.spec.ts`, `backend/test/media-upload.spec.ts` e `backend/test/cors.spec.ts`
- [x] T013 [US3] Restringir CORS em `backend/src/config/cors.ts` e `backend/src/main.ts`
- [x] T014 [US3] Validar MIME/tamanho no upload em `backend/src/media/media.controller.ts` e `backend/src/media/media.service.ts`
- [x] T015 [US3] Endurecer configuracao MinIO em `backend/src/config/env.validation.ts` e `backend/src/media/media-storage.service.ts`

## Final Phase: Polish & Cross-Cutting Concerns

- [x] T016 Atualizar `INTRADEBAS_2026_Especificacao_Tecnica.md` com os itens concluidos da 054
- [x] T017 Rodar `cd backend && npm test && npm run build`
- [x] T018 Rodar `cd frontend && npm run test:e2e && npm run build`
- [ ] T019 Commitar e enviar a feature `054-security-hardening`
