# Contracts: Ranking Tiebreak Settings

## Settings

- `GET /api/v1/settings/ranking`
  - Auth required: yes
  - Response:
    - `{ id, tieBreakRule, updatedAt, updatedByUser? }`
  - Fallback behavior:
    - se nao houver configuracao persistida, retorna `tieBreakRule = "most_wins"` e `updatedByUser = null`

- `PATCH /api/v1/settings/ranking`
  - Auth required: yes
  - Request:
    - `{ tieBreakRule: "alphabetical" | "most_wins" | "most_podiums" }`
  - Response:
    - `{ id, tieBreakRule, updatedAt, updatedByUser }`
  - Side effect:
    - invalida cache do ranking
    - publica evento `ranking-updated`

## Results Ranking

- `GET /api/v1/results/ranking`
  - Auth required: no
  - Response:
    - `Array<{ id, name, color, totalScore, wins, podiums, tieBreakRule }>`
  - Ordering:
    - `totalScore desc`
    - criterio definido em `tieBreakRule`
    - `name asc` como fallback final
