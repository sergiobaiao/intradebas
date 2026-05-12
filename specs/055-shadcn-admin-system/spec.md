# Feature Specification: Shadcn Admin System

**Feature Branch**: `055-shadcn-admin-system`  
**Created**: 2026-05-12  
**Status**: Draft  
**Input**: User description: "Implementar shadcn/ui como design system do admin, substituindo a abordagem de CSS ad hoc por componentes reutilizáveis alinhados ao padrão do next-shadcn-admin-dashboard, sem usar dados mockados."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navegar no admin com componentes consistentes (Priority: P1)

Como membro da comissão, quero que o shell administrativo e os blocos principais do admin usem componentes consistentes, para que a navegação pareça parte de um sistema único e não de páginas montadas isoladamente.

**Why this priority**: O problema atual é estrutural. Sem uma base visual comum, cada nova tela volta a divergir.

**Independent Test**: Abrir dashboard e subpáginas administrativas principais e verificar que cabeçalhos, cartões, áreas de ação e superfícies seguem o mesmo padrão visual e estrutural.

**Acceptance Scenarios**:

1. **Given** que o usuário acessa `/admin/dashboard`, **When** navega para uma subpágina administrativa, **Then** a aplicação preserva o mesmo shell e os mesmos padrões de superfície, tipografia e ações.
2. **Given** que uma página administrativa precisa exibir blocos de conteúdo, **When** ela é renderizada, **Then** usa componentes reutilizáveis em vez de composição visual ad hoc por página.

---

### User Story 2 - Operar listas e formulários admin com padrão reutilizável (Priority: P1)

Como membro da comissão, quero que listas, tabelas, estados vazios e formulários administrativos usem a mesma biblioteca de componentes, para reduzir inconsistência visual e facilitar manutenção.

**Why this priority**: As telas operacionais dependem diretamente de listas e formulários; sem essa padronização o admin continua fragmentado.

**Independent Test**: Abrir páginas representativas de cadastros e operação e confirmar que listas, filtros, formulários e ações seguem o mesmo conjunto de componentes.

**Acceptance Scenarios**:

1. **Given** que o usuário abre uma tela de gestão com dados reais, **When** visualiza listagens e ações, **Then** encontra o mesmo padrão de tabela/cartão/toolbar em todas as telas migradas.
2. **Given** que o usuário abre uma tela de criação ou edição, **When** interage com campos e botões, **Then** encontra agrupamento visual consistente e ações previsíveis.

---

### User Story 3 - Evoluir o admin sem depender de CSS espalhado por página (Priority: P2)

Como equipe de desenvolvimento, queremos um conjunto base de componentes administrativos, para que novas features admin possam ser implementadas sem repetir classes e estilos diretamente nas páginas.

**Why this priority**: Isso reduz regressão visual e acelera as próximas features 053+.

**Independent Test**: Inspecionar o código das páginas migradas e verificar que a composição principal passa por componentes compartilhados do design system administrativo.

**Acceptance Scenarios**:

1. **Given** que uma página admin é alterada nesta feature, **When** o código é revisado, **Then** a estrutura visual principal está encapsulada em componentes reutilizáveis.
2. **Given** que a equipe precisa criar uma nova tela administrativa, **When** consulta a base do frontend, **Then** encontra componentes reutilizáveis suficientes para montar a tela sem reinventar layout base.

### Edge Cases

- Quando uma tela não tiver dados retornados pelo backend, o estado vazio continua explícito e consistente com o design system.
- Quando uma tela possuir tabela larga ou formulário extenso, a responsividade deve permanecer utilizável em desktop, tablet e mobile.
- Quando uma página ainda não for migrada integralmente, ela não pode quebrar o shell administrativo compartilhado.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST incorporar `shadcn/ui` como base de componentes reutilizáveis do frontend administrativo.
- **FR-002**: O sistema MUST definir componentes compartilhados para shell, cabeçalho de página, cartão/superfície, barra de ações, estado vazio e estrutura de formulário administrativo.
- **FR-003**: O sistema MUST migrar o dashboard admin e as subpáginas administrativas prioritárias para usar esses componentes compartilhados.
- **FR-004**: O sistema MUST preservar dados reais existentes e não introduzir conteúdo mockado nas telas migradas.
- **FR-005**: O sistema MUST manter a navegação administrativa consistente entre dashboard e subpáginas.
- **FR-006**: O sistema MUST reduzir a dependência de classes CSS visuais definidas diretamente em páginas administrativas migradas.
- **FR-007**: O sistema MUST manter responsividade nas telas administrativas migradas.
- **FR-008**: O sistema MUST validar a experiência administrativa migrada com testes automatizados representativos.

### Key Entities *(include if feature involves data)*

- **Admin Shell Component**: Estrutura compartilhada de navegação, sidebar, topbar e área de conteúdo do admin.
- **Admin Surface Component**: Bloco reutilizável para cartões, painéis, seções e estados vazios.
- **Admin Form Component**: Estrutura reutilizável para formulários administrativos com agrupamento, ações e mensagens.
- **Admin Data View Component**: Estrutura reutilizável para listas, tabelas e áreas operacionais com dados reais.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Dashboard e subpáginas administrativas migradas passam a apresentar o mesmo shell visual e estrutural.
- **SC-002**: Telas administrativas migradas deixam de depender majoritariamente de composição visual ad hoc por página.
- **SC-003**: Nenhuma tela migrada passa a exibir dados mockados ou textos de referência não pertencentes ao sistema.
- **SC-004**: As rotas administrativas representativas continuam utilizáveis em desktop e mobile sem quebra estrutural.
- **SC-005**: Testes automatizados cobrindo as telas administrativas migradas passam sem regressão.

## Assumptions

- O backend e os contratos de dados atuais permanecem como fonte real das telas administrativas.
- A migração será incremental, priorizando o admin existente em vez de reescrever todo o frontend de uma vez.
- O shell administrativo compartilhado da feature 052 pode ser reaproveitado e refinado.
- A adoção de `shadcn/ui` não altera regras de negócio nem contratos de API.
