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
4. Aplique as migrations localmente com `npm run prisma:migrate`.
5. Para ambientes de deploy, use `npm run prisma:migrate:deploy`.
6. Popule dados-base com `npm run prisma:seed`.
7. Rode os testes automatizados do backend com `cd backend && npm test`.
8. Rode `docker compose -f docker-compose.dev.yml up --build`.

## Homologacao automatizada

Existe agora um fluxo dedicado para homologacao em VM com proxy reverso externo.

- workflow: `.github/workflows/deploy-homolog.yml`
- compose de homologacao: `docker-compose.homolog.yml`
- script remoto: `scripts/deploy-homolog.sh`
- guia de setup: [docs/homolog-cicd.md](/files/intradebas/docs/homolog-cicd.md)

Esse fluxo foi pensado para uma VM que ja possui nginx proxy fora deste repositorio, entao ele nao sobe o `nginx` interno do projeto nem ocupa `80/443`.

## Prisma workflow

O projeto agora possui migration baseline versionada em `backend/prisma/migrations/`.

- desenvolvimento com novas alteracoes de schema: `cd backend && npm run prisma:migrate`
- deploy/homologacao/producao: `cd backend && npm run prisma:migrate:deploy`
- reset local completo quando necessario: `cd backend && npm run prisma:migrate:reset`

`prisma db push` permanece disponivel apenas como ferramenta auxiliar local, nao como fluxo padrao de deploy.

## Credenciais admin locais

Depois de `npm run prisma:seed`, o backend cria credenciais locais de desenvolvimento.

Consulte `credentials.md` no ambiente local.

## Rotas admin iniciais

- `/login`
- `/recuperar-senha`
- `/redefinir-senha`
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

## APIs admin protegidas implementadas

- `PATCH /api/v1/athletes/:id/status`
- `POST /api/v1/results`
- `PATCH /api/v1/sponsors/:id/activate`

## Proximos passos recomendados

1. Clonar/adaptar o template `next-shadcn-admin-dashboard` dentro de `frontend/`.
2. Implementar modulos de autenticacao, atletas e equipes no backend.
3. Conectar o frontend aos contratos `/api/v1`.
4. Adicionar migrations, seed e testes de contrato.
