-- 006_vinculo.sql
-- Código de 6 dígitos, uso único, 10 minutos, guardado como hash bcrypt.
-- Conecta a conta do Telegram à conta Google que fará login no painel (Fase 9).

begin;

-- A ponte entre o mundo Telegram e o mundo Supabase Auth.
alter table public.users
  add column auth_user_id uuid unique;

create table public.vinculo_codigos (
  id          bigint generated always as identity primary key,
  user_id     bigint      not null references public.users(id) on delete cascade,
  codigo_hash text        not null,
  expira_em   timestamptz not null,
  usado_em    timestamptz,
  criado_em   timestamptz not null default now()
);

-- Índice parcial: só os códigos vivos são consultados.
create index vinculo_codigos_abertos_idx
  on public.vinculo_codigos (user_id)
  where usado_em is null;

-- ------------------------------------------------------------------
-- Geração: devolve o código em claro UMA vez; no banco fica só o hash.
-- ------------------------------------------------------------------
create or replace function public.gerar_codigo_vinculo(p_user_id bigint)
returns text
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_int    int;
  v_codigo text;
begin
  -- 4 bytes de CSPRNG viram um inteiro; o módulo dá os 6 dígitos.
  v_int := ('x' || encode(gen_random_bytes(4), 'hex'))::bit(32)::int;
  v_codigo := lpad(abs(v_int % 1000000)::text, 6, '0');

  -- Um usuário, um código vivo: pedir de novo invalida o anterior.
  update public.vinculo_codigos
  set usado_em = now()
  where user_id = p_user_id and usado_em is null;

  insert into public.vinculo_codigos (user_id, codigo_hash, expira_em)
  values (p_user_id,
          crypt(v_codigo, gen_salt('bf', 10)),
          now() + interval '10 minutes');

  return v_codigo;
end $$;

-- ------------------------------------------------------------------
-- Validação: consumida pelo painel React na Fase 9.5.
-- ------------------------------------------------------------------
create or replace function public.validar_codigo_vinculo(p_codigo text, p_auth_uid uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_registro public.vinculo_codigos;
begin
  -- crypt(candidato, hash_guardado) devolve o próprio hash quando confere.
  select * into v_registro
  from public.vinculo_codigos vc
  where vc.usado_em is null
    and vc.expira_em > now()
    and vc.codigo_hash = crypt(p_codigo, vc.codigo_hash)
  order by vc.criado_em desc
  limit 1;

  if not found then
    return jsonb_build_object('ok', false, 'motivo', 'codigo_invalido_ou_expirado');
  end if;

  update public.vinculo_codigos set usado_em = now() where id = v_registro.id;

  begin
    update public.users set auth_user_id = p_auth_uid where id = v_registro.user_id;
  exception when unique_violation then
    return jsonb_build_object('ok', false, 'motivo', 'conta_google_ja_vinculada');
  end;

  return jsonb_build_object('ok', true, 'user_id', v_registro.user_id);
end $$;

alter table public.vinculo_codigos enable row level security;
revoke all on public.vinculo_codigos from anon, authenticated;

-- O painel chama a validação por RPC; a função é security definer e
-- passa por cima do RLS de propósito, com escopo de uma linha só.
grant execute on function public.validar_codigo_vinculo(text, uuid) to authenticated;

commit;