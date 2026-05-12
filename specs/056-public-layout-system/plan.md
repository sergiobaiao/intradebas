# Implementation Plan: Public Layout System

**Branch**: `056-public-layout-system` | **Date**: 2026-05-12 | **Spec**: `/files/intradebas/specs/056-public-layout-system/spec.md`
**Input**: Feature specification from `/specs/056-public-layout-system/spec.md`

## Summary

Criar um shell público compartilhado para o portal e substituir a home provisória por uma landing orientada ao evento, usando dados reais já expostos pelas APIs públicas e mantendo o admin isolado desse layout.

## Technical Context

**Language/Version**: TypeScript 5.7, React 18, Next.js 15  
**Primary Dependencies**: Next.js App Router, Tailwind CSS, shadcn/ui primitives já introduzidos no frontend  
**Storage**: N/A no frontend; consumo das APIs públicas existentes  
**Testing**: Playwright E2E, `next build`  
**Target Platform**: Web responsiva no container frontend  
**Project Type**: Aplicação web Next.js  
**Performance Goals**: manter renderização estável com `revalidate` e sem dependência de conteúdo mockado  
**Constraints**: não renderizar shell público sobre `/admin` e `/login`, manter dados reais, preservar fallback estável quando APIs retornarem vazio  
**Scale/Scope**: shell público compartilhado, home e cobertura E2E representativa

## Constitution Check

- `Spec Before Code`: atendido com `spec.md` e `plan.md`.
- `Contract-First Web Delivery`: atendido; não há mudança contratual de backend.
- `Production-Like Local Environment`: atendido; frontend continua validado no stack local.
- `Security and LGPD by Default`: atendido; a feature não amplia exposição de dados pessoais.
- `Incremental MVP Slices`: atendido; a slice cobre shell e home, deixando páginas públicas secundárias para evolução incremental.

Sem violações conhecidas.

## Project Structure

### Documentation

```text
specs/056-public-layout-system/
├── plan.md
├── spec.md
└── tasks.md
```

### Source Code

```text
frontend/
├── app/
│   ├── body-shell.tsx
│   ├── page.tsx
│   └── public-footer.tsx
├── components/
│   ├── public/
│   └── ui/
└── e2e/
```

**Structure Decision**: acrescentar `frontend/components/public` para header e composições do portal, reaproveitando primitives existentes em `components/ui`.
