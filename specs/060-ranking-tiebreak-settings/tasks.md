# Tasks: Ranking Tiebreak Settings

**Input**: Design documents from `/specs/060-ranking-tiebreak-settings/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Obrigatorios nesta feature.

**Organization**: Tasks grouped by user story for independent delivery and validation.

## Phase 1: Setup

- [x] T001 Configurar a feature ativa e criar artefatos em `specs/060-ranking-tiebreak-settings/`
- [x] T002 Atualizar o contexto do agente com `.specify/scripts/bash/update-agent-context.sh`

## Phase 2: Foundational

- [x] T003 Preparar persistencia singleton de desempate em `backend/prisma/schema.prisma`, `backend/prisma/migrations/20260512_000008_ranking_settings/migration.sql` e `backend/prisma/seed.ts`
- [x] T004 Ajustar mocks compartilhados para suportar `rankingSettings` em `backend/test/helpers.ts`

## Phase 3: User Story 1 - Persistir e administrar a regra de desempate (Priority: P1) 🎯 MVP

**Goal**: Permitir que a comissao leia e altere a regra de desempate do ranking pelo painel administrativo.

**Independent Test**: Acessar `/admin/configuracoes`, alterar a regra de desempate e validar que `GET/PATCH /api/v1/settings/ranking` refletem a mudanca persistida.

- [x] T005 [P] [US1] Criar DTO de atualizacao da regra em `backend/src/settings/dto/update-ranking-settings.dto.ts`
- [x] T006 [US1] Expor `GET /settings/ranking` e `PATCH /settings/ranking` em `backend/src/settings/settings.controller.ts`
- [x] T007 [US1] Implementar leitura/upsert da configuracao e invalidacao de cache em `backend/src/settings/settings.service.ts`
- [x] T008 [P] [US1] Cobrir leitura e atualizacao da configuracao em `backend/test/settings.service.spec.ts`
- [x] T009 [P] [US1] Adicionar tipos e helpers admin em `frontend/app/lib.ts`
- [x] T010 [US1] Implementar a gestao da regra em `frontend/app/admin/configuracoes/page.tsx`

## Phase 4: User Story 2 - Aplicar o desempate configurado no ranking (Priority: P1)

**Goal**: Fazer o ranking usar criterios reais de desempate em vez de depender apenas da ordem alfabetica.

**Independent Test**: Com duas equipes empatadas em pontos, mudar a regra ativa e verificar que `GET /results/ranking` muda a ordenacao conforme o criterio escolhido.

- [x] T011 [US2] Incluir `wins`, `podiums` e `tieBreakRule` no calculo do ranking em `backend/src/results/results.service.ts`
- [x] T012 [P] [US2] Reusar a configuracao persistida no backend para ordenar empates em `backend/src/results/results.service.ts`
- [x] T013 [P] [US2] Cobrir ordenacao por desempate e SSE em `backend/test/results.service.spec.ts`

## Phase 5: User Story 3 - Tornar o criterio auditavel no admin (Priority: P2)

**Goal**: Exibir no painel administrativo qual criterio esta em vigor e quais metricas sustentam a classificacao.

**Independent Test**: Abrir `/admin/ranking` e verificar exibicao de criterio ativo, vitorias e podios por equipe.

- [x] T014 [US3] Atualizar o payload tipado de ranking em `frontend/app/lib.ts`
- [x] T015 [US3] Exibir criterio e metricas operacionais em `frontend/app/admin/ranking/page.tsx`
- [x] T016 [P] [US3] Ajustar o mock do servidor E2E para `settings/ranking`, `settings/scoring` e novo payload de ranking em `frontend/e2e/support/start-e2e-server.mjs`
- [x] T017 [P] [US3] Expandir a cobertura da area admin em `frontend/e2e/admin-screens.spec.ts`

## Final Phase: Polish & Cross-Cutting Concerns

- [x] T018 Rodar `cd backend && npm run prisma:generate`
- [x] T019 Rodar `cd backend && npm test`
- [x] T020 Rodar `cd backend && npm run build`
- [x] T021 Rodar `cd frontend && npm run test:e2e -- --reporter=list`
- [x] T022 Rodar `cd frontend && npm run build`
- [x] T023 Atualizar `INTRADEBAS_2026_Especificacao_Tecnica.md` e `AGENTS.md`
- [x] T024 Commitar e enviar a feature `060-ranking-tiebreak-settings`

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): sem dependencias
- Foundational (Phase 2): depende da Setup
- User Story 1 (Phase 3): depende da Foundational
- User Story 2 (Phase 4): depende da Foundational e do contrato/configuracao da US1
- User Story 3 (Phase 5): depende da US1 e da US2
- Final Phase: depende de todas as stories

### User Story Dependencies

- US1: base de persistencia e contrato administrativo
- US2: depende da regra persistida da US1 para ordenar o ranking
- US3: depende do payload enriquecido da US2 e da gestao da US1

### Parallel Opportunities

- T005, T008 e T009 podem ocorrer em paralelo
- T012 e T013 podem ocorrer em paralelo depois de T011
- T016 e T017 podem ocorrer em paralelo depois de T014/T015

## Parallel Example: User Story 1

```bash
Task: "Criar DTO de atualizacao da regra em backend/src/settings/dto/update-ranking-settings.dto.ts"
Task: "Cobrir leitura e atualizacao da configuracao em backend/test/settings.service.spec.ts"
Task: "Adicionar tipos e helpers admin em frontend/app/lib.ts"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Setup + Foundational
2. Entregar US1 para leitura/edicao da regra
3. Validar `/admin/configuracoes` e `GET/PATCH /settings/ranking`

### Incremental Delivery

1. US1: persistencia e contrato admin
2. US2: ordenacao real do ranking
3. US3: transparência operacional no painel admin

### Notes

- Todos os itens seguem o formato checklist exigido
- Cada historia possui criterio de teste independente
- A feature foi implementada antes da geracao retroativa destes artefatos, por isso as tarefas ja estao marcadas como concluidas
