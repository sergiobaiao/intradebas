# intradebas Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-05-13

## Active Technologies
- TypeScript 5.7, React 18, Next.js 15, NestJS, Prisma 6.7, ranking tie-break persistence in `backend/src/settings`, ranking ordering metrics in `backend/src/results`, admin settings/ranking UI in `frontend/app/admin` (060-ranking-tiebreak-settings)
- TypeScript 5.7, React 18, Next.js 15, NestJS, Tailwind CSS 3.4, participant capacity rules in `backend/src/sports` and `backend/src/athletes`, admin modality forms in `frontend/app/admin/modalidades` (059-sports-capacity-enforcement)
- TypeScript 5.7, React 18, Next.js 15, NestJS, Tailwind CSS 3.4, public media endpoint in `backend/src/media`, countdown/backdrop/media components in `frontend/components/public` (058-public-experience-completion)
- TypeScript 5.7, React 18, Next.js 15, Tailwind CSS 3.4, shadcn/ui primitives, public shared page components in `frontend/components/public`, public routes redesigned around real API data (057-public-pages-redesign)
- TypeScript 5.7, React 18, Next.js 15, Tailwind CSS 3.4, shadcn/ui primitives, public shared components in `frontend/components/public`, public data from `frontend/app/lib.ts` (056-public-layout-system)
- TypeScript 5.7, React 18, Next.js 15, Tailwind CSS 3.4, shadcn/ui primitives, Radix UI, App Router, admin shared components in `frontend/components/admin`, UI primitives in `frontend/components/ui` (055-shadcn-admin-system)
- TypeScript 5.7, React 18, Next.js 15 + Next.js App Router, existing admin routes under `frontend/app/admin`, existing fetch helpers in `frontend/app/lib.ts`, global CSS from feature 051 (052-admin-screens-redesign)
- N/A for new persistence; screens consume existing backend data (052-admin-screens-redesign)
- TypeScript 5.7, React 18, Next.js 15, NestJS 10, Prisma 6.7 + Next.js App Router, shadcn/ui, NestJS controllers/services, Prisma Client, Redis Pub/Sub/cache (060-ranking-tiebreak-settings)
- PostgreSQL para `ranking_settings`, Redis para cache/eventos de ranking (060-ranking-tiebreak-settings)

- TypeScript 5.7, React 18, Next.js 15 + Next.js App Router, existing fetch helpers in `frontend/app/lib.ts`, existing global CSS (051-admin-dashboard-redesign)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5.7, React 18, Next.js 15: Follow standard conventions

## Recent Changes
- 060-ranking-tiebreak-settings: Added TypeScript 5.7, React 18, Next.js 15, NestJS 10, Prisma 6.7 + Next.js App Router, shadcn/ui, NestJS controllers/services, Prisma Client, Redis Pub/Sub/cache
- 060-ranking-tiebreak-settings: Added persisted ranking tie-break settings, real wins/podium metrics in ranking responses, and admin controls for selecting the tie-break rule
- 059-sports-capacity-enforcement: Added configurable min/max participant limits for sports, backend enforcement during athlete registration, and admin editing for modality capacity


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
