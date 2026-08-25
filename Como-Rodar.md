# Guia de Instalação e como Utilizar 

### Serviços 
- Criar contas gratuitas
  - Supabase
  - n8n Cloud
  - OpenAI

### Baixar o projeto 
```bash
git clone link_projeto
cd pasta_projeto_raiz
```

### Criar o banco de dados 
Supabase -> Login -> new project -> SQL editor -> executar scripts abaixo: supabase/migrations/001_init_schema.sql
supabase/migrations/002_task_numbering.sql
Pegar credenciais conforme tem no arquivo .env.example

### Criar o bot no Telegram 
1. No Telegram, procure por @BotFather (com selo azul de verificado).
2. Envie /newbot.
3. Ele pede duas coisas:
4. Nome de exibição — livre, ex.: Task Manager
5. Username — precisa ser único e terminar em bot, ex.: meu_task_manager_bot
6. Ele responde com um token no formato 1234567890:AAH.... Guarde esse token.

- Aproveite e configure o menu de comandos. Envie /setcommands, escolha seu bot e cole:

add - Criar uma nova tarefa
listar - Ver suas tarefas em aberto
concluir - Concluir tarefas (aceita vários números)
remover - Remover tarefas (aceita vários números)
ajuda - Mostrar os comandos disponíveis

### Preencher o arquivo de configuração 
Abra o .env num editor de texto e preencha. Onde encontrar cada valor no painel do Supabase:

Project Settings → API → copie Project URL, a chave anon public e a service_role
Project Settings → Database → Connection string → aba Session pooler → copie host, porta e usuário exatamente como aparecem ali

O token do BotFather vai em TELEGRAM_BOT_TOKEN.

### Configurar o n8n
1. Acesse n8n.io e crie a conta (teste gratuito de 14 dias).
2. Escolha um subdomínio, ex.: seu-nome.app.n8n.cloud.

3. Cadastrar as três credenciais
- postgres
- telegram
- openAI

4. Importar o fluxo
- No n8n, clique em Create Workflow.
- No menu ⋯ (canto superior direito), escolha Import from File...
- Selecione o arquivo n8n/workflows/auth-crud-ia.json do projeto.

5. Para testar -> Publish