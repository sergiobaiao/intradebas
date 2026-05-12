# Feature Specification: Security Hardening — Exposição de PII, Cookies, CORS e Upload

**Feature Branch**: `054-security-hardening`
**Created**: 2026-05-12
**Status**: Draft

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Administrador não tem sessão roubada por XSS (Priority: P1)

Um administrador autenticado navega no painel e, mesmo que uma página da aplicação execute código JavaScript injetado, os tokens de sessão (access e refresh) não são acessíveis ao script e não podem ser exfiltrados.

**Why this priority**: Tokens expostos via JavaScript tornam qualquer XSS um comprometimento total de conta. É a vulnerabilidade de maior impacto imediato para dados de atletas e patrocinadores.

**Independent Test**: Após o login do admin, abrir o DevTools e executar `document.cookie` — os tokens de sessão não devem aparecer na saída.

**Acceptance Scenarios**:

1. **Given** um admin faz login com sucesso, **When** o JavaScript da página lê `document.cookie`, **Then** os cookies `intradebas_admin_token` e `intradebas_admin_refresh_token` não estão presentes no resultado.
2. **Given** um admin está autenticado, **When** uma requisição para uma rota protegida é feita pelo browser, **Then** o cookie de sessão é enviado automaticamente e aceito pelo backend.
3. **Given** o cookie de sessão está marcado como `Secure`, **When** a aplicação está rodando em HTTP simples (localhost de desenvolvimento), **Then** a autenticação ainda funciona localmente.

---

### User Story 2 — Dados pessoais de atletas não são acessíveis sem autenticação (Priority: P1)

Qualquer visitante anônimo que tente listar ou consultar atletas recebe uma resposta de acesso negado, sem que nenhum dado pessoal (CPF, e-mail, telefone) seja retornado.

**Why this priority**: CPF é documento nacional de identificação. Expô-lo publicamente sem autenticação viola a LGPD e a Constituição do projeto ("Security and LGPD by Default").

**Independent Test**: Realizar `GET /api/v1/athletes` e `GET /api/v1/athletes/:id` sem token de autorização e verificar que ambos retornam HTTP 401.

**Acceptance Scenarios**:

1. **Given** nenhum token de autorização é enviado, **When** `GET /api/v1/athletes` é chamado, **Then** a resposta é HTTP 401 e nenhum dado de atleta é retornado.
2. **Given** nenhum token de autorização é enviado, **When** `GET /api/v1/athletes/:id` é chamado, **Then** a resposta é HTTP 401.
3. **Given** um admin autenticado está operando o painel, **When** acessa a listagem de atletas, **Then** a listagem retorna normalmente.
4. **Given** o frontend público precisa exibir dados de atletas, **When** a página pública é carregada, **Then** apenas campos não-sensíveis (nome, equipe, modalidades) são acessíveis via endpoint público dedicado, sem CPF, e-mail ou telefone.

---

### User Story 3 — Requisições de login e recuperação de senha têm limite rigoroso (Priority: P1)

Um agente externo que tente submeter centenas de combinações de credenciais por minuto recebe bloqueio após um número pequeno de tentativas, sem conseguir completar um ataque de força bruta.

**Why this priority**: Sem limite específico por rota, o rate limiter global (120 req/min) é insuficiente para impedir ataques de força bruta direcionados ao login ou ao reset de senha.

**Independent Test**: Enviar 10 requisições seguidas para `POST /auth/login` com credenciais inválidas e verificar que as últimas retornam HTTP 429.

**Acceptance Scenarios**:

1. **Given** um cliente envia mais de 5 requisições para `POST /auth/login` em 60 segundos a partir do mesmo IP, **When** a 6ª requisição chega, **Then** a resposta é HTTP 429.
2. **Given** o mesmo limite se aplica a `POST /auth/forgot-password` e `POST /auth/reset-password`, **When** o limite é atingido, **Then** HTTP 429 é retornado.
3. **Given** um admin legítimo acerta as credenciais dentro do limite, **When** faz login normalmente, **Then** a autenticação é bem-sucedida sem qualquer interferência.

---

### User Story 4 — Upload de mídia só aceita arquivos válidos dentro do tamanho permitido (Priority: P2)

Um administrador ao fazer upload de foto ou vídeo tem o arquivo validado quanto ao tipo e tamanho antes de ser processado, e tentativas de enviar arquivos maliciosos ou excessivamente grandes são rejeitadas com mensagem de erro clara.

**Why this priority**: Sem validação, um admin mal-intencionado ou uma conta comprometida pode fazer upload de arquivos arbitrários, potencialmente executáveis, ou exaurir a memória do servidor.

**Independent Test**: Tentar fazer upload de um arquivo `.exe` e de um arquivo maior que 20 MB via `POST /api/v1/media/upload` — ambos devem retornar HTTP 400.

**Acceptance Scenarios**:

1. **Given** um arquivo com extensão `.exe`, `.sh` ou outro tipo não permitido é enviado, **When** o upload é processado, **Then** a resposta é HTTP 400 com mensagem "Tipo de arquivo não permitido".
2. **Given** um arquivo de imagem válido (JPEG, PNG, WebP) é enviado, **When** o upload é processado, **Then** o arquivo é armazenado normalmente.
3. **Given** um arquivo com tamanho superior a 20 MB é enviado, **When** o upload é processado, **Then** a resposta é HTTP 400 com mensagem "Arquivo excede o tamanho máximo".
4. **Given** um arquivo de vídeo válido (MP4, MOV) é enviado, **When** o upload é processado, **Then** o arquivo é armazenado normalmente.

---

### User Story 5 — CORS restringe origens conhecidas (Priority: P2)

O backend aceita requisições cross-origin somente de domínios configurados explicitamente (frontend local e produção), bloqueando origens arbitrárias.

**Why this priority**: CORS aberto permite que qualquer site externo faça requisições autenticadas em nome de um admin com sessão ativa, configurando um ataque CSRF amplificado.

**Independent Test**: Enviar uma requisição com `Origin: https://evil.example.com` para qualquer endpoint da API e verificar que o header `Access-Control-Allow-Origin` não reflete essa origem.

**Acceptance Scenarios**:

1. **Given** uma requisição com `Origin: https://evil.example.com`, **When** chega ao backend, **Then** o header `Access-Control-Allow-Origin` não está presente ou não contém essa origem.
2. **Given** uma requisição com a origem do frontend configurado (ex.: `http://localhost:3000`), **When** chega ao backend, **Then** é aceita normalmente com `Access-Control-Allow-Origin` correto.
3. **Given** a variável de ambiente `FRONTEND_BASE_URL` define a origem permitida em produção, **When** o backend sobe, **Then** somente essa origem é aceita nas requisições cross-origin.

---

### Edge Cases

- O que acontece se `FRONTEND_BASE_URL` não estiver definida em produção? A API deve recusar todas as origens cross-origin ou aplicar uma lista explícita de fallback segura.
- Cookies com `Secure` em ambiente local (HTTP) não são enviados pelo browser — a solução deve permitir exceção apenas para `localhost`.
- Um atleta sendo aprovado pelo admin enquanto `GET /athletes` está protegido: o frontend público que consome esse endpoint deve ser migrado para um endpoint dedicado não-sensível.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE exigir token de autorização válido para `GET /api/v1/athletes` e `GET /api/v1/athletes/:id`.
- **FR-002**: O sistema DEVE disponibilizar um endpoint público que retorne apenas dados não-sensíveis de atletas (nome, equipe, modalidades), sem CPF, e-mail ou telefone.
- **FR-003**: Os cookies de sessão do painel admin (`intradebas_admin_token` e `intradebas_admin_refresh_token`) DEVEM ser definidos com as flags `HttpOnly` e `SameSite=Lax`; em produção (HTTPS) DEVEM incluir também `Secure`.
- **FR-004**: A definição e leitura dos cookies de sessão admin DEVE ser feita pelo servidor (endpoint de login retorna `Set-Cookie`), não por JavaScript no cliente.
- **FR-005**: O sistema DEVE aplicar limite máximo de 5 requisições por 60 segundos, por IP, para os endpoints `POST /auth/login`, `POST /auth/forgot-password` e `POST /auth/reset-password`.
- **FR-006**: O sistema DEVE configurar CORS com lista explícita de origens permitidas, derivada de variável de ambiente, sem aceitar origens arbitrárias.
- **FR-007**: O endpoint de upload de mídia DEVE rejeitar arquivos com MIME type fora da lista de tipos permitidos (imagens: `image/jpeg`, `image/png`, `image/webp`, `image/gif`; vídeos: `video/mp4`, `video/quicktime`).
- **FR-008**: O endpoint de upload de mídia DEVE rejeitar arquivos com tamanho superior a 20 MB.
- **FR-009**: As credenciais do MinIO (`MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`) DEVEM ser obrigatórias em produção, sem valores padrão inseguros aplicados pelo schema de validação de ambiente.
- **FR-010**: O sistema DEVE retornar HTTP 429 com mensagem clara quando o limite de taxa for atingido em qualquer endpoint protegido por rate limit específico.

### Key Entities

- **Cookie de sessão admin**: par `(access_token, refresh_token)` armazenado em cookies `HttpOnly`, gerenciado pelo servidor.
- **Origem CORS permitida**: conjunto de URLs de origem configurado via variável de ambiente, usado pelo middleware CORS do backend.
- **Configuração de rate limit por rota**: limite de requisições (N por T segundos) associado a endpoints sensíveis específicos, independente do limite global.
- **Tipo de arquivo permitido**: lista de MIME types aceitos pelo endpoint de upload, com correspondente limite de tamanho máximo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `GET /api/v1/athletes` sem token retorna HTTP 401 em 100% das tentativas.
- **SC-002**: Após o login do admin, `document.cookie` no browser não exibe nenhum token de sessão.
- **SC-003**: A partir da 6ª tentativa de login consecutiva com falha pelo mesmo IP em 60 segundos, 100% das requisições retornam HTTP 429.
- **SC-004**: Tentativas de upload com arquivo fora da lista de tipos permitidos retornam HTTP 400 em 100% dos casos, sem armazenar o arquivo.
- **SC-005**: Tentativas de upload com arquivo acima de 20 MB retornam HTTP 400 antes de tentar gravar no storage.
- **SC-006**: Requisições com `Origin` não listado nas origens permitidas não recebem `Access-Control-Allow-Origin` na resposta.
- **SC-007**: O painel admin continua funcionando normalmente para todos os fluxos existentes após a migração dos cookies para `HttpOnly`.

## Assumptions

- O frontend público (páginas acessíveis sem login) consome apenas dados não-sensíveis; um endpoint público dedicado com subset de campos é suficiente para não quebrar essas telas.
- A leitura e renovação dos cookies de sessão admin pelo servidor é compatível com a arquitetura Next.js App Router existente (Server Actions ou API Route para login/refresh).
- O ambiente de desenvolvimento usa `localhost` e pode dispensar o flag `Secure` para facilitar o fluxo local, desde que o comportamento em produção seja estritamente seguro.
- O tamanho máximo de upload de 20 MB cobre os casos de uso de fotos e vídeos curtos de eventos esportivos; vídeos longos ficam fora do escopo deste sistema (usar plataformas como YouTube/Vimeo já suportadas).
- As credenciais MinIO obrigatórias em produção são provisionadas via variáveis de ambiente no deploy; a semente de desenvolvimento local pode continuar usando valores explícitos em `.env.example`.
