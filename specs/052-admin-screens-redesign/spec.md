# Feature Specification: Admin Screens Redesign

**Feature Branch**: `052-admin-screens-redesign`  
**Created**: 2026-05-11  
**Status**: Draft  
**Input**: User description: "Padronizar as demais telas administrativas do INTRADEBAS com o padrão visual Studio Admin aprovado na feature 051, reutilizando sidebar/topbar, cartões, tabelas, filtros, estados vazios, responsividade e dados reais, sem introduzir dados mockados."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navegar entre telas administrativas com layout consistente (Priority: P1)

Como membro da comissão, quero que as telas de atletas, equipes, modalidades, resultados, patrocínio, mídia, LGPD, auditoria, usuários e configurações tenham estrutura visual consistente com o dashboard para operar o sistema sem alternar entre experiências diferentes.

**Why this priority**: O dashboard foi elevado ao padrão Studio Admin, mas as demais telas ainda usam a estrutura antiga; isso quebra a percepção de produto e dificulta operação.

**Independent Test**: Abrir cada rota administrativa principal e confirmar que todas usam uma estrutura comum de cabeçalho, cartões/tabelas e navegação de retorno coerente.

**Acceptance Scenarios**:

1. **Given** que o administrador acessa uma tela administrativa principal, **When** a página carrega, **Then** ela apresenta cabeçalho, conteúdo e ações com o mesmo padrão visual do dashboard.
2. **Given** que o administrador navega entre telas, **When** troca de domínio administrativo, **Then** a hierarquia visual permanece consistente.
3. **Given** uma rota sem registros, **When** a tela é renderizada, **Then** aparece estado vazio explícito sem dados fictícios.

---

### User Story 2 - Trabalhar com listas e tabelas reais de forma legível (Priority: P1)

Como administrador, quero visualizar listas administrativas em tabelas/cards legíveis, com status e ações claras, usando apenas dados reais do backend.

**Why this priority**: As principais operações do admin dependem de revisar cadastros, resultados, patrocinadores, mídia e solicitações LGPD.

**Independent Test**: Validar que cada tela de listagem usa dados reais, não exibe conteúdo mockado, mantém ações existentes e apresenta fallback quando a API retorna vazio.

**Acceptance Scenarios**:

1. **Given** que há dados reais, **When** a tela de listagem é aberta, **Then** registros reais aparecem em tabela/card com status e ações.
2. **Given** que não há dados reais, **When** a tela é aberta, **Then** o usuário vê mensagem de ausência de dados, não placeholders falsos.
3. **Given** que uma ação já existia antes, **When** a tela é redesenhada, **Then** a ação continua disponível.

---

### User Story 3 - Usar formulários administrativos com apresentação consistente (Priority: P2)

Como administrador, quero que formulários de criação/edição tenham visual e organização consistentes para reduzir erros operacionais.

**Why this priority**: O sistema tem várias telas de criação/edição e elas precisam acompanhar o padrão sem alterar contratos ou regras existentes.

**Independent Test**: Abrir formulários principais e confirmar que campos, botões, mensagens e agrupamento visual seguem padrão comum sem quebrar submissões.

**Acceptance Scenarios**:

1. **Given** que um formulário administrativo é aberto, **When** os campos são exibidos, **Then** eles aparecem em cartões/seções legíveis.
2. **Given** que o usuário submete um formulário válido, **When** a ação conclui, **Then** o comportamento existente é preservado.

---

### User Story 4 - Operar o admin em telas menores (Priority: P2)

Como administrador em campo, quero usar as telas administrativas em notebook/tablet/celular sem quebra visual ou tabelas ilegíveis.

**Why this priority**: A operação do evento pode ocorrer fora de desktops grandes.

**Independent Test**: Verificar rotas administrativas principais em larguras de 1440px, 1024px, 768px e 390px.

**Acceptance Scenarios**:

1. **Given** viewport reduzida, **When** uma tela admin é aberta, **Then** o layout adapta tabelas/cards sem sobreposição.
2. **Given** uma tabela larga, **When** exibida em mobile, **Then** ela preserva leitura por adaptação ou rolagem controlada.

### Edge Cases

- APIs vazias ou indisponíveis devem gerar estados vazios/erro sem conteúdo falso.
- Telas protegidas por autenticação devem preservar o fluxo de login existente.
- Dados pessoais de atletas devem continuar restritos às telas administrativas que já os exibiam.
- Links e ações existentes não podem desaparecer durante o redesign.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST aplicar o padrão visual Studio Admin às principais rotas administrativas além de `/admin/dashboard`.
- **FR-002**: O sistema MUST preservar todas as ações e links administrativos existentes.
- **FR-003**: O sistema MUST usar apenas dados reais vindos das APIs existentes ou estados vazios explícitos.
- **FR-004**: O sistema MUST padronizar listas/tabelas/cards administrativos com status, ações e hierarquia visual clara.
- **FR-005**: O sistema MUST padronizar formulários administrativos principais sem alterar contratos de envio.
- **FR-006**: O sistema MUST manter responsividade em desktop, tablet e mobile.
- **FR-007**: O sistema MUST evitar qualquer dado mockado, nome fictício, métrica falsa ou texto copiado da referência.
- **FR-008**: O sistema MUST manter compatibilidade com testes existentes e adicionar validação automatizada mínima para rotas admin redesenhadas.

### Key Entities *(include if feature involves data)*

- **Admin Page Shell**: Estrutura visual comum de página administrativa.
- **Admin Data View**: Tabela, card grid ou lista que representa dados reais de uma área administrativa.
- **Admin Form Section**: Agrupamento visual de campos e ações em formulários.
- **Admin Empty State**: Mensagem explícita para ausência ou indisponibilidade de dados.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Pelo menos 8 rotas administrativas principais usam o novo padrão visual.
- **SC-002**: 100% das ações existentes nas telas alteradas permanecem acessíveis.
- **SC-003**: Nenhuma tela alterada apresenta dados fictícios quando APIs retornam vazio.
- **SC-004**: As rotas alteradas não quebram visualmente em 1440px, 1024px, 768px e 390px.
- **SC-005**: Build do frontend passa após o redesign.
- **SC-006**: Testes E2E existentes continuam passando e há cobertura mínima para navegação/visual admin redesenhado.

## Assumptions

- A feature 051 é a base visual aprovada para o admin.
- Esta feature prioriza telas principais; detalhes menores podem ser finalizados em features específicas se surgirem fluxos complexos.
- Não serão criados novos endpoints backend salvo se uma tela já depender de dados indisponíveis e isso for explicitamente registrado.
- O objetivo é padronização visual e operacional, não mudança de regra de negócio.
