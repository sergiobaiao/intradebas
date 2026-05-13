# Tasks: Ranking Tiebreak Settings

**Input**: Design documents from `/specs/060-ranking-tiebreak-settings/`
**Prerequisites**: spec.md

**Tests**: Obrigatorios nesta feature.

## Phase 1: Setup

- [x] T001 Configurar a feature ativa e criar artefatos em `specs/060-ranking-tiebreak-settings/`

## Phase 2: Backend Ranking Settings

- [x] T002 Adicionar persistencia da regra de desempate no schema Prisma e seed
- [x] T003 Expor leitura/atualizacao da configuracao de desempate em `backend/src/settings/*`
- [x] T004 Aplicar a regra configurada no calculo e ordenacao do ranking em `backend/src/results/results.service.ts`
- [x] T005 Invalidar cache/publicar refresh do ranking ao alterar a configuracao
- [x] T006 Cobrir ranking e configuracoes com testes de backend

## Phase 3: Admin Frontend

- [x] T007 Atualizar tipos e fetch helpers em `frontend/app/lib.ts`
- [x] T008 Adicionar gestao da regra de desempate em `/admin/configuracoes`
- [x] T009 Exibir metrica e criterio ativo em `/admin/ranking`
- [x] T010 Ajustar mocks e cobertura E2E admin

## Final Phase

- [x] T011 Rodar `cd backend && npm run prisma:generate`
- [x] T012 Rodar `cd backend && npm test`
- [x] T013 Rodar `cd backend && npm run build`
- [x] T014 Rodar `cd frontend && npm run test:e2e -- --reporter=list`
- [x] T015 Rodar `cd frontend && npm run build`
- [x] T016 Atualizar `INTRADEBAS_2026_Especificacao_Tecnica.md` e `AGENTS.md`
- [x] T017 Commitar e enviar a feature `060-ranking-tiebreak-settings`
