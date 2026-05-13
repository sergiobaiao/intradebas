# Research: Ranking Tiebreak Settings

## Decision 1: Persistir a configuracao em tabela dedicada singleton

- Decision: criar `ranking_settings` como tabela singleton com chave fixa `default` e campo `tie_break_rule`.
- Rationale: separa claramente configuracao operacional de regras de pontuacao e evita sobrecarregar `scoring_config` com semantica diferente.
- Alternatives considered: guardar a regra em variavel de ambiente foi rejeitado por nao permitir gestao admin runtime; reutilizar `scoring_config` foi rejeitado por misturar dominio de pontuacao com criterio global de ordenacao.

## Decision 2: Suportar tres criterios explicitos de desempate

- Decision: suportar `most_wins`, `most_podiums` e `alphabetical`.
- Rationale: cobre a assuncao do documento tecnico e fornece fallback deterministico quando nao houver diferenciacao por desempenho.
- Alternatives considered: apenas `most_wins` foi rejeitado por limitar flexibilidade operacional; regras compostas arbitrarias foram rejeitadas por ampliar demais o escopo.

## Decision 3: Expor metricas derivadas no payload de ranking

- Decision: incluir `wins`, `podiums` e `tieBreakRule` na resposta de `GET /results/ranking`.
- Rationale: torna o criterio auditavel e permite que o frontend admin explique a classificacao sem chamadas extras.
- Alternatives considered: manter essas metricas apenas internas foi rejeitado por reduzir transparência operacional; criar endpoint separado foi rejeitado por aumentar round-trips sem ganho real.

## Decision 4: Invalidar cache do ranking ao trocar a regra

- Decision: reaproveitar o mesmo canal/cache de ranking existente (`intradebas:results:ranking`) quando `PATCH /settings/ranking` alterar a configuracao.
- Rationale: garante consistencia imediata entre admin, SSE e paginas publicas sem duplicar infraestrutura.
- Alternatives considered: esperar expirar TTL do cache foi rejeitado por manter classificacao desatualizada; criar novo cache separado foi rejeitado por duplicacao.

## Decision 5: Manter a configuracao no painel administrativo existente

- Decision: adicionar a gestao da regra de desempate em `/admin/configuracoes` e exibir o criterio ativo em `/admin/ranking`.
- Rationale: reaproveita o fluxo operacional ja usado para pesos de pontuacao e mantem a governanca do ranking em um unico modulo.
- Alternatives considered: criar tela admin separada foi rejeitado por fragmentar a administracao do regulamento.
