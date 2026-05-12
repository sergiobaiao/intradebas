# Data Model: Shadcn Admin System

## AdminShellLayout

- Fields:
  - `sidebarGroups`
  - `brand`
  - `quickActions`
  - `content`
- Responsibilities:
  - manter navegação consistente
  - padronizar área central e spacing global

## AdminPageHeader

- Fields:
  - `kicker`
  - `title`
  - `description`
  - `actions`
- Responsibilities:
  - cabeçalho consistente por tela
  - alinhar CTA principal/secundária

## AdminSurface

- Fields:
  - `variant`
  - `title`
  - `description`
  - `content`
- Responsibilities:
  - substituir painéis/cartões ad hoc
  - hospedar estados vazios e blocos operacionais

## AdminDataView

- Fields:
  - `toolbar`
  - `columns`
  - `rows`
  - `emptyState`
  - `pagination`
- Responsibilities:
  - padronizar listagens, grades e tabelas responsivas

## AdminFormLayout

- Fields:
  - `sections`
  - `fields`
  - `actions`
  - `feedback`
- Responsibilities:
  - padronizar formulários administrativos
  - reduzir estilos inline e classes por página
