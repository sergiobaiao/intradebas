# Feature Specification: Public Layout System

**Feature Branch**: `056-public-layout-system`  
**Created**: 2026-05-12  
**Status**: Draft  
**Input**: User description: "Prosseguir apos a 055 priorizando o portal publico, que ainda esta parcial e sem uma navegacao dedicada consistente."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navegar no portal com header e footer dedicados (Priority: P1)

Como visitante, quero navegar pelo portal publico com uma navegacao clara e persistente, para encontrar inscricao, resultados, patrocinio e area do atleta sem depender de links soltos na home.

**Why this priority**: O layout publico atual ainda parece provisório e prejudica a descoberta das áreas principais.

**Independent Test**: Abrir `/`, navegar pelos links principais no header/footer e confirmar acesso consistente às rotas públicas.

**Acceptance Scenarios**:

1. **Given** que o visitante acessa a home, **When** observa a estrutura superior da página, **Then** encontra header com identidade, navegação principal e ações prioritárias.
2. **Given** que o visitante chega ao final de qualquer rota pública principal, **When** precisa continuar a navegação, **Then** encontra footer com atalhos relevantes e contato.

---

### User Story 2 - Entender o evento pela home com dados reais (Priority: P1)

Como visitante, quero que a home explique rapidamente o evento e mostre indicadores reais do sistema, para confiar que o portal está ativo e útil.

**Why this priority**: A landing atual é um placeholder técnico e não representa o produto final.

**Independent Test**: Abrir `/` e verificar hero, blocos institucionais e métricas/resumos derivados das APIs existentes, sem texto mockado.

**Acceptance Scenarios**:

1. **Given** que existem equipes, modalidades, atletas ou cotas cadastradas, **When** a home é carregada, **Then** os blocos de destaque refletem esses dados reais.
2. **Given** que alguma fonte de dados retorna vazia, **When** a home é renderizada, **Then** o portal mantém estados vazios claros sem quebrar o layout.

---

### User Story 3 - Evoluir páginas públicas sobre uma base reutilizável (Priority: P2)

Como equipe de desenvolvimento, queremos componentes compartilhados para o shell público, para que próximas telas públicas adotem a mesma linguagem visual sem repetir estrutura.

**Why this priority**: O mesmo problema que existia no admin ainda aparece no portal público.

**Independent Test**: Revisar o código do shell público e da home e confirmar encapsulamento em componentes compartilhados.

**Acceptance Scenarios**:

1. **Given** que uma nova página pública precise ser criada, **When** a equipe consultar o frontend, **Then** encontra componentes compartilhados de header, footer e seções-base.
2. **Given** que uma rota pública existente seja aberta, **When** comparada à home, **Then** a identidade visual principal é coerente.

### Edge Cases

- Quando o backend estiver indisponível, a home deve manter renderização estável com fallback vazio.
- Quando o usuário navegar em mobile, o menu principal deve continuar acessível sem quebrar a hierarquia visual.
- Quando a rota for administrativa ou de autenticação admin, o shell público não deve ser renderizado por cima.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST definir um shell público compartilhado com header e footer dedicados para as rotas públicas principais.
- **FR-002**: O sistema MUST manter as rotas administrativas e de login admin fora desse shell público.
- **FR-003**: O sistema MUST reescrever a home para apresentar o evento, áreas-chave e indicadores com dados reais vindos das APIs existentes.
- **FR-004**: O sistema MUST manter estados vazios explícitos quando algum conjunto de dados real estiver indisponível.
- **FR-005**: O sistema MUST priorizar responsividade mobile-first no header, hero e grades principais da home.
- **FR-006**: O sistema MUST evitar textos de placeholder técnico ou links de diagnóstico como conteúdo principal da home.
- **FR-007**: O sistema MUST validar o shell público e a home com testes automatizados representativos.

### Key Entities *(include if feature involves data)*

- **Public Shell Component**: Estrutura compartilhada de header, navegação principal e footer das rotas públicas.
- **Home Highlights Section**: Blocos com indicadores e chamadas derivados de atletas, equipes, modalidades, cotas e backdrop.
- **Public Navigation Model**: Conjunto de links principais para inscrição, resultados, atleta, patrocinador, ALDEBARUN e privacidade.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A home deixa de parecer página provisória e passa a apresentar navegação e seções institucionais consistentes.
- **SC-002**: O header público funciona em desktop e mobile nas rotas públicas principais.
- **SC-003**: A home passa a consumir dados reais do sistema sem introduzir conteúdo mockado.
- **SC-004**: As rotas admin continuam sem interferência do shell público.
- **SC-005**: Build e E2E do frontend passam cobrindo a nova experiência pública.

## Assumptions

- As APIs públicas atuais de atletas, ranking, modalidades, cotas e backdrop permanecem disponíveis.
- A feature cobre shell e home; ajustes visuais profundos de todas as páginas públicas podem ser incrementais em features seguintes.
