# Feature Specification: Admin Dashboard Redesign

**Feature Branch**: `051-admin-dashboard-redesign`  
**Created**: 2026-04-28  
**Status**: Draft  
**Input**: User description: "Redesenhar o painel administrativo para seguir o padrão visual e de interação da referência next-shadcn-admin-dashboard, com sidebar persistente, topbar, cards de métricas reais, gráficos/tabelas administrativos, estados vazios e responsividade, sem dados mockados."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navegar pelo painel administrativo com estrutura profissional (Priority: P1)

Como administrador, quero acessar um dashboard com sidebar persistente, topbar e hierarquia visual clara para chegar rapidamente às áreas de atletas, equipes, modalidades, resultados, patrocínio, mídia, LGPD e usuários.

**Why this priority**: A tela atual não atende ao padrão visual definido como referência e dificulta a percepção de produto administrativo completo.

**Independent Test**: Pode ser testado abrindo `/admin/dashboard` e verificando se a navegação administrativa principal aparece de forma persistente, organizada e funcional em desktop.

**Acceptance Scenarios**:

1. **Given** que o administrador acessa `/admin/dashboard`, **When** a página carrega, **Then** ele vê uma sidebar fixa com links administrativos agrupados por domínio.
2. **Given** que o administrador está no dashboard, **When** ele usa os links da sidebar, **Then** cada link leva à tela administrativa correspondente sem depender de uma lista solta de botões.
3. **Given** que a tela é carregada em desktop, **When** o conteúdo é exibido, **Then** a topbar e os cards mantêm espaçamento, alinhamento e densidade visual compatíveis com a referência.

---

### User Story 2 - Ver indicadores reais do evento em cards e painéis (Priority: P1)

Como administrador, quero ver métricas reais do sistema em cards, listas e painéis para entender rapidamente o estado operacional do INTRADEBAS.

**Why this priority**: O projeto não deve usar dados mockados; o dashboard precisa refletir dados reais já disponíveis no backend.

**Independent Test**: Pode ser testado comparando os números do dashboard com as respostas reais de atletas, equipes, resultados, modalidades e patrocínios.

**Acceptance Scenarios**:

1. **Given** que existem atletas cadastrados, **When** o dashboard carrega, **Then** o total de atletas, pendências e distribuição por status são calculados a partir dos dados reais.
2. **Given** que existem equipes e pontuações, **When** o dashboard carrega, **Then** ranking e cards de pontuação usam dados reais das equipes.
3. **Given** que não existem dados em determinada área, **When** o painel correspondente é renderizado, **Then** ele mostra estado vazio claro em vez de números fictícios.

---

### User Story 3 - Operar o dashboard em telas menores (Priority: P2)

Como administrador, quero usar o painel em notebooks e tablets sem quebra de layout para realizar tarefas durante o evento.

**Why this priority**: O uso operacional tende a acontecer em dispositivos variados durante os jogos, e o layout atual não possui estrutura responsiva administrativa.

**Independent Test**: Pode ser testado redimensionando a viewport para larguras comuns de notebook, tablet e celular e verificando que navegação e conteúdo continuam utilizáveis.

**Acceptance Scenarios**:

1. **Given** viewport reduzida, **When** o dashboard é aberto, **Then** cards, tabelas e navegação se reorganizam sem sobreposição de conteúdo.
2. **Given** uma tabela com muitos registros, **When** exibida em tela menor, **Then** ela mantém leitura por rolagem controlada ou adaptação visual.

---

### User Story 4 - Comparar visualmente com a referência aprovada (Priority: P3)

Como stakeholder, quero que o painel entregue tenha padrão visual próximo da referência informada para manter consistência com a direção de produto aprovada.

**Why this priority**: A referência define expectativas de sidebar, topbar, cards, bordas, densidade, tabelas e composição visual.

**Independent Test**: Pode ser testado por revisão visual lado a lado entre a referência e `/admin/dashboard`, observando estrutura e qualidade percebida.

**Acceptance Scenarios**:

1. **Given** a referência aberta ao lado do dashboard, **When** a tela é comparada, **Then** o dashboard contém os mesmos blocos estruturais principais: sidebar, topbar, cards, painel analítico e tabela/lista operacional.
2. **Given** a identidade visual do INTRADEBAS, **When** o novo dashboard é renderizado, **Then** ele mantém a marca do evento sem copiar conteúdo ou dados fictícios da referência.

### Edge Cases

- Quando APIs administrativas públicas retornarem erro ou lista vazia, o dashboard deve exibir fallback explícito e não quebrar a renderização.
- Quando o administrador ainda não estiver autenticado, os links e a experiência devem continuar compatíveis com o fluxo de autenticação existente.
- Quando houver muitas equipes, atletas ou modalidades, o layout deve preservar leitura sem expandir horizontalmente a página inteira.
- Quando o backend estiver indisponível, a página deve indicar ausência de dados sem apresentar métricas falsas.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST substituir a tela simples de `/admin/dashboard` por um layout administrativo com sidebar persistente, topbar e área principal estruturada.
- **FR-002**: O sistema MUST agrupar links administrativos por domínio funcional, incluindo operações, cadastros, competição, patrocínio, mídia, LGPD e segurança.
- **FR-003**: O sistema MUST exibir cards de métricas calculadas exclusivamente a partir de dados reais disponíveis no sistema.
- **FR-004**: O sistema MUST exibir uma seção operacional com ranking ou desempenho real das equipes.
- **FR-005**: O sistema MUST exibir uma tabela ou lista administrativa com registros reais recentes ou relevantes.
- **FR-006**: O sistema MUST apresentar estados vazios quando não houver dados suficientes para métricas, ranking, gráficos ou tabelas.
- **FR-007**: O sistema MUST evitar qualquer dado mockado, placeholder numérico falso ou nome fictício que possa ser confundido com dado real.
- **FR-008**: O sistema MUST manter acesso aos fluxos administrativos já existentes a partir da nova navegação.
- **FR-009**: O sistema MUST ser responsivo para desktop, notebook, tablet e celular, preservando legibilidade e navegação.
- **FR-010**: O sistema MUST preservar a identidade INTRADEBAS enquanto adota o padrão de composição visual da referência aprovada.
- **FR-011**: O sistema MUST manter compatibilidade com os testes automatizados existentes e incluir validação automatizada mínima para o novo dashboard.

### Key Entities *(include if feature involves data)*

- **Admin Navigation Item**: Representa um destino administrativo com nome, grupo funcional, rota e estado visual.
- **Dashboard Metric**: Representa uma métrica calculada a partir de dados reais, com rótulo, valor, descrição e estado.
- **Team Performance Row**: Representa uma equipe no painel de desempenho, com nome, cor e pontuação real.
- **Operational Record**: Representa um registro administrativo real exibido em tabela ou lista, como atleta, resultado, modalidade ou patrocínio.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% dos links administrativos atualmente expostos no dashboard continuam acessíveis pela nova navegação.
- **SC-002**: Nenhum texto, número, nome ou registro fictício é exibido no dashboard quando as APIs retornam listas vazias.
- **SC-003**: O dashboard carrega com status visual utilizável em até 3 segundos em ambiente local de desenvolvimento com dados seed.
- **SC-004**: O layout não apresenta sobreposição horizontal em viewports de 1440px, 1024px, 768px e 390px.
- **SC-005**: Pelo menos um teste automatizado valida que o dashboard renderiza navegação administrativa e métricas sem dados mockados.
- **SC-006**: Em revisão visual lado a lado, a tela contém os blocos estruturais principais da referência: sidebar, topbar, cards, painel analítico e tabela/lista.

## Assumptions

- A referência visual é `https://next-shadcn-admin-dashboard.vercel.app/dashboard`.
- O objetivo é inspiração de estrutura e qualidade visual, não cópia literal de marca, textos ou dados da referência.
- O dashboard deve usar apenas dados reais já disponíveis ou estados vazios explícitos.
- Esta feature cobre prioritariamente `/admin/dashboard`; a padronização visual das demais telas administrativas poderá ser feita em features posteriores.
- O fluxo de autenticação administrativo existente será preservado.
