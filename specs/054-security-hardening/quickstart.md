# Quickstart: Security Hardening

## Backend validation

1. Fazer login em `/login`.
2. Confirmar no navegador que `document.cookie` nao mostra os cookies admin.
3. Acessar uma tela admin SSR (`/admin/dashboard`) e validar carregamento normal.
4. Chamar `GET /api/v1/athletes` sem autenticacao e esperar `401`.
5. Chamar `GET /api/v1/athletes/public` e validar retorno sem CPF/e-mail/telefone.
6. Enviar 6 tentativas invalidas para `POST /api/v1/auth/login` e validar `429` a partir da sexta.
7. Tentar upload com MIME invalido e com arquivo > 20 MB; ambos devem falhar antes de persistir.
8. Enviar request com `Origin: https://evil.example.com` e validar ausencia de `Access-Control-Allow-Origin`.

## Automated checks

- `cd backend && npm test && npm run build`
- `cd frontend && npm run test:e2e && npm run build`
