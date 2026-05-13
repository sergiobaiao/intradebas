# Implementation Plan: Ranking Tiebreak Settings

**Branch**: `060-ranking-tiebreak-settings` | **Date**: 2026-05-13 | **Spec**: [/files/intradebas/specs/060-ranking-tiebreak-settings/spec.md](/files/intradebas/specs/060-ranking-tiebreak-settings/spec.md)
**Input**: Feature specification from `/specs/060-ranking-tiebreak-settings/spec.md`

## Summary

Adicionar configuracao persistida de desempate para o ranking das equipes, fazendo o backend deixar de depender apenas da ordem alfabetica em empates de pontuacao. A feature cobre persistencia Prisma, contrato HTTP em `settings`, recalculo/ordenacao do ranking com metricas reais de vitorias e podios, e exposicao/edicao dessa configuracao nas telas administrativas de configuracoes e ranking.

## Technical Context

**Language/Version**: TypeScript 5.7, React 18, Next.js 15, NestJS 10, Prisma 6.7  
**Primary Dependencies**: Next.js App Router, shadcn/ui, NestJS controllers/services, Prisma Client, Redis Pub/Sub/cache  
**Storage**: PostgreSQL para `ranking_settings`, Redis para cache/eventos de ranking  
**Testing**: Jest no backend, Playwright E2E no frontend, `next build` / `nest build`  
**Target Platform**: Containers Linux via Docker Compose  
**Project Type**: Web application (`frontend` + `backend`)  
**Performance Goals**: Reaproveitar o ranking cacheado existente, refletindo mudancas de criterio sem degradar o carregamento do placar admin/publico  
**Constraints**: Sem dados mockados, LGPD preservada, resposta JSON estavel, invalidacao de cache ao alterar configuracao, compativel com o shell admin atual  
**Scale/Scope**: Modulo de configuracoes, modulo de ranking, seed Prisma e resposta de ranking consumida por telas admin/publicas

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- `Spec Before Code`: atendido com `spec.md`, `plan.md` e `tasks.md` desta feature.
- `Contract-First Web Delivery`: atendido; a feature altera contratos HTTP de configuracoes e payload de ranking, documentados em `contracts/ranking-tiebreak-settings.md`.
- `Production-Like Local Environment`: atendido; nenhuma mudanca rompe Docker Compose, Redis, Postgres ou o fluxo local existente.
- `Security and LGPD by Default`: atendido; a feature nao expande exposicao de PII e opera apenas sobre configuracao administrativa/ranking agregado.
- `Incremental MVP Slices`: atendido; o trabalho pode ser dividido em persistencia/contrato, ordenacao do ranking e UI admin.

Sem violacoes conhecidas.

## Project Structure

### Documentation (this feature)

```text
specs/060-ranking-tiebreak-settings/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ranking-tiebreak-settings.md
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── results/
│   └── settings/
└── test/

frontend/
├── app/
│   ├── admin/
│   │   ├── configuracoes/
│   │   └── ranking/
│   └── lib.ts
└── e2e/
```

**Structure Decision**: manter a estrutura web atual, concentrando a persistencia e regras de negocio no backend (`prisma`, `settings`, `results`) e expondo a configuracao/observabilidade no frontend admin (`app/admin/configuracoes`, `app/admin/ranking`, `app/lib.ts`).

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
