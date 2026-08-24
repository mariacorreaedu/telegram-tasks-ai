# Telegram Task AI

Sistema de gerenciamento de tarefas (CRUD) com Telegram como interface,
n8n como orquestrador de automações e Supabase (PostgreSQL) como camada de dados,
com classificação automática de tarefas via LLM.

**Stack:** **Telegram Bot API · n8n · Supabase / PostgreSQL · OpenAI**

### Estrutura
| Caminho | Conteúdo |
| --- | --- |
| `supabase/migrations/` | Scripts SQL de criação db |
| `n8n/workflows/` | Workflows |
| `scripts/` | Scripts auxiliares |
### Setup

1. Crie um projeto no Supabase e execute `supabase/migrations/001_init_schema.sql`.
2. Copie `.env.example` para `.env` e preencha as variáveis.
3. Importe os workflows de `n8n/workflows/` na sua instância n8n.

