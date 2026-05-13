# Tasks: Public Experience Completion

**Input**: Design documents from `/specs/058-public-experience-completion/`
**Prerequisites**: spec.md

**Tests**: Obrigatorios nesta feature.

## Phase 1: Setup

- [x] T001 Configurar a feature ativa e criar artefatos em `specs/058-public-experience-completion/`

## Phase 2: Backend Public Media

- [x] T002 Expor endpoint público de mídia em `backend/src/media/*`
- [x] T003 Cobrir a listagem pública de mídia em `backend/test/media.service.spec.ts`

## Phase 3: Public Frontend Completion

- [x] T004 Adicionar tipos e fetch público de mídia em `frontend/app/lib.ts`
- [x] T005 Implementar rota pública `/midia`
- [x] T006 Implementar countdown real na home usando modalidades agendadas
- [x] T007 Implementar rotação dinâmica de patrocinadores no backdrop público
- [x] T008 Atualizar navegação pública para incluir mídia

## Final Phase

- [x] T009 Atualizar E2E pública
- [x] T010 Rodar `cd backend && npm test`
- [x] T011 Rodar `cd backend && npm run build`
- [x] T012 Rodar `cd frontend && npm run test:e2e`
- [x] T013 Rodar `cd frontend && npm run build`
- [x] T014 Atualizar `INTRADEBAS_2026_Especificacao_Tecnica.md` e `AGENTS.md`
- [x] T015 Commitar e enviar a feature `058-public-experience-completion`
