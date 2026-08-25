# Sistema de Gestão de Tarefas via Telegram, n8n, Supabase e IA

## 🛠️ Tech Stack 
Interface & Mensageria: Telegram Bot API
Orquestração & Automação: n8n Cloud
Banco de Dados & Backend: Supabase (PostgreSQL)
Inteligência Artificial: OpenAI (gpt-4o-mini)
Linguagem / Scripting: JavaScript

## A Motivação por Trás do Projetod
Ferramentas tradicionais de produtividade (como Notion, Trello ou Todoist) cobram um alto custo de atrito mental. No meio da rotina — seja cozinhando, na rua ou no meio de outra tarefa —, ter que abrir um aplicativo pesado, navegar entre telas e preencher formulários faz com que ideias e lembretes se percam no caminho.

Este projeto nasceu da necessidade de um **"brain dump" sem barreiras**: um canal direto onde o usuário simplesmente envia um texto ou áudio rápido e o sistema cuida do resto (classificação, priorização e organização).

## ⚠️ Problema Resolvido
* **Zero Atrito na Captura:** A captura de tarefas é reduzida a uma única mensagem no aplicativo que o usuário já abre dezenas de vezes por dia (Telegram).
* **Processamento Inteligente:** Em vez de exigir que o usuário categorize manualmente no momento da correria, um modelo de linguagem (LLM) analisa o contexto e define categoria e prioridade automaticamente.
* **Flexibilidade Híbrida (Próximas Versões):** O Telegram atua como a camada de entrada ultra-rápida (mobile), enquanto um painel web futuro (desktop) garantirá a gestão visual avançada, dashboards e edições manuais granulares.

## ↔️ Ferramentas e Competências
**Telegram** ->  Camada de apresentação e captura da entrada dos dados
**n8n cloud** -> Orquestrador de fluxo
**Supabase/Postgresql** -> Integridade dos Dados e armazenamento
**OpenAI** -> Entra mais como um bônus para categorização (foco em degradação graciosa)
**javascript** -> Normalização e tratamento das entradas e montagem dos retornos 
**Git / GITHUB** -> Versionamento

##  Fases do projeto
1. Modelagem do banco de dados
2. Repositorio local e credenciais
3. Autenticação e boas vindas
4. Operação CRUD
5. Integração LLM
6. Documentação

