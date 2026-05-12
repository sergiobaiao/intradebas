# Contracts: Admin UI Contract

## Design System Boundaries

- `frontend/components/ui/*`
  - primitives baseadas em `shadcn/ui`
  - nao carregam regras de negocio do admin

- `frontend/components/admin/*`
  - composicao administrativa reutilizavel
  - conhece semântica do admin (`page header`, `data panel`, `empty state`, `toolbar`)

## Page Migration Expectations

- Páginas migradas:
  - usam `AdminShellLayout` compartilhado
  - usam `AdminPageHeader` para topo
  - usam `AdminSurface`/`AdminDataView` para blocos principais
  - usam `Button`, `Input`, `Select`, `Textarea`, `Table`, `Badge`, `Card` do sistema

- Páginas migradas nao devem:
  - depender majoritariamente de `style={{ ... }}` para layout visual
  - recriar manualmente CTA, painéis e estados vazios que ja existam em componentes compartilhados

## Non-Goals

- nao mudar contratos backend
- nao introduzir mock data
- nao redesenhar o portal publico inteiro nesta feature
