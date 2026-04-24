# ESPECIFICAÇÃO TÉCNICA COMPLETA
# Portal Web INTRADEBAS 2026 + ALDEBARUN
### Versão 1.0 — Documento Spec-Driven

---

## Metadados do Documento

| Campo | Valor |
|---|---|
| Projeto | Portal INTRADEBAS 2026 + ALDEBARUN II |
| Responsável Organizacional | Manoel Neto — 86-98826-5569 |
| Evento | Jogos Internos — Condomínio Aldebaran Ville, Piauí |
| Público Estimado | 300 a 500 pessoas (Classes A e B) |
| Template de Base | next-shadcn-admin-dashboard (Studio Admin) |
| Stack Obrigatória | Next.js + shadcn/ui + Docker |
| Data do Documento | Abril 2026 |

---

# 1. RESUMO EXECUTIVO

O Portal INTRADEBAS 2026 é o sistema web centralizado que operacionaliza integralmente os Jogos Internos do Condomínio Aldebaran Ville — o maior evento esportivo interno de condomínios do Piauí. O sistema compreende duas frentes integradas: a ALDEBARUN II (Corrida da Família) e a temporada poliesportiva principal.

O portal cobre cinco eixos funcionais críticos:

1. **Inscrição e Gestão de Atletas** — Cadastro de moradores titulares, familiares e convidados, com vinculação obrigatória às equipes Mucura, Jacaré ou Capivara.
2. **Comercialização de Patrocínio** — Venda e controle de cotas Bronze, Prata e Ouro com limites automáticos e geração de cupons de cortesia.
3. **Resultados em Tempo Real** — Painel administrativo para input de resultados e motor de cálculo de pontuação por equipe com atualização ao vivo.
4. **Exposição Digital de Patrocinadores** — Backdrop digital dinâmico com priorização de patrocinadores Ouro e galeria de mídia.
5. **Portal Público Mobile-First** — Interface sofisticada voltada às classes A e B, com navegação simplificada e suporte via WhatsApp.

A arquitetura é **Docker-first** desde a concepção, operando sobre o template **next-shadcn-admin-dashboard** (Studio Admin) como base oficial de UI para o painel administrativo, com conformidade total à LGPD.

---

# 2. VERIFICAÇÃO COMPLETA DAS FUNCIONALIDADES (MATRIZ)

## 2.1 Matriz de Funcionalidades por Módulo

| ID | Módulo | Funcionalidade | Fonte no Briefing | Status de Cobertura | Prioridade |
|---|---|---|---|---|---|
| F01 | Atletas | Cadastro de Morador Titular | Seção 2 | ✅ Coberto | MVP |
| F02 | Atletas | Cadastro de Familiar vinculado ao Titular | Seção 2 | ✅ Coberto | MVP |
| F03 | Atletas | Cadastro de Convidado | Seção 2 | ✅ Coberto | MVP |
| F04 | Atletas | Vinculação de Dependente via CPF do Titular | Seção 2 | ✅ Coberto | MVP |
| F05 | Atletas | Coleta obrigatória de tamanho de camiseta | Seção 2 | ✅ Coberto | MVP |
| F06 | Atletas | Seleção obrigatória de equipe (Mucura/Jacaré/Capivara) | Seção 2 | ✅ Coberto | MVP |
| F07 | Atletas | Consentimento LGPD via checkbox | Seção 2 | ✅ Coberto | MVP |
| F08 | Atletas | Inscrição em modalidades (Coletivas/Individuais/Duplas/Fitness) | Seção 2 | ✅ Coberto | MVP |
| F09 | Patrocínio | Cadastro e venda de Cota Bronze (R$350, máx. 8) | Seção 3 | ✅ Coberto | MVP |
| F10 | Patrocínio | Cadastro e venda de Cota Prata (R$500, máx. 4) | Seção 3 | ✅ Coberto | MVP |
| F11 | Patrocínio | Cadastro e venda de Cota Ouro (R$1.000, máx. 2) | Seção 3 | ✅ Coberto | MVP |
| F12 | Patrocínio | Interrupção automática de vendas ao atingir limite | Seção 3 | ✅ Coberto | MVP |
| F13 | Patrocínio | Geração de códigos de cupom de cortesia únicos | Seção 3 | ✅ Coberto | MVP |
| F14 | Patrocínio | Bloqueio de resgate ao atingir limite de cortesias | Seção 3 | ✅ Coberto | MVP |
| F15 | Resultados | Painel Admin protegido para input de resultados | Seção 4 | ✅ Coberto | MVP |
| F16 | Resultados | Live Score com atualização automática de ranking | Seção 4 | ✅ Coberto | MVP |
| F17 | Resultados | Motor de cálculo de pontuação por equipe | Seção 4 | ✅ Coberto | MVP |
| F18 | Resultados | Agregação de pontos por categoria (Individual/Coletivo/Dupla/Fitness) | Seção 4 | ✅ Coberto | MVP |
| F19 | Exposição | Backdrop Digital Dinâmico com priorização de Ouro | Seção 4 | ✅ Coberto | MVP |
| F20 | Exposição | Galeria de mídia (fotos e vídeos YouTube/Vimeo) | Seção 4 | ✅ Coberto | Fase 2 |
| F21 | UI/UX | Interface Mobile-First | Seção 5 | ✅ Coberto | MVP |
| F22 | UI/UX | Suporte via WhatsApp no rodapé | Seção 6 | ✅ Coberto | MVP |
| F23 | Segurança | SSL/HTTPS em todo o portal | Seção 2 | ✅ Coberto | MVP |

## 2.2 Lacunas e Assunções Explícitas

| ID | Lacuna Identificada | Assunção Adotada | Requer Validação |
|---|---|---|---|
| A01 | Sistema de pagamento não especificado | Pagamentos gerenciados off-system (manual/PIX). Admin confirma pagamento e ativa a cota/inscrição manualmente. | ✅ Sim |
| A02 | Peso/pontuação das categorias não definido | Pontuação configurável via Admin (tabela de pesos). Default: Coletivo=3pts, Individual=2pts, Dupla=2pts, Fitness=1pt por posição | ✅ Sim |
| A03 | Limite de atletas por modalidade não especificado | Configurável no Admin por modalidade e por equipe | ✅ Sim |
| A04 | Categorias etárias não mencionadas | Assumido: sem divisão por faixa etária no MVP; campo de data de nascimento coletado para uso futuro | ✅ Sim |
| A05 | Autenticação de admins não detalhada | Login/senha com JWT. Apenas e-mails pré-cadastrados da Comissão têm acesso | ✅ Sim |
| A06 | Cronograma de datas das modalidades não fornecido | Gerenciado pelo Admin via módulo de cronograma | ✅ Sim |
| A07 | Regras de desempate não especificadas | Configurável no Admin; default: maior número de vitórias | ✅ Sim |
| A08 | Processo de resgate de cortesias não detalhado | Código de cupom gerado e enviado por e-mail; resgate via formulário de inscrição | ✅ Sim |
| A09 | Aprovação de inscrição de Convidados não especificada | Convidados exigem aprovação manual do Admin antes de ativação | ✅ Sim |
| A10 | Limite de convidados por morador não especificado | Default: máximo 2 convidados por unidade residencial | ✅ Sim |

---

# 3. REGRAS DE NEGÓCIO CONSOLIDADAS

## 3.1 Regras de Atletas e Inscrições

**RN-ATL-01 — Hierarquia de Vínculo:**
Todo atleta pertence a uma de três categorias: Morador Titular, Familiar ou Convidado. Familiares e Convidados devem obrigatoriamente estar vinculados ao CPF de um Morador Titular ativo.

**RN-ATL-02 — Unicidade de CPF:**
Um CPF não pode ser cadastrado mais de uma vez no sistema. Tentativas de duplicação devem ser bloqueadas com mensagem de erro clara.

**RN-ATL-03 — Vinculação de Equipe Obrigatória:**
Nenhuma inscrição em modalidade pode ser concluída sem a seleção prévia da equipe (Mucura, Jacaré ou Capivara). A equipe não pode ser alterada após confirmação, exceto por Admin.

**RN-ATL-04 — Campos Obrigatórios Mínimos:**
Nome completo, CPF, data de nascimento, telefone, unidade residencial (para titulares), tamanho de camiseta, equipe e aceite LGPD são obrigatórios em todo cadastro.

**RN-ATL-05 — Consentimento LGPD:**
O sistema deve registrar data, hora e IP do aceite LGPD, armazenando este log imutável associado ao CPF do atleta.

**RN-ATL-06 — Aprovação de Convidados:**
Inscrições de Convidados ficam em status "Pendente" até aprovação manual por Admin. Convidados não aparecem no ranking público até ativação.

**RN-ATL-07 — Limite de Convidados:**
Máximo de 2 Convidados por unidade residencial (ASSUNÇÃO A10 — validar com organizador).

**RN-ATL-08 — Inscrição em Modalidades:**
Um atleta pode se inscrever em múltiplas modalidades, desde que dentro das regras de cada categoria:
- Coletivas: composição de time gerenciada pelo Admin
- Duplas: requer par definido no momento da inscrição ou até data-limite
- Individuais e Fitness: inscrição individual direta

## 3.2 Regras de Patrocínio

**RN-PAT-01 — Limites de Cotas:**

| Nível | Valor | Qtd. Máxima | Cortesias | Benefícios |
|---|---|---|---|---|
| Bronze | R$ 350,00 | 8 | 2 | Costas camisa + Backdrop |
| Prata | R$ 500,00 | 4 | 3 | Mangas camisa + Merchandising + Backdrop |
| Ouro | R$ 1.000,00 | 2 | 4 | Frente camisa (destaque) + Ativação + Backdrop |

**RN-PAT-02 — Interrupção Automática:**
Quando uma cota atinge seu limite máximo, o botão/formulário de aquisição dessa cota é automaticamente desabilitado na interface pública. Nenhuma nova cota desse nível pode ser processada.

**RN-PAT-03 — Geração de Cupons:**
Ao confirmar uma cota de patrocínio (status: Pago/Ativo), o sistema gera automaticamente N códigos de cupom únicos (N = número de cortesias da cota), vinculados ao perfil do patrocinador.

**RN-PAT-04 — Formato do Cupom:**
Código alfanumérico de 10 caracteres, maiúsculos, prefixado pelo nível: `BRONZE-XXXXXXXX`, `PRATA-XXXXXXXX`, `OURO-XXXXXXXX`. Deve ser único no banco.

**RN-PAT-05 — Resgate de Cortesias:**
Cada código de cupom é de uso único. Após resgate, status muda para "Utilizado" e não pode ser reutilizado. Ao esgotar todos os cupons de um patrocinador, sistema bloqueia novos resgates para aquele perfil.

**RN-PAT-06 — Prioridade Visual Ouro:**
No Backdrop Digital, patrocinadores Ouro ocupam a posição de maior destaque (tamanho maior, posição central ou superior, tempo de exibição proporcionalmente maior em rotações).

## 3.3 Regras de Resultados e Pontuação

**RN-RES-01 — Responsabilidade de Input:**
Apenas membros da Comissão Organizadora autenticados podem registrar resultados. Cada registro deve conter: modalidade, data/hora, posição de cada atleta/equipe/dupla e se aplicável, tempo ou pontuação bruta.

**RN-RES-02 — Motor de Pontuação:**
A pontuação de equipe é calculada pela soma dos pontos obtidos por todos os atletas/times vinculados à equipe em todas as modalidades concluídas.

**RN-RES-03 — Tabela de Pesos (Configurável — ver ASSUNÇÃO A02):**

| Categoria | 1º Lugar | 2º Lugar | 3º Lugar |
|---|---|---|---|
| Coletivas | 5 pts | 3 pts | 1 pt |
| Individuais | 3 pts | 2 pts | 1 pt |
| Duplas | 3 pts | 2 pts | 1 pt |
| Fitness | 2 pts | 1 pt | 0 pts |

**RN-RES-04 — Atualização do Ranking:**
Após cada input de resultado pelo Admin, o motor recalcula automaticamente o placar consolidado das três equipes. A atualização deve refletir na interface pública em até 5 segundos (via WebSocket ou polling configurável).

**RN-RES-05 — Imutabilidade de Resultados:**
Resultados confirmados só podem ser editados por Admin com registro de log de auditoria (quem alterou, quando, valor anterior, valor novo).

**RN-RES-06 — Modalidades da ALDEBARUN:**
A Corrida da Família é tratada como modalidade individual separada, com ranking próprio de tempos por faixa etária/sexo (assunção — validar categorias de corrida com organizador).

---

# 4. ESCOPO DO SISTEMA POR MÓDULOS

## Módulo 1 — Portal Público (Frente ao Usuário)

| Subcomponente | Descrição | Status Atual |
|---|---|---|
| Home / Landing Page | Apresentação do evento, countdown, equipes, chamada para inscrição | 🟡 Parcial |
| Página de Inscrição de Atleta | Formulário completo com validação, seleção de equipe e modalidades | ✅ Implementado |
| Página de Patrocínio | Cards de cotas com disponibilidade em tempo real e formulário de interesse | ✅ Implementado |
| Central de Resultados | Placar ao vivo das equipes, ranking por modalidade | 🟡 Implementado com polling/refresh, sem WebSocket/SSE |
| ALDEBARUN II | Página dedicada à corrida com inscrição, resultados e ranking de tempos | ❌ Pendente |
| Galeria de Mídia | Fotos e vídeos do evento (YouTube/Vimeo embed) | 🟡 Parcial |
| Backdrop Digital | Componente de exposição rotativa de logos de patrocinadores | 🟡 Parcial |
| Rodapé com WhatsApp | Link direto para suporte via WhatsApp (86-98826-5569) | ❌ Pendente |

## Módulo 2 — Painel Administrativo (Comissão Organizadora)

| Subcomponente | Descrição | Status Atual |
|---|---|---|
| Dashboard Principal | KPIs: total de atletas, cotas vendidas, pontuação das equipes, modalidades ativas | ✅ Implementado |
| Gestão de Atletas | CRUD completo, visualização por equipe, exportação CSV | 🟡 Quase completo; exportação CSV pendente |
| Gestão de Modalidades | Configuração de modalidades, datas, limites de participantes | 🟡 Parcial; limites de participantes pendentes |
| Gestão de Patrocínio | Controle de cotas vendidas, geração/listagem de cupons, status de pagamento | ✅ Implementado |
| Input de Resultados | Formulário de lançamento de resultados por modalidade | ✅ Implementado |
| Gestão de Ranking | Visualização e auditoria do placar consolidado | ✅ Implementado |
| Gestão de Mídia | Upload de fotos, cadastro de URLs de vídeo | ✅ Implementado |
| Gestão de Backdrop | Cadastro e ordenação de logos de patrocinadores | 🟡 Parcial |
| Configurações | Tabela de pesos de pontuação, limites, regras de desempate | 🟡 Parcial; pesos implementados, limites/regras pendentes |
| Logs de Auditoria | Histórico de alterações em resultados e dados críticos | 🟡 Parcial; resultados implementados, demais dados críticos pendentes |

## Módulo 3 — Sistema de Autenticação

| Subcomponente | Descrição | Status Atual |
|---|---|---|
| Login Admin | Autenticação JWT para membros da Comissão | ✅ Implementado |
| Gerenciamento de Admins | Cadastro e remoção de membros da Comissão (superadmin) | ❌ Pendente |
| Proteção de Rotas | Middleware de autenticação em todas as rotas /admin | ✅ Implementado |
| Recuperação de Senha | Fluxo de reset via e-mail | ❌ Pendente |

## Módulo 4 — Motor de Resultados e Tempo Real

| Subcomponente | Descrição | Status Atual |
|---|---|---|
| Serviço de Cálculo | Worker que recalcula pontuação após cada input de resultado | ✅ Implementado no serviço principal |
| WebSocket / SSE | Canal de comunicação para atualização em tempo real no frontend | ❌ Pendente |
| Cache de Ranking | Cache Redis do placar atual para alta performance | ❌ Pendente |

## Módulo 5 — Conformidade LGPD

| Subcomponente | Descrição | Status Atual |
|---|---|---|
| Registro de Consentimento | Log imutável de aceite com timestamp e IP | 🟡 Parcial |
| Política de Privacidade | Página pública com texto da política | ❌ Pendente |
| Exclusão de Dados | Mecanismo de solicitação de exclusão de dados pessoais | ❌ Pendente |
| Exclusão de Dados | Mecanismo de solicitação de exclusão de dados pessoais |

---

# 5. PERFIS DE USUÁRIO E PERMISSÕES

## 5.1 Perfis Identificados

| Perfil | Descrição | Acesso |
|---|---|---|
| **Visitante** | Qualquer pessoa sem cadastro | Portal público: Home, Resultados, Patrocínio (consulta), ALDEBARUN |
| **Atleta** | Morador, Familiar ou Convidado inscrito | Portal público + área do atleta (ver própria inscrição, modalidades, equipe) |
| **Patrocinador** | Empresa/pessoa com cota ativa | Área de patrocinador (ver cupons, status da cota) |
| **Admin Operacional** | Membro da Comissão Organizadora | Painel Admin completo exceto configurações críticas e gestão de admins |
| **Superadmin** | Responsável técnico/chefe da Comissão | Acesso total, incluindo configurações, exclusão de dados e gestão de admins |

## 5.2 Matriz de Permissões

| Funcionalidade | Visitante | Atleta | Patrocinador | Admin Op. | Superadmin |
|---|---|---|---|---|---|
| Ver resultados públicos | ✅ | ✅ | ✅ | ✅ | ✅ |
| Inscrever-se como atleta | ✅ | — | — | ✅ | ✅ |
| Ver própria inscrição | — | ✅ | — | ✅ | ✅ |
| Adquirir cota de patrocínio | ✅ | ✅ | — | ✅ | ✅ |
| Ver próprios cupons | — | — | ✅ | ✅ | ✅ |resg |
| Lançar resultados | ❌ | ❌ | ❌ | ✅ | ✅ |
| Gerenciar atletas | ❌ | ❌ | ❌ | ✅ | ✅ |
| Gerenciar cotas | ❌ | ❌ | ❌ | ✅ | ✅ |
| Configurar pontuação | ❌ | ❌ | ❌ | ❌ | ✅ |
| Gerenciar admins | ❌ | ❌ | ❌ | ❌ | ✅ |
| Excluir dados (LGPD) | ❌ | ✅* | ❌ | ❌ | ✅ |
| Ver logs de auditoria | ❌ | ❌ | ❌ | ✅ | ✅ |

*Atleta pode solicitar exclusão; execução é feita pelo Superadmin.

---

# 6. MODELO DE DADOS INICIAL

## 6.1 Entidades Principais

### `users` (Admins do Sistema)
```
id              UUID PK
email           VARCHAR(255) UNIQUE NOT NULL
password_hash   VARCHAR(255) NOT NULL
name            VARCHAR(255) NOT NULL
role            ENUM('superadmin', 'admin') NOT NULL
is_active       BOOLEAN DEFAULT true
created_at      TIMESTAMP
updated_at      TIMESTAMP
last_login_at   TIMESTAMP
```

### `athletes` (Atletas Inscritos)
```
id              UUID PK
cpf             VARCHAR(14) UNIQUE NOT NULL
name            VARCHAR(255) NOT NULL
email           VARCHAR(255)
phone           VARCHAR(20)
birth_date      DATE NOT NULL
unit            VARCHAR(50)          -- unidade residencial (ex: "Bloco A, Ap. 302")
type            ENUM('titular', 'familiar', 'convidado') NOT NULL
titular_id      UUID FK -> athletes(id) NULL  -- referência ao titular para familiares/convidados
team_id         UUID FK -> teams(id) NOT NULL
shirt_size      ENUM('PP','P','M','G','GG','XGG') NOT NULL
status          ENUM('pending', 'active', 'rejected') DEFAULT 'pending'
lgpd_consent    BOOLEAN NOT NULL DEFAULT false
lgpd_consent_at TIMESTAMP
lgpd_consent_ip VARCHAR(45)
notes           TEXT
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### `teams` (Equipes)
```
id              UUID PK
name            VARCHAR(50) UNIQUE NOT NULL   -- 'Mucura', 'Jacaré', 'Capivara'
color           VARCHAR(7)                    -- hex, ex: '#E63946'
mascot_image    VARCHAR(500)                  -- URL da imagem do mascote
total_score     INTEGER DEFAULT 0            -- cache calculado
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### `sports` (Modalidades)
```
id              UUID PK
name            VARCHAR(100) NOT NULL
category        ENUM('coletiva','individual','dupla','fitness') NOT NULL
description     TEXT
min_participants INTEGER DEFAULT 1
max_participants INTEGER
is_aldebarun    BOOLEAN DEFAULT false         -- se pertence à ALDEBARUN II
is_active       BOOLEAN DEFAULT true
schedule_date   TIMESTAMP
schedule_notes  TEXT
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### `registrations` (Inscrições em Modalidades)
```
id              UUID PK
athlete_id      UUID FK -> athletes(id)
sport_id        UUID FK -> sports(id)
partner_id      UUID FK -> athletes(id) NULL  -- para modalidades de dupla
status          ENUM('registered','confirmed','disqualified') DEFAULT 'registered'
registered_at   TIMESTAMP
notes           TEXT
UNIQUE(athlete_id, sport_id)
```

### `results` (Resultados por Modalidade)
```
id              UUID PK
sport_id        UUID FK -> sports(id)
athlete_id      UUID FK -> athletes(id) NULL  -- NULL para resultados coletivos
team_id         UUID FK -> teams(id) NULL      -- para resultados coletivos
position        INTEGER                        -- 1º, 2º, 3º
raw_score       DECIMAL(10,3)                  -- tempo (segundos) ou pontuação bruta
calculated_points INTEGER                      -- pontos conforme tabela de pesos
result_date     TIMESTAMP NOT NULL
notes           TEXT
recorded_by     UUID FK -> users(id)
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### `result_audit_log` (Log de Auditoria de Resultados)
```
id              UUID PK
result_id       UUID FK -> results(id)
changed_by      UUID FK -> users(id)
field_changed   VARCHAR(100)
old_value       TEXT
new_value       TEXT
changed_at      TIMESTAMP
```

### `scoring_config` (Configuração de Pontuação)
```
id              UUID PK
category        ENUM('coletiva','individual','dupla','fitness')
position        INTEGER                        -- 1, 2, 3
points          INTEGER NOT NULL
updated_by      UUID FK -> users(id)
updated_at      TIMESTAMP
```

### `sponsors` (Patrocinadores)
```
id              UUID PK
company_name    VARCHAR(255) NOT NULL
contact_name    VARCHAR(255) NOT NULL
email           VARCHAR(255) NOT NULL
phone           VARCHAR(20)
quota_id        UUID FK -> sponsorship_quotas(id)
logo_url        VARCHAR(500)
status          ENUM('pending','active','inactive') DEFAULT 'pending'
payment_date    DATE
payment_notes   TEXT
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### `sponsorship_quotas` (Configuração de Cotas)
```
id              UUID PK
level           ENUM('bronze','prata','ouro') UNIQUE NOT NULL
price           DECIMAL(10,2) NOT NULL
max_slots       INTEGER NOT NULL
used_slots      INTEGER DEFAULT 0            -- cache; valide via COUNT(sponsors)
courtesy_count  INTEGER NOT NULL
benefits        TEXT
backdrop_priority INTEGER NOT NULL           -- 1=menor, 3=maior (Ouro=3)
created_at      TIMESTAMP
```

### `coupons` (Cupons de Cortesia)
```
id              UUID PK
code            VARCHAR(20) UNIQUE NOT NULL
sponsor_id      UUID FK -> sponsors(id)
status          ENUM('active','used','expired') DEFAULT 'active'
redeemed_by     UUID FK -> athletes(id) NULL
redeemed_at     TIMESTAMP
created_at      TIMESTAMP
```

### `media` (Galeria de Mídia)
```
id              UUID PK
type            ENUM('photo','video') NOT NULL
title           VARCHAR(255)
url             VARCHAR(500) NOT NULL
thumbnail_url   VARCHAR(500)
provider        ENUM('local','youtube','vimeo') DEFAULT 'local'
is_featured     BOOLEAN DEFAULT false
sort_order      INTEGER DEFAULT 0
uploaded_by     UUID FK -> users(id)
created_at      TIMESTAMP
```

### `lgpd_consent_log` (Log Imutável LGPD)
```
id              UUID PK
athlete_cpf     VARCHAR(14) NOT NULL         -- desnormalizado intencionalmente para imutabilidade
athlete_name    VARCHAR(255)
consented_at    TIMESTAMP NOT NULL
ip_address      VARCHAR(45) NOT NULL
user_agent      TEXT
policy_version  VARCHAR(20) DEFAULT 'v1.0'
```

## 6.2 Relacionamentos Resumidos

```
athletes ──(many-to-one)──> teams
athletes ──(many-to-many via registrations)──> sports
athletes ──(self-reference)──> athletes (titular_id)
sponsors ──(many-to-one)──> sponsorship_quotas
sponsors ──(one-to-many)──> coupons
results ──(many-to-one)──> sports, athletes, teams
result_audit_log ──(many-to-one)──> results
```

---

# 7. FLUXOS DE USUÁRIO

## 7.1 Fluxo de Inscrição de Atleta

```
[Visitante acessa Portal]
        ↓
[Clica em "Inscrever-se"]
        ↓
[Seleciona tipo: Titular / Familiar / Convidado]
        ↓ (se Familiar ou Convidado)
[Informa CPF do Morador Titular]
[Sistema valida CPF na base → Titular existe?]
        ↓ (sim)                ↓ (não)
[Continua]          [Erro: "CPF do titular não encontrado"]
        ↓
[Preenche dados pessoais: nome, CPF, nascimento, telefone, tamanho camiseta]
        ↓
[Seleciona Equipe: Mucura | Jacaré | Capivara]
        ↓
[Seleciona modalidades de interesse]
        ↓ (duplas)
[Informa CPF do parceiro ou marca "definir depois"]
        ↓
[Aceita checkbox LGPD (obrigatório)]
[Sistema registra IP + timestamp do aceite]
        ↓
[Submete formulário]
        ↓ (Convidado)          ↓ (Titular/Familiar)
[Status: Pendente]     [Status: Ativo]
[Admin aprova]         [Confirmação exibida]
        ↓
[E-mail de confirmação enviado (se e-mail fornecido)]
```

## 7.2 Fluxo de Aquisição de Cota de Patrocínio

```
[Interessado acessa "Seja Patrocinador"]
        ↓
[Visualiza cards de cotas com disponibilidade em tempo real]
[Cotas esgotadas aparecem como "Encerrado"]
        ↓
[Seleciona nível disponível e clica "Tenho Interesse"]
        ↓
[Preenche formulário: razão social, contato, e-mail, telefone, logo]
        ↓
[Submete → Status: Pendente]
[Admin recebe notificação]
        ↓
[Admin confirma pagamento no Painel]
        ↓
[Sistema ativa cota → Status: Ativo]
[Sistema gera N cupons de cortesia automaticamente]
[E-mail com cupons enviado ao patrocinador]
        ↓
[Patrocinador distribui cupons para convidados]
[Convidado usa código no formulário de inscrição]
```

## 7.3 Fluxo de Input de Resultados (Admin)

```
[Admin faz login no Painel]
        ↓
[Acessa "Resultados" → "Lançar Resultado"]
        ↓
[Seleciona Modalidade]
        ↓
[Para modalidades coletivas: seleciona equipe por posição]
[Para individuais/duplas/fitness: seleciona atleta(s) por posição]
        ↓
[Informa raw_score se aplicável (tempo em corrida/natação)]
        ↓
[Confirma lançamento]
        ↓
[Motor recalcula pontuação de equipes]
[Cache Redis atualizado]
        ↓
[WebSocket/SSE notifica frontend público]
[Placar ao vivo atualizado em ≤ 5 segundos]
```

## 7.4 Fluxo do Backdrop Digital (Público)

```
[Componente Backdrop carregado na Home/Página de Resultados]
        ↓
[Busca patrocinadores ativos via API]
[Ordena: Ouro (prioridade 3) → Prata (2) → Bronze (1)]
        ↓
[Exibe logos em rotação:
  - Ouro: tempo de exibição 2x maior + área maior
  - Prata: tempo normal + área média
  - Bronze: tempo normal + área menor]
        ↓
[Atualização sem reload da página]
```

---

# 8. ARQUITETURA TÉCNICA RECOMENDADA

## 8.1 Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USUÁRIO FINAL                                 │
│              (Browser Mobile / Desktop)                              │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ HTTPS
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     NGINX (Reverse Proxy)                            │
│              SSL Termination + Static Files + Rate Limit             │
│                     Container: nginx                                  │
└───────────────┬─────────────────────────────┬───────────────────────┘
                │                             │
                ▼                             ▼
┌──────────────────────────┐    ┌─────────────────────────────────────┐
│   FRONTEND (Next.js)     │    │        BACKEND (Node.js/NestJS)     │
│   next-shadcn-admin      │◄──►│        REST API + WebSocket         │
│   Container: frontend    │    │        Container: backend           │
└──────────────────────────┘    └───────┬─────────────┬───────────────┘
                                        │             │
                          ┌─────────────┘             └──────────────┐
                          ▼                                           ▼
             ┌─────────────────────┐                    ┌────────────────────┐
             │   PostgreSQL 16      │                    │    Redis 7          │
             │   Container: db      │                    │ Container: redis    │
             │   (dados primários)  │                    │ (cache + realtime)  │
             └─────────────────────┘                    └────────────────────┘
                          │
                          ▼
             ┌─────────────────────┐
             │   MinIO / Local Vol  │
             │  (upload de logos,  │
             │   fotos do evento)  │
             └─────────────────────┘
```

## 8.2 Stack Tecnológica

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Frontend | Next.js 14+ (App Router) | Base do template oficial |
| UI System | shadcn/ui + Tailwind CSS | Template obrigatório |
| Backend | Node.js + NestJS | TypeScript, modular, suporte a WebSocket |
| ORM | Prisma | TypeScript-first, migrations automáticas |
| Banco de Dados | PostgreSQL 16 | Relacionamentos complexos, JSONB, auditoria |
| Cache / Realtime | Redis 7 | Pub/Sub para ranking ao vivo |
| Realtime Frontend | Server-Sent Events (SSE) ou Socket.io | Atualização de placar |
| Proxy Reverso | Nginx | SSL, roteamento, compressão |
| Armazenamento | MinIO (self-hosted S3) | Logos e fotos (Docker-native) |
| E-mail | SMTP via Nodemailer + MailHog (dev) | Confirmações e cupons |
| Autenticação | JWT + Refresh Tokens | Stateless, compatível com containers |
| Containerização | Docker + Docker Compose | Obrigatório por spec |
| CI/CD (futuro) | GitHub Actions | Deploy automatizado |

---

# 9. ARQUITETURA BASEADA NO TEMPLATE (OBRIGATÓRIO)

## 9.1 Sobre o Template Base

O template **next-shadcn-admin-dashboard** (Studio Admin — github: arhamkhnz/next-shadcn-admin-dashboard) é um starter moderno de dashboard administrativo construído sobre:
- **Next.js 14** com App Router
- **shadcn/ui** como design system
- **Tailwind CSS** para estilização
- Sidebar colapsável, Command Palette (⌘J), sistema de abas de dashboard
- Tabelas com paginação, filtros, exportação CSV
- Cards de KPI, gráficos (Recharts), listas de ação

## 9.2 Estrutura de Diretórios Next.js Adaptada

```
/app
├── (public)/                        # Rotas públicas sem autenticação
│   ├── page.tsx                     # Home / Landing Page do evento
│   ├── inscricao/
│   │   └── page.tsx                 # Formulário de inscrição de atleta
│   ├── patrocinio/
│   │   └── page.tsx                 # Página de cotas de patrocínio
│   ├── resultados/
│   │   └── page.tsx                 # Central de resultados / placar ao vivo
│   ├── aldebarun/
│   │   └── page.tsx                 # Página ALDEBARUN II — Corrida da Família
│   ├── galeria/
│   │   └── page.tsx                 # Galeria de fotos e vídeos
│   ├── privacidade/
│   │   └── page.tsx                 # Política de Privacidade (LGPD)
│   └── layout.tsx                   # Layout público (navbar + footer WhatsApp)
│
├── (admin)/                         # Rotas protegidas — Painel Administrativo
│   ├── layout.tsx                   # Layout do template (sidebar + header)
│   ├── dashboard/
│   │   └── page.tsx                 # Dashboard principal (KPIs do evento)
│   ├── atletas/
│   │   ├── page.tsx                 # Lista de atletas (tabela CRM adaptada)
│   │   ├── [id]/page.tsx            # Perfil do atleta
│   │   └── novo/page.tsx            # Cadastro manual de atleta
│   ├── modalidades/
│   │   ├── page.tsx                 # Lista de modalidades
│   │   └── [id]/page.tsx            # Detalhes e resultados da modalidade
│   ├── resultados/
│   │   ├── page.tsx                 # Lista de resultados lançados
│   │   └── novo/page.tsx            # Formulário de lançamento de resultado
│   ├── patrocinio/
│   │   ├── page.tsx                 # Gestão de cotas e patrocinadores
│   │   └── cupons/page.tsx          # Listagem de cupons gerados
│   ├── ranking/
│   │   └── page.tsx                 # Placar consolidado com logs
│   ├── midia/
│   │   └── page.tsx                 # Gestão de fotos e vídeos
│   ├── backdrop/
│   │   └── page.tsx                 # Gestão do backdrop digital
│   ├── configuracoes/
│   │   └── page.tsx                 # Pontuação, limites, regras (Superadmin)
│   └── auditoria/
│       └── page.tsx                 # Logs de auditoria (Superadmin)
│
├── (auth)/                          # Rotas de autenticação
│   ├── login/page.tsx
│   └── recuperar-senha/page.tsx
│
└── api/                             # API Routes Next.js (ou proxy para NestJS)
    └── [...]/route.ts
```

## 9.3 Mapeamento de Páginas do Template para o INTRADEBAS

| Página Original (Template) | Página Adaptada (INTRADEBAS) | Adaptações Necessárias |
|---|---|---|
| `/dashboard/crm` | `/admin/dashboard` | KPIs: atletas, cotas vendidas, pontuação de equipes, modalidades |
| Tabela "Recent Leads" | Tabela de Atletas | Colunas: Nome, CPF (mascarado), Equipe (badge colorida), Status, Modalidades |
| Cards de métricas (635 leads, etc.) | Cards: Total Atletas, Cotas Vendidas, Pontuação Mucura/Jacaré/Capivara | Cores das equipes nos cards |
| "Sales by Region" | "Pontuação por Categoria" | Barras por categoria (Coletivo/Individual/Dupla/Fitness) por equipe |
| "Action Items" | Pendências da Comissão | Inscrições pendentes, resultados para lançar, cotas a confirmar |
| Pipeline de vendas | Pipeline de Cotas | Bronze/Prata/Ouro com slots restantes como funil |
| "Leads by Source" | Atletas por Equipe | Distribuição Mucura vs Jacaré vs Capivara |
| Formulário de lead | Formulário de Atleta | Campos adaptados para o briefing |

## 9.4 Componentes shadcn/ui Utilizados

| Componente | Uso no INTRADEBAS |
|---|---|
| `<DataTable>` | Listagem de atletas, resultados, cupons, patrocinadores |
| `<Card>` | KPI cards de equipes, cards de cotas de patrocínio |
| `<Badge>` | Status de atletas, equipes (com cores Mucura/Jacaré/Capivara) |
| `<Form>` + `<Input>` | Formulários de inscrição, resultado, patrocínio |
| `<Select>` | Seleção de equipe, modalidade, tamanho de camiseta |
| `<Dialog>` | Confirmações de lançamento de resultado, aprovação de atleta |
| `<Tabs>` | Dashboard com abas por modalidade; perfil do atleta |
| `<Progress>` | Disponibilidade de cotas (ex: "6 de 8 Bronze vendidas") |
| `<Alert>` | Cota esgotada, erro de CPF duplicado, aviso LGPD |
| `<Checkbox>` | Aceite LGPD no formulário de inscrição |
| `<Toast>` / `<Sonner>` | Feedback após lançamento de resultado, cadastro concluído |
| `<Sidebar>` | Navegação do Painel Admin (já inclusa no template) |
| `<CommandPalette>` | Busca rápida de atletas e modalidades no Admin |
| `<Avatar>` | Logo do patrocinador, mascote da equipe |
| `<Separator>` | Divisores visuais em formulários e cards |

## 9.5 Customizações no Template

### 9.5.1 Design System e Identidade Visual

```css
/* tailwind.config customizações */
colors: {
  team-mucura:   { DEFAULT: '#E63946', light: '#FF6B6B', dark: '#C1121F' },
  team-jacare:   { DEFAULT: '#2D6A4F', light: '#52B788', dark: '#1B4332' },
  team-capivara: { DEFAULT: '#E9C46A', light: '#F4D03F', dark: '#C49A1A' },
  intradebas: {
    primary:   '#1A1A2E',   /* Azul escuro premium */
    secondary: '#16213E',
    accent:    '#0F3460',
    gold:      '#C9A84C',   /* Dourado para patrocinadores Ouro */
  }
}
```

### 9.5.2 Sidebar Adaptada para o Admin INTRADEBAS

```
INTRADEBAS 2026 (logo)
─────────────────────
📊 Dashboard
─────────────────────
GESTÃO DE ATLETAS
  👤 Atletas
  📋 Inscrições Pendentes
─────────────────────
COMPETIÇÃO
  🏆 Modalidades
  🎯 Lançar Resultado
  📊 Ranking / Placar
─────────────────────
PATROCÍNIO
  💼 Patrocinadores
  🎟️ Cupons de Cortesia
─────────────────────
CONTEÚDO
  📸 Galeria de Mídia
  🎨 Backdrop Digital
─────────────────────
SISTEMA
  ⚙️ Configurações
  🔍 Auditoria
  👥 Usuários Admin
─────────────────────
```

### 9.5.3 Adaptação do CRM para Contexto Esportivo

O dashboard CRM do template utiliza "Leads" como entidade central. A adaptação mapeia:

| Conceito CRM | Conceito INTRADEBAS | Observação |
|---|---|---|
| Lead | Atleta | CPF como identificador único; equipe como segmento |
| Pipeline | Funil de Cotas | Bronze → Prata → Ouro |
| "Won" status | Atleta Ativo | Inscrito e pago/aprovado |
| "Qualified" | Aguardando Aprovação | Para convidados |
| Company | Unidade Residencial | Bloco/apartamento |
| Revenue | Pontuação por Equipe | KPI principal do evento |
| Region | Equipe | Mucura / Jacaré / Capivara |
| Source | Tipo de Atleta | Titular / Familiar / Convidado |

---

# 10. ARQUITETURA CONTAINERIZADA COM DOCKER (OBRIGATÓRIO)

## 10.1 Visão Geral dos Serviços

| Serviço | Imagem Base | Porta Interna | Porta Externa (dev) | Responsabilidade |
|---|---|---|---|---|
| `nginx` | nginx:alpine | 80, 443 | 80, 443 | Proxy reverso, SSL, roteamento |
| `frontend` | node:20-alpine | 3000 | 3000 | Next.js App |
| `backend` | node:20-alpine | 4000 | 4000 | NestJS API REST + WebSocket |
| `db` | postgres:16-alpine | 5432 | 5432 | Banco de dados principal |
| `redis` | redis:7-alpine | 6379 | 6379 | Cache e Pub/Sub para realtime |
| `minio` | minio/minio | 9000, 9001 | 9000, 9001 | Object storage (logos, fotos) |
| `mailhog` | mailhog/mailhog | 1025, 8025 | 8025 | SMTP fake para dev |

## 10.2 Dockerfiles

### Dockerfile — Frontend (Next.js)

```dockerfile
# /frontend/Dockerfile
# ----------- Stage 1: Dependencies -----------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

# ----------- Stage 2: Builder -----------
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ----------- Stage 3: Runner -----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER appuser
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1
CMD ["node", "server.js"]
```

### Dockerfile — Backend (NestJS)

```dockerfile
# /backend/Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

USER appuser
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:4000/health || exit 1
CMD ["node", "dist/main.js"]
```

### Dockerfile — Nginx

```nginx
# /nginx/nginx.conf
upstream frontend { server frontend:3000; }
upstream backend  { server backend:4000;  }

server {
  listen 80;
  server_name _;
  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl http2;
  ssl_certificate     /etc/nginx/certs/fullchain.pem;
  ssl_certificate_key /etc/nginx/certs/privkey.pem;

  # Frontend
  location / {
    proxy_pass http://frontend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_cache_bypass $http_upgrade;
  }

  # API Backend
  location /api/ {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  # WebSocket / SSE
  location /events {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_buffering off;
    proxy_cache off;
    proxy_read_timeout 3600s;
  }
}
```

## 10.3 Docker Compose — Ambiente de Desenvolvimento

```yaml
# docker-compose.dev.yml
version: '3.9'

services:
  nginx:
    image: nginx:alpine
    container_name: intradebas-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.dev.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/certs:/etc/nginx/certs:ro
    depends_on:
      - frontend
      - backend
    networks:
      - intradebas-net
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: deps         # Em dev, monta código local
    container_name: intradebas-frontend
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_API_URL=http://localhost/api
      - NEXT_PUBLIC_WS_URL=ws://localhost/events
    ports:
      - "3000:3000"
    networks:
      - intradebas-net
    depends_on:
      - backend
    command: npm run dev
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: deps
    container_name: intradebas-backend
    volumes:
      - ./backend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://intradebas:secret@db:5432/intradebas_db
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=dev_jwt_secret_change_in_prod
      - JWT_REFRESH_SECRET=dev_refresh_secret_change_in_prod
      - MINIO_ENDPOINT=minio
      - MINIO_PORT=9000
      - MINIO_ACCESS_KEY=minioadmin
      - MINIO_SECRET_KEY=minioadmin
      - MAIL_HOST=mailhog
      - MAIL_PORT=1025
      - MAIL_FROM=noreply@intradebas.com
    ports:
      - "4000:4000"
    networks:
      - intradebas-net
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    command: npm run start:dev
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    container_name: intradebas-db
    environment:
      POSTGRES_USER: intradebas
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: intradebas_db
    volumes:
      - pg_data:/var/lib/postgresql/data
      - ./db/init:/docker-entrypoint-initdb.d:ro
    ports:
      - "5432:5432"
    networks:
      - intradebas-net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U intradebas -d intradebas_db"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: intradebas-redis
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    networks:
      - intradebas-net
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3
    restart: unless-stopped

  minio:
    image: minio/minio:latest
    container_name: intradebas-minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    volumes:
      - minio_data:/data
    ports:
      - "9000:9000"
      - "9001:9001"
    networks:
      - intradebas-net
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

  mailhog:
    image: mailhog/mailhog:latest
    container_name: intradebas-mailhog
    ports:
      - "1025:1025"
      - "8025:8025"
    networks:
      - intradebas-net
    restart: unless-stopped

volumes:
  pg_data:
    driver: local
  redis_data:
    driver: local
  minio_data:
    driver: local

networks:
  intradebas-net:
    driver: bridge
```

## 10.4 Docker Compose — Produção

```yaml
# docker-compose.prod.yml
version: '3.9'

services:
  nginx:
    image: nginx:alpine
    container_name: intradebas-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.prod.conf:/etc/nginx/nginx.conf:ro
      - /etc/letsencrypt:/etc/nginx/certs:ro   # Certbot / Let's Encrypt
      - nginx_logs:/var/log/nginx
    depends_on:
      - frontend
      - backend
    networks:
      - intradebas-net
    restart: always
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "5"

  frontend:
    image: ${REGISTRY}/intradebas-frontend:${VERSION}
    container_name: intradebas-frontend
    env_file: .env.prod
    networks:
      - intradebas-net
    depends_on:
      - backend
    restart: always

  backend:
    image: ${REGISTRY}/intradebas-backend:${VERSION}
    container_name: intradebas-backend
    env_file: .env.prod
    networks:
      - intradebas-net
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: always

  db:
    image: postgres:16-alpine
    container_name: intradebas-db
    env_file: .env.prod
    volumes:
      - pg_data:/var/lib/postgresql/data
    networks:
      - intradebas-net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: always

  redis:
    image: redis:7-alpine
    container_name: intradebas-redis
    volumes:
      - redis_data:/data
    networks:
      - intradebas-net
    command: redis-server --requirepass ${REDIS_PASSWORD}
    restart: always

  minio:
    image: minio/minio:latest
    container_name: intradebas-minio
    command: server /data --console-address ":9001"
    env_file: .env.prod
    volumes:
      - minio_data:/data
    networks:
      - intradebas-net
    restart: always

volumes:
  pg_data:
  redis_data:
  minio_data:
  nginx_logs:

networks:
  intradebas-net:
    driver: bridge
```

## 10.5 Variáveis de Ambiente

### `.env.dev` (nunca versionar — gitignore)

```env
# Banco de Dados
POSTGRES_USER=intradebas
POSTGRES_PASSWORD=secret_dev
POSTGRES_DB=intradebas_db
DATABASE_URL=postgresql://intradebas:secret_dev@db:5432/intradebas_db

# Redis
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET=jwt_dev_secret_CHANGE_ME_32chars
JWT_REFRESH_SECRET=refresh_dev_secret_CHANGE_ME_32chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# MinIO
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=intradebas

# E-mail
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_FROM=noreply@intradebas.local

# Frontend
NEXT_PUBLIC_API_URL=http://localhost/api
NEXT_PUBLIC_WS_URL=ws://localhost/events
NEXT_PUBLIC_WHATSAPP_NUMBER=5586988265569

# Sistema
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
```

### `.env.prod` (gerenciado via secrets manager)

```env
DATABASE_URL=postgresql://intradebas:SENHA_FORTE@db:5432/intradebas_db
REDIS_URL=redis://:SENHA_REDIS@redis:6379
JWT_SECRET=SEGREDO_JWT_PRODUCAO_256BITS
JWT_REFRESH_SECRET=SEGREDO_REFRESH_PRODUCAO_256BITS
MINIO_ACCESS_KEY=CHAVE_MINIO_PROD
MINIO_SECRET_KEY=SENHA_MINIO_PROD
MAIL_HOST=smtp.sendgrid.net          # ou outro provider SMTP
MAIL_PORT=587
MAIL_USER=apikey
MAIL_PASS=SENDGRID_API_KEY
NEXT_PUBLIC_API_URL=https://intradebas.com/api
NEXT_PUBLIC_WS_URL=wss://intradebas.com/events
NODE_ENV=production
```

## 10.6 Estratégia de Volumes e Backup

| Volume | Dados Armazenados | Estratégia de Backup |
|---|---|---|
| `pg_data` | Todos os dados relacionais | pg_dump diário via cron + cópia para MinIO |
| `redis_data` | Cache e sessões ativas | Redis persistence (AOF) + dump semanal |
| `minio_data` | Logos, fotos, uploads | Sync para bucket S3 externo (produção) |
| `nginx_logs` | Logs de acesso e erro | Rotação automática (logrotate) + retenção 30 dias |

### Script de Backup PostgreSQL (cron no host)

```bash
#!/bin/bash
# backup-db.sh — executar via cron às 02:00 diariamente
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="intradebas_backup_${DATE}.sql.gz"

docker exec intradebas-db pg_dump \
  -U intradebas intradebas_db | gzip > /backups/${BACKUP_FILE}

# Manter apenas os últimos 7 backups locais
find /backups -name "intradebas_backup_*.sql.gz" \
  -mtime +7 -delete
```

## 10.7 Health Checks e Monitoramento

| Serviço | Health Check | Thresholds |
|---|---|---|
| frontend | `GET /api/health` → HTTP 200 | Interval: 30s, Timeout: 5s, Retries: 3 |
| backend | `GET /health` → HTTP 200 + `{"status":"ok"}` | Interval: 15s, Timeout: 5s, Retries: 3 |
| db | `pg_isready` | Interval: 10s, Timeout: 5s, Retries: 5 |
| redis | `redis-cli ping` | Interval: 10s, Timeout: 3s, Retries: 3 |
| minio | `curl /minio/health/live` | Interval: 30s, Timeout: 10s, Retries: 3 |

## 10.8 Ambientes

| Ambiente | Arquivo Compose | Características |
|---|---|---|
| **Dev** | `docker-compose.dev.yml` | Hot-reload, MailHog, logs detalhados, sem SSL obrigatório |
| **Staging** | `docker-compose.staging.yml` | Imagens buildadas, SSL auto-assinado, dados mock |
| **Produção** | `docker-compose.prod.yml` | Imagens registry, SSL Let's Encrypt, secrets externos, logs comprimidos |

---

# 11. APIs E CONTRATOS INICIAIS

## 11.1 Padrão de API

- **Base URL:** `/api/v1`
- **Autenticação:** Bearer Token JWT no header `Authorization`
- **Formato:** JSON
- **Paginação:** `?page=1&limit=20`
- **Filtros:** Query params: `?team=mucura&status=active`
- **Erros:** `{ "statusCode": 400, "message": "...", "error": "Bad Request" }`

## 11.2 Endpoints Principais

### Atletas

```
POST   /api/v1/athletes              Inscrição pública de atleta
GET    /api/v1/athletes              [Admin] Lista de atletas (filtros, paginação)
GET    /api/v1/athletes/:id          [Admin+Atleta] Perfil do atleta
PATCH  /api/v1/athletes/:id          [Admin] Atualizar atleta
PATCH  /api/v1/athletes/:id/status   [Admin] Aprovar/rejeitar convidado
DELETE /api/v1/athletes/:id          [Superadmin] Exclusão de dados (LGPD)
GET    /api/v1/athletes/export/csv   [Admin] Exportação CSV
```

### Equipes

```
GET    /api/v1/teams                 Lista pública de equipes com pontuação
GET    /api/v1/teams/:id             Detalhes da equipe + atletas
GET    /api/v1/teams/:id/athletes    Atletas de uma equipe
```

### Modalidades

```
GET    /api/v1/sports                Lista pública de modalidades
POST   /api/v1/sports                [Admin] Criar modalidade
PATCH  /api/v1/sports/:id            [Admin] Atualizar modalidade
GET    /api/v1/sports/:id/results    Resultados de uma modalidade
```

### Resultados

```
GET    /api/v1/results               Lista pública de resultados (lançados)
POST   /api/v1/results               [Admin] Lançar resultado
PATCH  /api/v1/results/:id           [Admin] Corrigir resultado (audit log)
GET    /api/v1/results/ranking       Placar consolidado das equipes (público)
GET    /api/v1/results/ranking/live  SSE — stream de atualizações do placar
```

### Patrocínio

```
GET    /api/v1/sponsorship/quotas    Lista pública de cotas com disponibilidade
POST   /api/v1/sponsors              Cadastro público de interesse em patrocínio
GET    /api/v1/sponsors              [Admin] Lista de patrocinadores
PATCH  /api/v1/sponsors/:id/activate [Admin] Ativar cota (confirmar pagamento)
GET    /api/v1/coupons               [Admin] Lista de cupons
POST   /api/v1/coupons/redeem        Resgate de cupom (público — no ato de inscrição)
GET    /api/v1/sponsors/:id/coupons  [Admin+Patrocinador] Cupons do patrocinador
```

### Mídia e Backdrop

```
GET    /api/v1/media                 Lista pública de mídia
POST   /api/v1/media                 [Admin] Upload de foto ou cadastro de vídeo
DELETE /api/v1/media/:id             [Admin] Remover mídia
GET    /api/v1/backdrop              Lista pública de logos para o backdrop
PUT    /api/v1/backdrop/order        [Admin] Reordenar logos
```

### Autenticação

```
POST   /api/v1/auth/login            Login do Admin
POST   /api/v1/auth/refresh          Renovação do token
POST   /api/v1/auth/logout           Logout (invalida refresh token)
POST   /api/v1/auth/recover          Solicitar reset de senha
POST   /api/v1/auth/reset            Resetar senha com token
```

### Saúde

```
GET    /api/v1/health                Status do sistema (público — para healthcheck)
```

## 11.3 Exemplo de Contrato — POST /api/v1/athletes

```json
Request Body:
{
  "name": "João Silva Santos",
  "cpf": "123.456.789-00",
  "email": "joao@email.com",
  "phone": "86987654321",
  "birthDate": "1990-05-15",
  "unit": "Bloco B, Ap. 204",
  "type": "titular",
  "teamId": "uuid-mucura",
  "shirtSize": "G",
  "sports": ["uuid-futsal", "uuid-corrida"],
  "lgpdConsent": true,
  "couponCode": "BRONZE-ABCD1234"   // opcional, se veio por cortesia
}

Response 201:
{
  "id": "uuid-atleta",
  "name": "João Silva Santos",
  "team": { "id": "uuid-mucura", "name": "Mucura" },
  "status": "active",
  "registeredAt": "2026-04-16T10:30:00Z"
}

Response 409 (CPF duplicado):
{
  "statusCode": 409,
  "message": "CPF já cadastrado no sistema",
  "error": "Conflict"
}
```

---

# 12. REQUISITOS NÃO FUNCIONAIS

## 12.1 Performance

| Métrica | Target | Observação |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | Mobile 3G |
| TTI (Time to Interactive) | < 4s | Mobile 3G |
| Atualização do placar (Live Score) | < 5s | Após input do Admin |
| API response time (p95) | < 300ms | Endpoints principais |
| Concurrent users suportados | 500+ | Pico durante competições |

## 12.2 Segurança

| Requisito | Implementação |
|---|---|
| HTTPS obrigatório | Nginx + Let's Encrypt |
| Criptografia de senhas | bcrypt (salt rounds ≥ 12) |
| JWT com expiração curta | Access token: 15min; Refresh: 7 dias |
| Proteção CSRF | Token CSRF em formulários públicos |
| Rate limiting | Nginx: máx. 100 req/min por IP; Login: máx. 5/min |
| SQL Injection | Prisma ORM com parameterized queries |
| XSS | Next.js CSP headers + sanitização de inputs |
| Dados pessoais | Mascaramento de CPF nas listagens (ex: ***456789-**) |
| LGPD | Log imutável de consentimento, direito de exclusão |

## 12.3 Disponibilidade e Confiabilidade

| Requisito | Target |
|---|---|
| Uptime durante o evento | 99.5% |
| Backup automático do banco | Diário (cron 02:00h) |
| Tempo de recuperação (RTO) | < 2 horas |
| Ponto de recuperação (RPO) | < 24 horas (último backup) |
| Reinício automático de containers | `restart: always` em prod |

## 12.4 Usabilidade

| Requisito | Critério |
|---|---|
| Mobile-First | Layout responsivo: 320px+ sem scroll horizontal |
| Acessibilidade | WCAG 2.1 AA para componentes principais |
| Suporte a browsers | Chrome/Safari/Firefox nas últimas 2 versões |
| Formulários | Validação inline com mensagens claras em português |
| Loading states | Skeleton loaders em todas as listagens |
| Feedback de ação | Toast/Alert em todas as ações críticas |

---

# 13. ROADMAP DE DESENVOLVIMENTO (POR FASES)

Legenda de status nesta seção:
- `[x]` implementado
- `[~]` parcialmente implementado
- `[ ]` pendente

## Fase 0 — Preparação (Semana 1)
Duração estimada: 1 semana

- [x] Configurar repositório Git (monorepo ou multi-repo)
- [x] Setup do ambiente Docker de desenvolvimento
- [ ] Clonar e configurar o template next-shadcn-admin-dashboard
- [x] Configurar Prisma + PostgreSQL + primeiras migrations
- [x] Configurar NestJS com módulos base
- [x] Definir CI/CD básico (GitHub Actions)
- [ ] Validar assunções A01–A10 com Manoel Neto

## Fase 1 — MVP Core (Semanas 2–5)
Duração estimada: 4 semanas

### Semana 2 — Auth + Estrutura Base
- [~] Módulo de autenticação (login e JWT implementados; refresh e recuperação de senha pendentes)
- [ ] Layout público (navbar, footer WhatsApp)
- [ ] Sidebar do Admin adaptada (template customizado)
- [x] Dashboard Admin com KPIs reais

### Semana 3 — Atletas e Inscrições
- [~] Formulário público de inscrição de atleta (com LGPD)
- [x] Gestão de atletas no Admin (lista, aprovar convidados, filtros)
- [x] Módulo de equipes (Mucura, Jacaré, Capivara) com badges coloridos
- [ ] Exportação CSV de atletas

### Semana 4 — Resultados e Ranking
- [x] Configuração de modalidades no Admin
- [x] Formulário de lançamento de resultados
- [x] Motor de cálculo de pontuação
- [x] Central de Resultados pública (placar estático — polling a cada 10s)
- [x] Configuração da tabela de pesos

### Semana 5 — Patrocínio e Cupons
- [x] Página pública de patrocínio com cards de cotas
- [x] Formulário de interesse em patrocínio
- [x] Admin: ativação de cota + geração automática de cupons
- [x] Validação e resgate de cupom no formulário de inscrição
- [x] Bloqueio automático de cotas esgotadas

## Fase 2 — Completude e Tempo Real (Semanas 6–8)
Duração estimada: 3 semanas

### Semana 6 — Tempo Real e Backdrop
- [ ] Implementação de SSE (Server-Sent Events) para placar ao vivo
- [ ] Redis Pub/Sub integrado ao motor de cálculo
- [~] Componente Backdrop Digital dinâmico com rotação e prioridade Ouro
- [x] Upload de logos no Admin (MinIO)

### Semana 7 — Galeria de Mídia e ALDEBARUN
- [x] Upload e gestão de fotos (MinIO)
- [x] Integração de vídeos YouTube/Vimeo (embed)
- [ ] Página dedicada ALDEBARUN II com ranking de tempos de corrida
- [x] Logs de auditoria de resultados

### Semana 8 — LGPD, UX e E-mail
- [ ] Página de Política de Privacidade
- [ ] Mecanismo de solicitação de exclusão de dados
- [ ] Envio de e-mail (confirmação de inscrição, cupons, reset de senha)
- [ ] Ajustes de UX Mobile (testes em dispositivos reais)
- [~] Página pública Home / Landing Page completa

## Fase 3 — Qualidade e Produção (Semanas 9–10)
Duração estimada: 2 semanas

- [ ] Testes de carga (500 usuários simultâneos)
- [ ] Auditoria de segurança (OWASP básico)
- [ ] Setup de produção na VPS (Docker Compose prod)
- [ ] Configuração SSL (Let's Encrypt via Certbot)
- [ ] Configuração de backup automático
- [ ] Documentação de operação e runbook
- [ ] Testes de aceitação com a Comissão Organizadora
- [ ] Go-live

---

# 14. CRITÉRIOS DE ACEITE

## 14.1 Por Funcionalidade (MVP)

| ID | Critério | Método de Validação |
|---|---|---|
| CA-01 | Atleta consegue se inscrever no portal em menos de 3 minutos | Teste de usabilidade com usuário real |
| CA-02 | CPF duplicado é rejeitado com mensagem clara | Teste funcional automatizado |
| CA-03 | Convidado fica em status Pendente até aprovação do Admin | Teste funcional |
| CA-04 | Campo de tamanho de camiseta é obrigatório (bloqueio sem seleção) | Teste de validação de formulário |
| CA-05 | Checkbox LGPD é obrigatório (bloqueio sem aceite) | Teste de validação |
| CA-06 | Log LGPD é gerado com CPF, timestamp e IP | Verificação no banco de dados |
| CA-07 | Cota Bronze é bloqueada após 8 vendas | Teste funcional: inserir 9ª cota → erro esperado |
| CA-08 | Cupons gerados automaticamente ao ativar patrocínio | Verificar N cupons na tabela após ativação |
| CA-09 | Cupom não pode ser usado duas vezes | Tentar resgatar cupom já utilizado → erro esperado |
| CA-10 | Placar atualiza após lançamento de resultado (≤ 5s) | Teste cronometrado |
| CA-11 | Patrocinadores Ouro têm maior destaque no Backdrop | Inspeção visual do componente |
| CA-12 | Toda a interface é usável em tela de 375px (iPhone SE) | Teste em dispositivo real ou emulador |
| CA-13 | Link de WhatsApp no rodapé abre o chat correto | Teste manual |
| CA-14 | Login Admin inválido retorna erro, não acessa o painel | Teste de segurança básico |
| CA-15 | SSL ativo e certificado válido em produção | `curl -I https://dominio` → sem warning SSL |

---

# 15. RISCOS E GAPS

## 15.1 Riscos Técnicos

| ID | Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| RT-01 | Latência alta do placar ao vivo em conexões 4G/Wi-Fi sobrecarregadas durante o evento | Média | Alto | Polling como fallback (10s); cache agressivo no Redis |
| RT-02 | Múltiplos admins lançando resultados simultaneamente causando condição de corrida | Baixa | Alto | Transações atômicas no banco + lock otimista via Prisma |
| RT-03 | Template next-shadcn pode ter versão desatualizada das dependências | Baixa | Médio | Audit de dependências na fase 0; atualização controlada |
| RT-04 | MinIO sem backup em produção causando perda de logos/fotos | Média | Médio | Configurar sync para S3/Cloudflare R2 em produção |
| RT-05 | Certificado SSL expirado durante o evento | Baixa | Crítico | Let's Encrypt com renovação automática (certbot-renew cron) |

## 15.2 Riscos de Negócio / Requisitos

| ID | Gap | Impacto | Ação Requerida |
|---|---|---|---|
| RG-01 | Sistema de pagamento não definido | Alto — sem confirmação automatizada | Decidir: PIX manual, Mercado Pago, Stripe ou outro |
| RG-02 | Pesos de pontuação por categoria não fornecidos | Alto — motor não pode ser calibrado | Validar tabela padrão com Manoel Neto |
| RG-03 | Categorias de corrida ALDEBARUN (faixas etárias, masculino/feminino) não especificadas | Médio | Solicitar regulamento da corrida |
| RG-04 | Domínio e hospedagem da VPS não definidos | Alto — produção bloqueada | Definir provedor (ex: Hostinger, DigitalOcean, AWS) |
| RG-05 | Número máximo de atletas por modalidade não definido | Médio | Definir por modalidade no módulo de configuração |
| RG-06 | Processo de controle de acesso físico às quadras (vinculação portal ↔ acesso físico) | Fora do escopo | Confirmar se fora de escopo ou futura integração |
| RG-07 | Comunicação com moradores (notificações push, SMS) não mencionada | Médio | Avaliar inclusão de e-mail marketing básico |

---

# 16. MVP vs FASE 2

## MVP (Semanas 1–5) — Go-Live Mínimo

**Inclui:**
- ✅ Inscrição de atletas (Titular, Familiar, Convidado)
- ✅ Vinculação a equipes
- 🟡 Aceite LGPD com log (registro parcial; fluxo completo ainda não finalizado)
- ✅ Painel Admin completo (gestão de atletas, aprovação de convidados)
- ✅ Venda de cotas de patrocínio com controle de limite
- ✅ Geração e resgate de cupons
- ✅ Lançamento de resultados pelo Admin
- ✅ Placar consolidado das equipes (via polling — sem WebSocket)
- ✅ Cadastro de modalidades
- ✅ Motor de pontuação básico
- 🟡 Home/Landing Page informativa
- ❌ Link de suporte WhatsApp
- 🟡 Deploy em Docker (ambiente de projeto pronto; homologação/produção real ainda não ativadas)

**Exclui (Fase 2):**
- ❌ Live Score via WebSocket/SSE (substituído por polling no MVP)
- 🟡 Backdrop Digital dinâmico com rotação
- 🟡 Galeria de fotos e vídeos
- ❌ Página dedicada ALDEBARUN II com ranking de corrida
- ✅ Upload de fotos do evento
- ✅ Logs de auditoria de resultados com interface
- ❌ Mecanismo de exclusão de dados LGPD (solicitação)
- ❌ E-mails automáticos (confirmações, cupons)

## Status Geral Atual (Atualizado em 23/04/2026)

| Bloco | Situação |
|---|---|
| MVP central do evento | ✅ Majoritariamente implementado |
| Painel administrativo operacional | ✅ Forte |
| Tempo real pleno (SSE/WebSocket + Redis) | ❌ Pendente |
| LGPD completo | 🟡 Parcial |
| Autenticação completa (refresh/reset/admin management) | 🟡 Parcial |
| Portal público premium completo | 🟡 Parcial |
| ALDEBARUN II dedicado | ❌ Pendente |
| Homologação/produção real ativada | ❌ Pendente |

## Fase 2 — Completude

Todas as funcionalidades acima + polimento de UX + testes de carga + documentação completa de operação.

---

# 17. PRÓXIMOS PASSOS

## Ações Imediatas (Esta Semana)

| # | Ação | Responsável | Prazo |
|---|---|---|---|
| 1 | Agendar reunião de alinhamento com Manoel Neto para validar assunções A01–A10 | Tech Lead | 48h |
| 2 | Definir sistema de pagamento (RG-01) | Organizador + Tech Lead | 72h |
| 3 | Fornecer regulamento com pesos de pontuação (RG-02) | Comissão Organizadora | 72h |
| 4 | Fornecer regulamento ALDEBARUN II com categorias de corrida (RG-03) | Comissão Organizadora | 72h |
| 5 | Definir domínio e contratar VPS (RG-04) | Organizador | 1 semana |
| 6 | Clonar template next-shadcn e configurar ambiente Docker Dev | Dev Frontend | 2 dias |
| 7 | Criar banco de dados e primeiras migrations com Prisma | Dev Backend | 2 dias |
| 8 | Definir paleta de cores das equipes (Mucura/Jacaré/Capivara) | Designer / Organizador | 3 dias |
| 9 | Obter logos dos patrocinadores confirmados para testes | Comissão | 1 semana |
| 10 | Criar repositório Git e documentar README com instruções Docker | Tech Lead | 2 dias |

## Estrutura de Equipe Mínima Recomendada

| Papel | Quantidade | Responsabilidade Principal |
|---|---|---|
| Dev Full-Stack Sênior | 1 | Backend NestJS, banco de dados, Docker |
| Dev Frontend | 1 | Next.js, shadcn/ui, componentes públicos |
| Tech Lead / Arquiteto | 1 | Revisão de código, decisões de arquitetura |
| QA / Testes | 1 (part-time) | Testes funcionais e de carga |

## Entregáveis da Fase 0 (antes do desenvolvimento)

1. **ADR (Architecture Decision Record):** Confirmação da stack por todos os stakeholders técnicos
2. **Ambiente Docker de Dev funcionando:** `docker-compose up` sobe todos os 7 serviços sem erros
3. **Template configurado:** Sidebar, cores, logo do INTRADEBAS 2026 aplicados
4. **Schema de banco aprovado:** Migrations criadas e revisadas
5. **Backlog priorizado:** Histórias de usuário no Jira/Linear/Notion com critérios de aceite
6. **Reunião de kickoff realizada** com Manoel Neto e a Comissão Organizadora

---

*Documento gerado como especificação técnica base para o Portal INTRADEBAS 2026 + ALDEBARUN II.*
*Versão 1.0 — Abril 2026*
*Gaps e assunções devem ser resolvidos com a Comissão Organizadora antes do início do desenvolvimento.*
