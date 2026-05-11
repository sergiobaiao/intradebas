# Feature Specification: Admin Menu Structure

**Feature Branch**: `053-admin-menu-structure`  
**Created**: 2026-05-11  
**Status**: Draft  
**Input**: User description: "Reorganizar o menu administrativo para remover itens redundantes de criação, mantendo Equipes e Modalidades como páginas de gestão com botão interno de novo cadastro, movendo Atletas para Cadastros com ação de inclusão por lá, e preservando a navegação Studio Admin consistente."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navegar sem duplicar ações no menu (Priority: P1)

Como membro da comissão, quero ver no menu apenas as páginas de gestão e não itens duplicados de criação, para navegar com menos ruído e menos chance de abrir a mesma área por caminhos diferentes.

**Why this priority**: O menu atual mistura navegação com ações de criação e isso reduz a clareza operacional.

**Independent Test**: Abrir qualquer página admin e verificar que o menu não exibe itens redundantes como "Nova equipe" ou "Nova modalidade".

**Acceptance Scenarios**:

1. **Given** que o administrador abre uma tela admin, **When** observa o menu lateral, **Then** encontra apenas as páginas de gestão principais.
2. **Given** que existe uma página de gestão para equipes ou modalidades, **When** o usuário busca criar um novo registro, **Then** a ação fica dentro da página de gestão e não no menu lateral.

---

### User Story 2 - Centralizar Atletas em Cadastros (Priority: P1)

Como membro da comissão, quero acessar Atletas como parte de Cadastros e não como item isolado de operação, para que a navegação reflita melhor o domínio de dados cadastrados.

**Why this priority**: Atletas é um cadastro central do sistema e precisa seguir a mesma lógica de entrada das demais entidades cadastrais.

**Independent Test**: Abrir o menu lateral e confirmar que Atletas aparece no grupo de Cadastros, com a ação de inclusão disponível na página de Atletas.

**Acceptance Scenarios**:

1. **Given** que o menu é exibido, **When** o usuário procura Atletas, **Then** ele encontra Atletas dentro de Cadastros.
2. **Given** que o usuário entra na página de Atletas, **When** precisa criar um novo atleta, **Then** a ação de inclusão está disponível na própria página.

---

### User Story 3 - Manter consistência visual do Studio Admin (Priority: P2)

Como membro da comissão, quero que a reorganização do menu preserve o padrão visual Studio Admin, para que a experiência administrativa continue consistente.

**Why this priority**: A feature 051 já definiu o padrão visual do admin e essa mudança deve respeitar essa direção.

**Independent Test**: Abrir uma página admin e verificar que o menu continua com a mesma estrutura visual, hierarquia e destaque do estado ativo.

**Acceptance Scenarios**:

1. **Given** que o menu foi reorganizado, **When** o usuário navega entre páginas admin, **Then** a estrutura visual permanece consistente.
2. **Given** que uma rota está ativa, **When** o menu é renderizado, **Then** o item correspondente permanece destacado.

### Edge Cases

- Quando a página de gestão estiver vazia, a ação de criação continua visível dentro da página.
- Quando o usuário estiver em uma subpágina de detalhe/criação, o item pai correspondente continua destacado.
- Quando houver muitas rotas administrativas, o menu deve continuar agrupado por domínio sem duplicar ações.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST remover do menu lateral itens redundantes de criação como "Nova equipe" e "Nova modalidade".
- **FR-002**: O sistema MUST manter "Equipes" e "Modalidades" como páginas de gestão acessadas pelo menu lateral.
- **FR-003**: O sistema MUST exibir a ação de criação de equipe dentro da página de gestão de equipes.
- **FR-004**: O sistema MUST exibir a ação de criação de modalidade dentro da página de gestão de modalidades.
- **FR-005**: O sistema MUST mover Atletas para o grupo de Cadastros no menu lateral.
- **FR-006**: O sistema MUST disponibilizar a ação de inclusão de atleta dentro da página de gestão de atletas.
- **FR-007**: O sistema MUST preservar os demais agrupamentos do menu administrativo de forma coerente com o Studio Admin.
- **FR-008**: O sistema MUST manter o item ativo destacado ao navegar entre páginas.

### Key Entities *(include if feature involves data)*

- **Admin Menu Item**: Representa uma rota do menu lateral com rótulo, agrupamento e estado ativo.
- **Admin Management Page**: Representa uma página de listagem/gestão que pode expor ação interna de criação.
- **Admin Create Action**: Representa o botão/link de criação exposto dentro da própria página de gestão.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Nenhum item de criação redundante aparece no menu lateral.
- **SC-002**: Atletas aparece dentro de Cadastros no menu lateral.
- **SC-003**: As páginas de Equipes, Modalidades e Atletas exibem suas ações de criação internamente.
- **SC-004**: O item ativo do menu fica destacado corretamente em 100% das rotas afetadas.
- **SC-005**: O layout do menu permanece consistente com o padrão visual do Studio Admin.

## Assumptions

- A feature 051 já fornece a base visual do admin.
- A feature 052 já fornece o shell administrativo compartilhado.
- Esta feature altera navegação e posicionamento de ações, não regras de negócio nem contratos de API.
- As páginas de gestão já possuem ou receberão a ação de criação interna correspondente.
