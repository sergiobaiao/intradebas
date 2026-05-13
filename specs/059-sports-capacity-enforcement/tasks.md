# Tasks: Sports Capacity Enforcement

**Input**: Design documents from `/specs/059-sports-capacity-enforcement/`
**Prerequisites**: spec.md

**Tests**: Obrigatorios nesta feature.

## Phase 1: Setup

- [x] T001 Configurar a feature ativa e criar artefatos em `specs/059-sports-capacity-enforcement/`

## Phase 2: Backend Capacity Rules

- [x] T002 Adicionar limites minimos e maximos aos DTOs e ao servico de modalidades em `backend/src/sports/*`
- [x] T003 Validar limites inconsistentes no backend e refletir os campos nas consultas de modalidades
- [x] T004 Bloquear criacao/edicao de atletas quando a modalidade atingir a capacidade maxima em `backend/src/athletes/athletes.service.ts`
- [x] T005 Cobrir regras de capacidade nos testes de backend em `backend/test/*.spec.ts`

## Phase 3: Admin UI

- [x] T006 Atualizar tipos e fetch helpers de modalidades em `frontend/app/lib.ts`
- [x] T007 Exibir e editar limites de participantes nas telas administrativas de modalidades

## Final Phase

- [x] T008 Rodar `cd backend && npm test`
- [x] T009 Rodar `cd backend && npm run build`
- [x] T010 Rodar `cd frontend && npm run test:e2e -- --reporter=list`
- [x] T011 Rodar `cd frontend && npm run build`
- [x] T012 Atualizar `INTRADEBAS_2026_Especificacao_Tecnica.md` e `AGENTS.md`
- [x] T013 Commitar e enviar a feature `059-sports-capacity-enforcement`
