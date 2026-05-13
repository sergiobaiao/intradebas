# intradebas Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-05-12

## Active Technologies
- TypeScript 5.7, React 18, Next.js 15, Tailwind CSS 3.4, shadcn/ui primitives, public shared page components in `frontend/components/public`, public routes redesigned around real API data (057-public-pages-redesign)
- TypeScript 5.7, React 18, Next.js 15, Tailwind CSS 3.4, shadcn/ui primitives, public shared components in `frontend/components/public`, public data from `frontend/app/lib.ts` (056-public-layout-system)
- TypeScript 5.7, React 18, Next.js 15, Tailwind CSS 3.4, shadcn/ui primitives, Radix UI, App Router, admin shared components in `frontend/components/admin`, UI primitives in `frontend/components/ui` (055-shadcn-admin-system)
- TypeScript 5.7, React 18, Next.js 15 + Next.js App Router, existing admin routes under `frontend/app/admin`, existing fetch helpers in `frontend/app/lib.ts`, global CSS from feature 051 (052-admin-screens-redesign)
- N/A for new persistence; screens consume existing backend data (052-admin-screens-redesign)

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
- 057-public-pages-redesign: Migrated the remaining main public pages to the shared public visual system and expanded Playwright coverage for those routes
- 056-public-layout-system: Added shared public header/footer/section components and rewrote the home page around real portal data instead of placeholder content
- 055-shadcn-admin-system: Added Tailwind CSS + shadcn/ui foundation, reusable admin components, and migrated admin dashboard/lists/forms away from page-local styling
- 052-admin-screens-redesign: Added TypeScript 5.7, React 18, Next.js 15 + Next.js App Router, existing admin routes under `frontend/app/admin`, existing fetch helpers in `frontend/app/lib.ts`, global CSS from feature 051

- 051-admin-dashboard-redesign: Added TypeScript 5.7, React 18, Next.js 15 + Next.js App Router, existing fetch helpers in `frontend/app/lib.ts`, existing global CSS

<!-- MANUAL ADDITIONS START -->
- Prefer `frontend/components/ui` and `frontend/components/admin` for new admin UI work instead of reintroducing page-local inline styles or one-off visual wrappers.
<!-- MANUAL ADDITIONS END -->
