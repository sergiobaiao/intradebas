# Quickstart: Shadcn Admin System

## Validation flow

1. Abrir `/admin/dashboard` e validar shell consistente com sidebar, header e surfaces compartilhadas.
2. Navegar para `/admin/atletas`, `/admin/equipes` e `/admin/modalidades`.
3. Validar que filtros, ações e estados vazios usam o mesmo conjunto de componentes.
4. Abrir páginas de criação/edição representativas e validar coerência visual de campos e CTAs.
5. Confirmar que nenhuma tela migrada mostra texto mockado nem referências externas ao sistema.

## Automated checks

- `cd frontend && npm run build`
- `cd frontend && npm run test:e2e`
