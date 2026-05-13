# Feature Specification: Public Pages Redesign

**Feature Branch**: `057-public-pages-redesign`  
**Created**: 2026-05-12  
**Status**: Draft  
**Input**: User description: "prosseguir" after feature 056, completing the redesign of the remaining public pages in the new public shell.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navegar pelas páginas públicas no mesmo sistema visual (Priority: P1)

Como visitante, quero que páginas públicas como resultados, patrocínio, ALDEBARUN, backdrop e privacidade tenham a mesma linguagem visual da home, para perceber o portal como um produto coeso.

**Independent Test**: Abrir essas rotas e confirmar cabeçalhos, superfícies, CTAs e estados vazios consistentes.

### User Story 2 - Operar páginas públicas com dados reais e melhor hierarquia (Priority: P1)

Como visitante, quero entender rapidamente cada módulo público por meio de hierarquia visual melhor, sem perder os dados reais já entregues.

**Independent Test**: Validar páginas públicas principais com dados reais e sem conteúdo mockado.

### User Story 3 - Evoluir o portal público sobre componentes reutilizáveis (Priority: P2)

Como equipe de desenvolvimento, queremos componentes públicos compartilhados além do shell, para evitar repetição de estrutura nas próximas páginas.

**Independent Test**: Revisar o código e confirmar reutilização de componentes em `frontend/components/public`.

## Requirements *(mandatory)*

- **FR-001**: O sistema MUST migrar `resultados`, `aldebarun`, `patrocinio`, `patrocinador`, `backdrop` e `privacidade` para o padrão visual público introduzido na `056`.
- **FR-002**: O sistema MUST preservar dados reais e estados vazios explícitos.
- **FR-003**: O sistema MUST reduzir estilos ad hoc e repetição estrutural nessas páginas.
- **FR-004**: O sistema MUST ampliar os testes E2E cobrindo as páginas públicas redesenhadas.

## Success Criteria *(mandatory)*

- **SC-001**: As páginas públicas principais compartilham o mesmo sistema visual da home.
- **SC-002**: Nenhuma dessas páginas volta a usar conteúdo mockado.
- **SC-003**: Build e E2E do frontend passam após a migração.
