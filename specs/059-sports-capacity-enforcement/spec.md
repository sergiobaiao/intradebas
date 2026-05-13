# Feature Specification: Sports Capacity Enforcement

**Feature Branch**: `059-sports-capacity-enforcement`  
**Created**: 2026-05-12  
**Status**: Draft  
**Input**: User description: "prossiga" after feature 058, addressing the remaining functional gap for participant limits in sports/modalities.

## Requirements *(mandatory)*

- **FR-001**: O sistema MUST permitir configurar quantidade minima e maxima de participantes por modalidade no painel administrativo.
- **FR-002**: O backend MUST validar que o minimo configurado nao seja maior que o maximo configurado.
- **FR-003**: O backend MUST impedir novas inscricoes ou alteracoes de atleta quando a modalidade selecionada ja tiver atingido o limite maximo de participantes.
- **FR-004**: O frontend administrativo MUST exibir e permitir editar os limites de participantes nas telas de modalidades.
- **FR-005**: O sistema MUST manter testes automatizados representativos para a validacao dos limites.

## Success Criteria *(mandatory)*

- **SC-001**: Administradores conseguem cadastrar e editar limites minimos e maximos em modalidades.
- **SC-002**: O cadastro de atleta falha com mensagem clara quando uma modalidade atingir sua capacidade maxima.
- **SC-003**: As APIs e telas administrativas passam a refletir os limites configurados.
- **SC-004**: Build e testes de backend e frontend passam sem regressao.
