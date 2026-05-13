# Feature Specification: Ranking Tiebreak Settings

**Feature Branch**: `060-ranking-tiebreak-settings`  
**Created**: 2026-05-12  
**Status**: Draft  
**Input**: User description: "prossiga" after feature 059, closing the remaining configuration gap for ranking tie-break rules.

## Requirements *(mandatory)*

- **FR-001**: O sistema MUST persistir uma regra de desempate do ranking configuravel pelo painel administrativo.
- **FR-002**: O backend MUST suportar ao menos os criterios `most_wins`, `most_podiums` e `alphabetical`.
- **FR-003**: O ranking MUST considerar a regra configurada sempre que houver empate por pontuacao total entre equipes.
- **FR-004**: O painel administrativo MUST permitir visualizar e alterar a regra de desempate ativa.
- **FR-005**: O sistema MUST expor metricas reais de apoio ao ranking, incluindo vitorias e podios por equipe.
- **FR-006**: O sistema MUST invalidar cache/publicar atualizacao do ranking ao alterar a regra de desempate.
- **FR-007**: O sistema MUST manter testes automatizados representativos para backend e frontend.

## Success Criteria *(mandatory)*

- **SC-001**: Empates de pontuacao deixam de depender apenas de ordem alfabetica quando outra regra estiver configurada.
- **SC-002**: Admins conseguem alterar a regra de desempate em `/admin/configuracoes`.
- **SC-003**: O ranking admin passa a exibir contexto operacional de vitorias/podios e o criterio ativo.
- **SC-004**: `npm test`, `npm run build` e `npm run test:e2e` passam sem regressao.
