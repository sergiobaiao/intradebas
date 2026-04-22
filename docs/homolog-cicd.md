# Homolog CI/CD

Este projeto agora suporta deploy automatizado de homologacao para uma VM que ja possui Docker e um nginx proxy externo.

## Branch de deploy

- branch recomendada: `homolog`
- gatilho automatico: `push` para `homolog`
- gatilho manual: `workflow_dispatch` em `.github/workflows/deploy-homolog.yml`

## O que o workflow faz

1. faz checkout do repositorio
2. instala dependencias
3. roda `cd backend && npm test`
4. roda `cd backend && npm run build`
5. roda `cd frontend && npm run build`
6. valida `bash -n scripts/deploy-homolog.sh`
7. conecta por SSH na VM
8. executa `scripts/deploy-homolog.sh`

## Secrets necessarios no GitHub

- `HOMOLOG_HOST`: IP ou hostname da VM Oracle
- `HOMOLOG_USER`: usuario SSH da VM
- `HOMOLOG_SSH_PORT`: porta SSH, normalmente `22`
- `HOMOLOG_SSH_PRIVATE_KEY`: chave privada usada pelo GitHub Actions para entrar na VM
- `HOMOLOG_APP_DIR`: diretorio onde o repositorio esta clonado na VM, por exemplo `/opt/intradebas`

## Bootstrap inicial na VM

1. clone o repositorio na VM
2. crie `.env.homolog` a partir de `.env.homolog.example`
3. garanta que o clone consegue fazer `git pull` do GitHub sem interacao
4. aponte o nginx proxy externo para as portas locais definidas no `.env.homolog`
5. crie os registros DNS de `intradebas.com.br`, `www.intradebas.com.br` e `api.intradebas.com.br`

Exemplo:

```bash
git clone git@github.com:sergiobaiao/intradebas.git /opt/intradebas
cd /opt/intradebas
git checkout homolog
cp .env.homolog.example .env.homolog
```

## Compose de homologacao

O arquivo usado nesse fluxo e `docker-compose.homolog.yml`.

Diferencas principais em relacao ao compose de producao atual:

- nao sobe o `nginx` do projeto
- nao publica `80/443`
- publica apenas:
  - frontend em `127.0.0.1:${HOMOLOG_FRONTEND_PORT}`
  - backend em `127.0.0.1:${HOMOLOG_BACKEND_PORT}`

Isso evita conflito com o nginx proxy ja existente na VM.

## Proxy reverso externo

Configuracao esperada no seu nginx existente:

- `intradebas.com.br` -> `127.0.0.1:${HOMOLOG_FRONTEND_PORT}`
- `api.intradebas.com.br` -> `127.0.0.1:${HOMOLOG_BACKEND_PORT}`
- arquivo pronto para `conf.d`: [nginx/intradebas.com.br.conf](/files/intradebas/nginx/intradebas.com.br.conf)

Exemplo de valores comuns:

- `HOMOLOG_FRONTEND_PORT=13000`
- `HOMOLOG_BACKEND_PORT=14000`

## DNS esperado

- `A intradebas.com.br -> IP da VM`
- `A www.intradebas.com.br -> IP da VM`
- `A api.intradebas.com.br -> IP da VM`

## Script remoto

O script `scripts/deploy-homolog.sh` executa:

1. `git fetch`
2. `git checkout <branch>`
3. `git pull --ff-only`
4. `docker compose build backend frontend`
5. `docker compose up -d db redis minio`
6. `prisma generate`
7. `prisma push`
8. opcionalmente `prisma seed`
9. `docker compose up -d backend frontend`
10. health check do backend

## Seed em homologacao

Por padrao o deploy nao roda seed.

Se quiser habilitar seed automatico:

```env
RUN_SEED_ON_DEPLOY=true
```

Use isso com cuidado para nao sobrescrever dados de homologacao sem querer.
