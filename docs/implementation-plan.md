# Plano Inicial de Implementacao

Documento derivado da especificacao tecnica para orientar o bootstrap do projeto.

## Ordem de entrega recomendada

1. Infraestrutura local com `Docker Compose`.
2. Backend com `NestJS`, `Prisma`, autenticacao e entidades base.
3. Frontend com `Next.js`, layout publico e painel admin.
4. Integracao do ranking, cupons e patrocinio.
5. Tempo real, MinIO e trilha LGPD.

## Recortes de MVP

### Sprint 1

- health checks de frontend e backend
- schema Prisma inicial
- seeds para equipes e cotas
- layout publico minimo
- layout admin minimo

### Sprint 2

- inscricao de atletas
- listagem admin de atletas
- aprovacao de convidados
- validacao de CPF unico

### Sprint 3

- modalidades
- lancamento de resultados
- motor de pontuacao
- ranking publico

### Sprint 4

- patrocinadores
- ativacao de cotas
- geracao de cupons
- resgate de cupom

