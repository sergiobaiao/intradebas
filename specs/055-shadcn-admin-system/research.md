# Research: Shadcn Admin System

## Decision 1: Adocao real de `shadcn/ui` em projeto existente

- Decision: configurar Tailwind/import alias e adicionar `components.json` e primitives `shadcn/ui` manualmente no projeto atual.
- Rationale: o frontend ja existe; a documentacao oficial do `shadcn/ui` para Next.js orienta configurar Tailwind e alias antes de adicionar componentes.
- Alternatives considered: reescrever o frontend a partir de um template novo foi rejeitado por risco alto e retrabalho desnecessario.

## Decision 2: Separar primitives `ui` de componentes `admin`

- Decision: usar `frontend/components/ui/*` para primitives (`Button`, `Card`, `Input`, `Table`, `Badge`, etc.) e `frontend/components/admin/*` para headers, surfaces, sections e data views do admin.
- Rationale: preserva o design system oficial e cria uma camada semantica para o dominio administrativo.
- Alternatives considered: usar apenas primitives direto nas paginas foi rejeitado porque nao reduz suficientemente a repeticao estrutural.

## Decision 3: Migracao incremental de telas representativas

- Decision: priorizar shell, dashboard, listagens de atletas/equipes/modalidades e formularios principais.
- Rationale: cobre navegação, data views e forms, que sao os pontos de maior divergencia hoje.
- Alternatives considered: migrar todo `/admin` em uma unica passada foi rejeitado por escopo alto e maior risco de regressao.

## Decision 4: Manter dados reais e contratos atuais

- Decision: refatorar apenas a camada visual/composicao, mantendo os fetch helpers e endpoints reais.
- Rationale: a feature trata consistencia e manutencao visual, nao regras de negocio.
- Alternatives considered: introduzir stubs/component examples foi rejeitado explicitamente pelo escopo e pelo historico do projeto.
