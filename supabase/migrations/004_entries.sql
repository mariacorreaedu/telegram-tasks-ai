-- 004_entries.sql
-- Single Table Inheritance: uma tabela `entries`, `tipo` como discriminador,
-- colunas específicas anuláveis e regras por tipo em CHECK condicional.
-- Substitui `tasks`, que é derrubada ao final.

begin;

create type entry_tipo        as enum ('evento', 'tarefa', 'nota', 'ideia');
create type entry_prioridade  as enum ('baixa', 'media', 'alta', 'urgente');
create type entry_status      as enum ('pendente', 'concluida', 'cancelada');
create type kanban_coluna     as enum ('com_prazo', 'sem_prazo', 'fazer_hoje', 'fila_espera');
create type entry_origem      as enum ('texto', 'audio');
create type google_sync_status as enum ('nao_enviado', 'enviado', 'dessincronizado', 'erro');

create table public.entries (
  id      bigint generated always as identity primary key,
  user_id bigint  not null references public.users(id) on delete cascade,
  numero  integer not null,

  -- EIXO 1: o que é
  tipo       entry_tipo       not null,
  titulo     text             not null,
  conteudo   text,
  categoria  text             not null default 'outros',
  prioridade entry_prioridade not null default 'media',
  status     entry_status     not null default 'pendente',

  -- EIXO 2: onde está no quadro (persistido, não derivado — o drag and drop grava aqui)
  coluna kanban_coluna not null,

  -- Tempo
  inicio       timestamptz,
  fim          timestamptz,
  dia_inteiro  boolean not null default false,
  prazo_limite timestamptz,

  -- Uso corporativo (nulo no uso pessoal)
  setor            text,
  solicitante_nome text,

  -- Procedência
  origem        entry_origem  not null default 'texto',
  ia_processado boolean       not null default false,
  ia_confianca  numeric(3,2),

  -- EIXO 3: sincronização com o Google
  google_sync    google_sync_status not null default 'nao_enviado',
  google_event_id text,
  google_sync_em timestamptz,

  concluida_em  timestamptz,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),

  constraint entries_numero_por_usuario unique (user_id, numero),
  constraint entries_titulo_tamanho     check (char_length(titulo) between 1 and 200),
  constraint entries_confianca_faixa    check (ia_confianca is null or ia_confianca between 0 and 1),

  -- Regras por tipo: é aqui que a tabela única deixa de ser bagunça.
  constraint entries_evento_tem_inicio     check (tipo <> 'evento' or inicio is not null),
  constraint entries_fim_depois_do_inicio  check (fim is null or inicio is null or fim > inicio),
  constraint entries_nota_na_fila          check (tipo not in ('nota','ideia') or coluna = 'fila_espera'),
  constraint entries_google_id_obrigatorio check (google_sync <> 'enviado' or google_event_id is not null)
);

create index entries_user_coluna_idx on public.entries (user_id, coluna);
create index entries_user_inicio_idx on public.entries (user_id, inicio);
create index entries_setor_idx       on public.entries (setor) where setor is not null;

-- Numeração por usuário sai do SQL do n8n e vira trigger.
create or replace function public.atribuir_numero_entry()
returns trigger language plpgsql as $$
begin
  if new.numero is null then
    select coalesce(max(numero), 0) + 1 into new.numero
    from public.entries
    where user_id = new.user_id;
  end if;
  return new;
end $$;

create trigger trg_entries_numero
before insert on public.entries
for each row execute function public.atribuir_numero_entry();

create or replace function public.set_atualizado_em()
returns trigger language plpgsql as $$
begin
  new.atualizado_em := now();
  return new;
end $$;

create trigger trg_entries_atualizado_em
before update on public.entries
for each row execute function public.set_atualizado_em();

create or replace function public.sync_entry_concluida_em()
returns trigger language plpgsql as $$
begin
  if new.status = 'concluida' and old.status is distinct from 'concluida' then
    new.concluida_em := now();
  elsif new.status <> 'concluida' then
    new.concluida_em := null;
  end if;
  return new;
end $$;

create trigger trg_entries_concluida_em
before update on public.entries
for each row execute function public.sync_entry_concluida_em();

-- Migração das linhas de tasks como tipo = 'tarefa'.
insert into public.entries
  (user_id, numero, tipo, titulo, conteudo, categoria, prioridade, status, coluna,
   inicio, origem, ia_processado, concluida_em, criado_em, atualizado_em)
select
  t.user_id,
  t.numero,
  'tarefa'::entry_tipo,
  t.title,
  t.description,
  coalesce(t.category, 'outros'),
  (case t.priority::text
     when 'baixa'   then 'baixa'
     when 'alta'    then 'alta'
     when 'urgente' then 'urgente'
     else 'media'
   end)::entry_prioridade,
  (case
     when t.status::text in ('concluida','concluída','done','completed') then 'concluida'
     when t.status::text in ('cancelada','cancelled','canceled')         then 'cancelada'
     else 'pendente'
   end)::entry_status,
  (case when t.due_date is not null then 'com_prazo' else 'sem_prazo' end)::kanban_coluna,
  t.due_date::timestamptz,
  'texto'::entry_origem,
  coalesce(t.ai_processed, false),
  t.completed_at,
  t.created_at,
  t.updated_at
from public.tasks t;

-- Mesmo padrão da 001: deny by default até as policies da Fase 9.
alter table public.entries enable row level security;
revoke all on public.entries from anon, authenticated;

-- tasks deixa de existir. Nada de tabela zumbi.
drop table public.tasks;
drop function if exists public.sync_task_completed_at();
drop type if exists task_status;
drop type if exists task_priority;

commit;