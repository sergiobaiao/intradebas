# Quickstart: Ranking Tiebreak Settings

## Backend validation

1. Aplicar schema e seed:
   - `cd backend && npm run prisma:generate`
   - `cd backend && npm run prisma:push`
   - `cd backend && npm run prisma:seed`
2. Fazer login admin em `/login`.
3. Abrir `/admin/configuracoes` e alterar a regra de desempate.
4. Consultar `GET /api/v1/settings/ranking` autenticado e validar o retorno persistido.
5. Consultar `GET /api/v1/results/ranking` e confirmar presenca de `wins`, `podiums` e `tieBreakRule`.
6. Criar ou ajustar resultados de forma que duas equipes empatem em pontos e validar que o criterio escolhido altera a ordem exibida.

## Automated checks

- `cd backend && npm run prisma:generate`
- `cd backend && npm test && npm run build`
- `cd frontend && npm run test:e2e -- --reporter=list && npm run build`
