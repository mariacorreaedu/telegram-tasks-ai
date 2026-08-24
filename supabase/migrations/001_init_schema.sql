
-- 0. Extensões
--   pgcrypto: usada para hash da chave de acesso (crypt + gen_salt).
--    No Supabase as extensões vivem no schema "extensions".
create extension if not exists pgcrypto with schema extensions;


-- 1. Tipos ENUM (domínios fechados)
do $$
begin
  if not exists (select 1 from pg_type where typname = 'task_status') then
    create type public.task_status as enum ('pendente', 'em_andamento', 'concluida', 'cancelada');
  end if;

  if not exists (select 1 from pg_type where typname = 'task_priority') then
    create type public.task_priority as enum ('baixa', 'media', 'alta', 'urgente');
  end if;
end
$$;


-- 2. Tabela: users
create table if not exists public.users (
  id              uuid        primary key default gen_random_uuid(),
  telegram_id     bigint      not null unique,
  first_name      text        not null check (length(trim(first_name)) > 0),
  username        text,
  access_key_hash text        not null,
  is_active       boolean     not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table  public.users                 is 'Usuários autenticados via Telegram.';
comment on column public.users.telegram_id     is 'ID numérico do chat/usuário no Telegram (chave natural, única).';
comment on column public.users.access_key_hash is 'Hash bcrypt da chave de acesso. NUNCA armazenar a chave em texto puro.';


-- 3. Tabela: tasks
create table if not exists public.tasks (
  id           uuid                primary key default gen_random_uuid(),
  user_id      uuid                not null references public.users(id) on delete cascade,
  title        text                not null check (length(trim(title)) between 1 and 200),
  description  text,
  status       public.task_status   not null default 'pendente',
  priority     public.task_priority not null default 'media',
  category     text,
  ai_processed boolean             not null default false,
  due_date     timestamptz,
  completed_at timestamptz,
  created_at   timestamptz         not null default now(),
  updated_at   timestamptz         not null default now()
);

comment on table  public.tasks              is 'Tarefas pertencentes a um usuário.';
comment on column public.tasks.user_id      is 'FK para users.id. ON DELETE CASCADE: remover usuário remove suas tarefas.';
comment on column public.tasks.category     is 'Categoria preenchida pela IA na Fase 5.';
comment on column public.tasks.ai_processed is 'Marca se a tarefa já passou pelo enriquecimento por LLM.';


-- 4. Índices (a FK não cria índice automaticamente no Postgres)
create index if not exists idx_tasks_user_id     on public.tasks (user_id);
create index if not exists idx_tasks_user_status on public.tasks (user_id, status);
create index if not exists idx_tasks_due_date    on public.tasks (due_date) where due_date is not null;


-- 5. Triggers de integridade temporal
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

drop trigger if exists trg_tasks_updated_at on public.tasks;
create trigger trg_tasks_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();


create or replace function public.sync_task_completed_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if new.status = 'concluida' and (old.status is distinct from 'concluida') then
    new.completed_at := now();
  elsif new.status <> 'concluida' then
    new.completed_at := null;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_tasks_completed_at on public.tasks;
create trigger trg_tasks_completed_at
  before update on public.tasks
  for each row execute function public.sync_task_completed_at();


-- 6. Row Level Security — deny by default
--    Sem POLICY criada, anon/authenticated não leem nem escrevem nada.
--    O n8n acessará com a service_role key, que faz bypass de RLS.
alter table public.users enable row level security;
alter table public.tasks enable row level security;

revoke all on public.users from anon, authenticated;
revoke all on public.tasks from anon, authenticated;