# Sistema de Gestão de Tarefas via Telegram, n8n, Supabase e IA - V 1.0


## 🛠️ Tech Stack 
 Telegram Bot · n8n cloud · Supabase/PostgreSQL · OpenAI · React + Vite · Vercel 

## A Motivação por Trás do Projeto
Ferramentas tradicionais de produtividade (como Notion, Trello ou Todoist) cobram um alto custo de atrito mental. No meio da rotina, seja cozinhando, na rua ou no meio de outra tarefa, ter que abrir um aplicativo pesado, navegar entre telas e preencher formulários faz com que ideias e lembretes se percam no caminho, se torna um processo muito massivo de fazer na correria do dia adia.

Este projeto nasceu da minha necessidade de um **"brain dump" sem barreiras**: um canal direto onde o usuário simplesmente registra evento ou tarefa, envia um texto ou áudio rápido e o sistema cuida do resto (classificação, priorização e organização). Nessa mesma parte onde fica estabelicido no Telegram bot ainda é possivel ver tarefas e eventos em aberto. 

Caso usuário ainda prefira mais tarde é possivel editar, agendar, excluir  tarefas em interface web, onde o link é disponibilizado no próprio bot do Telegram.

## ⚠️ Problema Resolvido
* **Zero Atrito na Captura:** A captura de tarefas é reduzida a uma única mensagem no aplicativo que o usuário já abre dezenas de vezes por dia (Telegram).
* **Processamento Inteligente:** Em vez de exigir que o usuário categorize manualmente no momento da correria, um modelo de linguagem (LLM) analisa o contexto e define categoria e prioridade automaticamente.
* **Flexibilidade Híbrida (Próximas Versões):** O Telegram atua como a camada de entrada ultra-rápida (mobile), enquanto um painel web futuro (desktop) garantirá a gestão visual avançada, dashboards e edições manuais granulares.

## Arquitetura 

1. Captura 
Telegram (texto, áudio, e botões)

2. Orquestração    ->  OpenAI / gpt-4o-mini / Whisper 
n8n cloud
worflow

3. Base 
Supabase/PostgreSQL

4. Refino -> Visualização melhorada  ->  Auth (Google)
React + vite  = kanban -> Vercel

Essa separação de Telegram e Web ainda dá suporte caso algum caia, tendo disponivel uma segunda opção caso um caia, web cai, fica disponivel o Telegram, Telelgram cai ainda tem o web disponivel.
Caso OpenAI caia ainda grava normalmente somente não irá categorizar pois ela não é o motor de gravação, irá apenas salvar como não processada.


## O que já está pronto (v1.0)

- Bot no Telegram com comandos determinísticos (`/add`, `/listar`, `/concluir`, `/remover`, `/ajuda`) e menu com botões de acesso rápido.
- Captura por texto **e áudio** (Whisper).
- Roteador de IA classificando intenção, categoria, prioridade e data em JSON estruturado.
- Fallback: IA fora do ar não interrompe a captura.
- Painel web em React com login **Sign in with Google** via Supabase Auth.
- Vínculo Telegram ↔ conta Google por código de 6 dígitos (uso único, 10 minutos, hash no banco).
- Migrations versionadas, RLS habilitado, chaves primárias `bigint identity`.
- Modelo de dados unificado em `entries` (Single Table Inheritance por `tipo`).

---

## 🚧 Próxima fase — Migrar a regra do n8n para Python (FastAPI) - Em construção

**Esta é a próxima entrega e a mais importante do projeto.**

Hoje a classificação e a validação da saída do LLM vivem em nós Code do n8n. Isso funciona, mas:
- **Não é testável.** Sem `pytest` de regressão.
- **Não migra.** Preso à plataforma.