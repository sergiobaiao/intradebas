# Implementation Plan: Shadcn Admin System

**Branch**: `055-shadcn-admin-system` | **Date**: 2026-05-12 | **Spec**: [/files/intradebas/specs/055-shadcn-admin-system/spec.md](/files/intradebas/specs/055-shadcn-admin-system/spec.md)
**Input**: Feature specification from `/specs/055-shadcn-admin-system/spec.md`

## Summary

Adotar `shadcn/ui` de forma real no frontend administrativo, introduzindo a base Tailwind necessária, componentes compartilhados do admin e migração das telas prioritárias para um sistema visual reutilizável alinhado ao `next-shadcn-admin-dashboard`, preservando dados reais e a shell administrativa existente.

## Technical Context

**Language/Version**: TypeScript 5.7, React 18, Next.js 15  
**Primary Dependencies**: shadcn/ui, Tailwind CSS, Radix UI primitives, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`  
**Storage**: N/A no frontend; consumo das APIs Nest/Prisma existentes  
**Testing**: Playwright E2E, `next build`  
**Target Platform**: Web responsiva em App Router, executada em containers Docker  
**Project Type**: Web application frontend (`frontend/app`)  
**Performance Goals**: manter carregamento do admin sem regressao perceptivel e sem introduzir dados mockados  
**Constraints**: manter dados reais, preservar shell `/admin`, evitar CSS ad hoc em paginas migradas, continuar responsivo em desktop/tablet/mobile  
**Scale/Scope**: shell admin, primitives reutilizaveis, dashboard e telas administrativas prioritarias de listagem/formulario

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- `Spec Before Code`: atendido com `spec.md`, `plan.md` e `tasks.md`.
- `Contract-First Web Delivery`: atendido; nao ha mudanca de contrato backend, apenas consumo frontend.
- `Production-Like Local Environment`: atendido; stack Next dentro do compose permanece.
- `Security and LGPD by Default`: atendido; a feature nao reabre exposicao de PII e deve respeitar o hardening da `054`.
- `Incremental MVP Slices`: atendido; migracao sera incremental por shell, data views e forms.

Sem violacoes conhecidas.

## Project Structure

### Documentation (this feature)

```text
specs/055-shadcn-admin-system/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── admin-ui-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
frontend/
├── app/
│   ├── admin/
│   ├── globals.css
│   └── lib.ts
├── components/
│   ├── admin/
│   └── ui/
├── lib/
│   └── utils.ts
├── components.json
├── tailwind.config.ts
└── postcss.config.mjs
```

**Structure Decision**: acrescentar a base `shadcn/ui` no frontend com `components/ui` para primitives e `components/admin` para composição de domínio administrativo. As páginas em `app/admin` passam a consumir esses componentes em vez de layout visual inline.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Introduzir Tailwind em app existente | `shadcn/ui` depende dessa base para entrega consistente | Reproduzir “estilo shadcn” sem a base oficial manteria o problema de pseudo design system |
