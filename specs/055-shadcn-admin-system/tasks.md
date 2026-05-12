# Tasks: Shadcn Admin System

**Input**: Design documents from `/specs/055-shadcn-admin-system/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/admin-ui-contract.md

**Tests**: Obrigatorios nesta feature.

## Phase 1: Setup

- [x] T001 Configurar a feature ativa e artefatos em `specs/055-shadcn-admin-system/`
- [x] T002 Instalar dependencias de `shadcn/ui` e Tailwind em `frontend/package.json`
- [x] T003 Configurar `components.json`, alias utilitario e base Tailwind em `frontend/components.json`, `frontend/tailwind.config.ts`, `frontend/postcss.config.mjs`, `frontend/lib/utils.ts` e `frontend/tsconfig.json`

## Phase 2: Foundational

- [x] T004 Criar primitives base do `shadcn/ui` em `frontend/components/ui/`
- [x] T005 Criar componentes compartilhados do admin em `frontend/components/admin/`
- [x] T006 Adaptar `frontend/app/globals.css` para tokens globais e reduzir dependência visual legacy

## Phase 3: User Story 1 - Shell e superfícies consistentes (Priority: P1) 🎯 MVP

**Goal**: Unificar shell e blocos principais do admin em componentes consistentes.

**Independent Test**: Dashboard e subpáginas preservam a mesma shell e superfícies administrativas.

- [x] T007 [P] [US1] Migrar `frontend/app/admin/admin-shell.tsx` para primitives do sistema
- [x] T008 [US1] Migrar `frontend/app/admin/dashboard/page.tsx` para `AdminPageHeader` e `AdminSurface`
- [x] T009 [P] [US1] Atualizar E2E de navegação visual em `frontend/e2e/admin-dashboard.spec.ts`

## Phase 4: User Story 2 - Listas e formulários padronizados (Priority: P1)

**Goal**: Padronizar data views e forms administrativos com componentes reutilizáveis.

**Independent Test**: Atletas, equipes e modalidades usam toolbar, data views e forms consistentes.

- [x] T010 [P] [US2] Migrar `frontend/app/admin/atletas/page.tsx` e `frontend/app/admin/atletas/novo/page.tsx`
- [x] T011 [P] [US2] Migrar `frontend/app/admin/equipes/page.tsx`, `frontend/app/admin/equipes/nova/page.tsx` e `frontend/app/admin/equipes/team-edit-form.tsx`
- [x] T012 [P] [US2] Migrar `frontend/app/admin/modalidades/page.tsx`, `frontend/app/admin/modalidades/nova/page.tsx` e `frontend/app/admin/modalidades/sport-edit-form.tsx`
- [x] T013 [US2] Atualizar E2E representativos em `frontend/e2e/admin-screens.spec.ts`

## Phase 5: User Story 3 - Base reutilizável para evolução futura (Priority: P2)

**Goal**: Reduzir CSS e composição ad hoc nas páginas administrativas migradas.

**Independent Test**: As páginas migradas compõem sua estrutura visual principal a partir de `components/ui` e `components/admin`.

- [x] T014 [US3] Reduzir estilos inline e classes duplicadas nas páginas migradas em `frontend/app/admin/**`
- [x] T015 [US3] Documentar convenções do novo sistema em `AGENTS.md` e/ou artefatos da feature

## Final Phase: Polish & Cross-Cutting Concerns

- [x] T016 Atualizar `INTRADEBAS_2026_Especificacao_Tecnica.md` com progresso da 055
- [x] T017 Rodar `cd frontend && npm run build`
- [x] T018 Rodar `cd frontend && npm run test:e2e`
- [x] T019 Commitar e enviar a feature `055-shadcn-admin-system`
