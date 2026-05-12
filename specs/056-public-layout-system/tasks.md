# Tasks: Public Layout System

**Input**: Design documents from `/specs/056-public-layout-system/`
**Prerequisites**: plan.md, spec.md

**Tests**: Obrigatorios nesta feature.

## Phase 1: Setup

- [x] T001 Configurar a feature ativa em `.specify/feature.json` e criar artefatos em `specs/056-public-layout-system/`

## Phase 2: Foundational

- [x] T002 Criar componentes compartilhados do shell público em `frontend/components/public/`
- [x] T003 Adaptar `frontend/app/body-shell.tsx` e `frontend/app/public-footer.tsx` para usar o shell público compartilhado

## Phase 3: User Story 1 - Navegação pública consistente (Priority: P1) 🎯 MVP

**Goal**: Disponibilizar header/footer claros e reutilizáveis para as rotas públicas.

**Independent Test**: Acessar `/` e confirmar presença do shell público; acessar `/admin/dashboard` e confirmar ausência dele.

- [x] T004 [US1] Implementar header público responsivo com navegação principal em `frontend/components/public/site-header.tsx`
- [x] T005 [US1] Consolidar footer público com atalhos relevantes e contato em `frontend/components/public/site-footer.tsx`

## Phase 4: User Story 2 - Home pública com dados reais (Priority: P1)

**Goal**: Substituir a landing provisória por uma home orientada ao evento e aos fluxos principais.

**Independent Test**: Abrir `/` e validar hero, destaques e métricas com dados reais ou estados vazios claros.

- [x] T006 [US2] Reescrever `frontend/app/page.tsx` com hero, destaques e métricas usando dados reais
- [x] T007 [US2] Ajustar estilos globais necessários para o shell e seções públicas sem regressão no admin

## Phase 5: User Story 3 - Base reutilizável para evolução (Priority: P2)

**Goal**: Deixar uma fundação pública reaproveitável em vez de estrutura solta por página.

**Independent Test**: Revisar o código do shell público e confirmar composição por componentes reutilizáveis.

- [x] T008 [US3] Encapsular seções-base públicas em componentes reutilizáveis quando necessário

## Final Phase: Polish & Cross-Cutting Concerns

- [x] T009 Criar/atualizar E2E representativo em `frontend/e2e/public-layout.spec.ts`
- [x] T010 Rodar `cd frontend && npm run build`
- [x] T011 Rodar `cd frontend && npm run test:e2e`
- [x] T012 Atualizar `INTRADEBAS_2026_Especificacao_Tecnica.md` e `AGENTS.md` com o progresso da 056
- [x] T013 Commitar e enviar a feature `056-public-layout-system`
