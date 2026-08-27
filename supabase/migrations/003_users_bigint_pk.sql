-- 003_users_bigint_pk.sql
-- Troca a PK de users (uuid -> bigint identity) e reaponta tasks.user_id.
-- tasks mantém sua PK uuid: a tabela será substituída por `entries` na migration 004.

begin;

-- 1) Coluna nova em users. Ao criar como identity, o Postgres numera
--    as linhas existentes (1, 2, 3...) e ajusta a sequência sozinho.
alter table public.users
  add column id_novo bigint generated always as identity;

-- 2) Coluna espelho em tasks, ainda anulável enquanto copiamos.
alter table public.tasks
  add column user_id_novo bigint;

-- 3) Copia a correspondência uuid -> bigint via join.
update public.tasks t
set user_id_novo = u.id_novo
from public.users u
where u.id = t.user_id;

-- 4) Se alguma linha ficou sem dono, a migration falha aqui e faz rollback.
alter table public.tasks
  alter column user_id_novo set not null;

-- 5) Derruba TODA constraint de tasks que dependa de user_id
--    (a FK de 001 e a unique composta de 002), sem depender do nome exato.
do $$
declare c record;
begin
  for c in
    select conname
    from pg_constraint
    where conrelid = 'public.tasks'::regclass
      and contype in ('f', 'u')
      and pg_get_constraintdef(oid) ilike '%user_id%'
  loop
    execute format('alter table public.tasks drop constraint %I', c.conname);
  end loop;
end $$;

-- 6) Aposenta as colunas antigas e promove as novas.
alter table public.users drop constraint users_pkey;
alter table public.users drop column id;
alter table public.users rename column id_novo to id;
alter table public.users add constraint users_pkey primary key (id);

alter table public.tasks drop column user_id;
alter table public.tasks rename column user_id_novo to user_id;

-- 7) Recria os vínculos com nomes explícitos.
alter table public.tasks
  add constraint tasks_user_id_fkey
  foreign key (user_id) references public.users(id) on delete cascade;

alter table public.tasks
  add constraint tasks_user_id_numero_key
  unique (user_id, numero);

create index if not exists tasks_user_id_idx on public.tasks (user_id);


commit;


-- RESUMO
-- adicionado coluna nova com id users e tasks
-- copiar registros dos ids antigos pra id novo em tasks
-- derruba toda constraint de tasks que depende do cod user
-- dropa constraint -> dropa coluna -> rename coluna novo -> adicionar constraint na nova coluna
-- recria vinculo na tabela tasks 

