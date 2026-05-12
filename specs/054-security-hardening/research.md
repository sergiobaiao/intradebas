# Research: Security Hardening

## Decision 1: Sessao admin via cookies `HttpOnly`

- Decision: mover `access_token` e `refresh_token` para cookies definidos pelo backend, com `HttpOnly`, `SameSite=Lax` e `Secure` apenas em producao.
- Rationale: elimina exposicao direta em `document.cookie`, reduzindo impacto de XSS sem quebrar localhost.
- Alternatives considered: manter bearer token em JS foi rejeitado por expor credenciais; usar `Secure` sempre foi rejeitado por quebrar desenvolvimento em HTTP.

## Decision 2: Proteger endpoints de atletas e publicar subset publico

- Decision: exigir autenticacao em `GET /athletes`, `GET /athletes/:id` e `GET /teams/:id/athletes`, criando `GET /athletes/public` para nome/equipe/modalidades.
- Rationale: evita exposicao de CPF, e-mail e telefone, mantendo um contrato publico para telas abertas.
- Alternatives considered: mascarar CPF no endpoint atual foi rejeitado por manter mistura de uso publico/admin e risco de regressao.

## Decision 3: Fetch admin com `credentials: include`

- Decision: padronizar requests admin do frontend para cookies automaticos e refresh por `POST /auth/refresh`, com helper server-side separado para SSR admin.
- Rationale: preserva App Router, middleware atual e fluxos SSR sem tokens em JavaScript.
- Alternatives considered: criar BFF completo em rotas Next foi rejeitado por ampliar escopo sem necessidade.

## Decision 4: CORS explicito por origem

- Decision: derivar allowlist de `FRONTEND_BASE_URL` e permitir apenas origens locais conhecidas fora de producao.
- Rationale: remove reflexao arbitraria de origem e permite cookies cross-origin apenas para frontend conhecido.
- Alternatives considered: `enableCors()` aberto foi rejeitado por risco CSRF/CORS excessivo.

## Decision 5: Validacao de upload em duas camadas

- Decision: validar tipo/tamanho tanto na entrada HTTP quanto no service de media.
- Rationale: bloqueia tipos invalidos cedo e garante regra de negocio/testes mesmo se a camada HTTP mudar.
- Alternatives considered: validar apenas no interceptor Multer foi rejeitado por cobertura de teste mais fraca e mensagens menos controladas.

## Decision 6: Credenciais MinIO sem fallback inseguro em producao

- Decision: remover fallback `minioadmin` do runtime e exigir credenciais explicitas em producao via schema Joi.
- Rationale: evita deploy inseguro silencioso sem quebrar dev local explicitamente configurado.
- Alternatives considered: fallback global em qualquer ambiente foi rejeitado por contradizer o spec de seguranca.
