# Data Model: Ranking Tiebreak Settings

## RankingSettings

- Fields:
  - `id`: string singleton, valor fixo `default`
  - `tieBreakRule`: enum `alphabetical | most_wins | most_podiums`
  - `updatedBy`: string
  - `updatedAt`: datetime
- Relationships:
  - `updatedByUser` -> `User`
- Rules:
  - deve existir no maximo um registro operacional ativo
  - quando ausente, o sistema assume `most_wins`

## RankingRow

- Fields:
  - `id`
  - `name`
  - `color`
  - `totalScore`
  - `wins`
  - `podiums`
  - `tieBreakRule`
- Source:
  - `totalScore` vem da soma de `result.calculatedPoints`
  - `wins` vem da contagem de resultados com `position = 1`
  - `podiums` vem da contagem de resultados com `position <= 3`
- Rules:
  - ordenacao primaria por `totalScore desc`
  - desempate por `tieBreakRule`
  - fallback final por `name asc`

## RankingSettingsSummary

- Fields:
  - `id`
  - `tieBreakRule`
  - `updatedAt`
  - `updatedByUser { id, name, email } | null`
- Rules:
  - usado pelo frontend admin para exibicao e edicao da regra operacional
