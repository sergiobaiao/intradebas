# INTRADEBAS 2026

Base inicial do portal `INTRADEBAS 2026 + ALDEBARUN`, derivada da especificacao tecnica em [INTRADEBAS_2026_Especificacao_Tecnica.md](/files/intradebas/INTRADEBAS_2026_Especificacao_Tecnica.md).

## Estrutura

```text
.
├── backend/                  # API NestJS + Prisma
├── docs/                     # Documentacao derivada da especificacao
├── frontend/                 # App Next.js 15 (App Router)
├── nginx/                    # Reverse proxy local/producao
├── docker-compose.dev.yml
├── docker-compose.prod.yml
└── .env.example
```

## Objetivo desta base

Esta etapa materializa a especificacao em um scaffold tecnico inicial:

- monorepo simples com `frontend` e `backend`
- `docker-compose` para dev e prod
- schema Prisma inicial com as principais entidades do documento
- endpoints minimos de health para os containers
- documentacao de setup e backlog inicial
- persistencia real de `teams` e `athletes` via Prisma/PostgreSQL no backend

## Workflow de especificacao

Este repositorio passa a seguir o fluxo do `github/spec-kit`.

- Constituicao do projeto: [.specify/memory/constitution.md](/files/intradebas/.specify/memory/constitution.md)
- Feature MVP atual: [specs/001-mvp-core-portal/spec.md](/files/intradebas/specs/001-mvp-core-portal/spec.md)
- Plano: [specs/001-mvp-core-portal/plan.md](/files/intradebas/specs/001-mvp-core-portal/plan.md)
- Tarefas: [specs/001-mvp-core-portal/tasks.md](/files/intradebas/specs/001-mvp-core-portal/tasks.md)

Fluxo esperado para proximas entregas:

1. atualizar ou criar `spec.md`
2. derivar `plan.md`
3. derivar `tasks.md`
4. implementar em incrementos pequenos e validaveis

## Setup rapido

1. Copie `.env.example` para `.env`.
2. Ajuste segredos e URLs conforme seu ambiente.
3. Gere o client Prisma em `backend/` com `npm run prisma:generate`.
4. Aplique schema localmente com `npm run prisma:push`.
5. Popule dados-base com `npm run prisma:seed`.
6. Rode os testes automatizados do backend com `cd backend && npm test`.
7. Rode `docker compose -f docker-compose.dev.yml up --build`.

## Credenciais admin locais

Depois de `npm run prisma:seed`, o backend cria credenciais locais de desenvolvimento.

Consulte `credentials.md` no ambiente local.

## Rotas admin iniciais

- `/login`
- `/admin/dashboard`
- `/admin/atletas`

## Rotas publicas atuais

- `/`
- `/inscricao`
- `/resultados`
- `/patrocinio`

## APIs publicas implementadas

- `GET /api/v1/teams`
- `GET /api/v1/athletes`
- `GET /api/v1/results`
- `GET /api/v1/results/ranking`
- `GET /api/v1/sponsorship/quotas`
- `POST /api/v1/sponsors`

## Proximos passos recomendados

1. Clonar/adaptar o template `next-shadcn-admin-dashboard` dentro de `frontend/`.
2. Implementar modulos de autenticacao, atletas e equipes no backend.
3. Conectar o frontend aos contratos `/api/v1`.
4. Adicionar migrations, seed e testes de contrato.
