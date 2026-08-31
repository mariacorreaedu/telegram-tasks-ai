-- 009_rls_e_setor.sql
-- Autorização mora no banco. O front só pede; quem recusa é o Postgres.
begin;

-- ------------------------------------------------------------------
-- 1) Setor na conta — o segundo eixo do RLS, ao lado de auth.uid()
-- ------------------------------------------------------------------
alter table public.users add column setor text;

-- ------------------------------------------------------------------
-- 2) A validação do código passa a ler auth.uid() do próprio token.
--    Receber o uid como parâmetro era um buraco: o cliente poderia
--    mandar o uid de outra pessoa e sequestrar o vínculo dela.
-- ------------------------------------------------------------------
drop function if exists public.validar_codigo_vinculo(text, uuid);

create or replace function public.validar_codigo_vinculo(p_codigo text)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_registro public.vinculo_codigos;
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    return jsonb_build_object('ok', false, 'motivo', 'sem_sessao');
  end if;

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
    update public.users set auth_user_id = v_uid where id = v_registro.user_id;
  exception when unique_violation then
    return jsonb_build_object('ok', false, 'motivo', 'conta_google_ja_vinculada');
  end;

  return jsonb_build_object('ok', true);
end $$;

grant execute on function public.validar_codigo_vinculo(text) to authenticated;

-- ------------------------------------------------------------------
-- 3) Quem sou eu, do ponto de vista do banco.
--    security definer porque precisam ler users para descobrir a
--    identidade — se dependessem do RLS de users, seria circular.
-- ------------------------------------------------------------------
create or replace function public.usuario_atual()
returns bigint
language sql stable security definer
set search_path = public
as $$ select id from public.users where auth_user_id = auth.uid(); $$;

create or replace function public.setor_atual()
returns text
language sql stable security definer
set search_path = public
as $$ select setor from public.users where auth_user_id = auth.uid(); $$;

grant execute on function public.usuario_atual() to authenticated;
grant execute on function public.setor_atual()  to authenticated;

-- ------------------------------------------------------------------
-- 4) A trigger de numeração precisa ver TODAS as linhas do usuário para
--    achar o menor número livre. Sob RLS ela veria só o permitido e
--    poderia repetir um número. Vira security definer.
-- ------------------------------------------------------------------
create or replace function public.atribuir_numero_entry()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.numero is null then
    select coalesce(min(s.n), 1) into new.numero
    from generate_series(
           1,
           (select coalesce(max(numero), 0) + 1
            from public.entries where user_id = new.user_id)
         ) as s(n)
    where not exists (
      select 1 from public.entries e
      where e.user_id = new.user_id and e.numero = s.n
    );
  end if;
  return new;
end $$;

-- ------------------------------------------------------------------
-- 5) Policies
-- ------------------------------------------------------------------
grant select on public.users to authenticated;

create policy users_propria_linha on public.users
  for select to authenticated
  using (auth_user_id = auth.uid());

grant select, insert, update, delete on public.entries to authenticated;

-- Vejo o que é meu e o que é do meu setor. Nada além.
create policy entries_ler on public.entries
  for select to authenticated
  using (
    user_id = public.usuario_atual()
    or (setor is not null and setor = public.setor_atual())
  );

-- Criar é sempre em nome próprio.
create policy entries_criar on public.entries
  for insert to authenticated
  with check (user_id = public.usuario_atual());

-- using diz o que posso tocar; with check diz no que posso transformar.
-- Os dois juntos impedem mover uma entrada para a conta de outra pessoa.
create policy entries_alterar on public.entries
  for update to authenticated
  using (
    user_id = public.usuario_atual()
    or (setor is not null and setor = public.setor_atual())
  )
  with check (
    user_id = public.usuario_atual()
    or (setor is not null and setor = public.setor_atual())
  );

-- Apagar só o que é meu, mesmo dentro do setor.
create policy entries_apagar on public.entries
  for delete to authenticated
  using (user_id = public.usuario_atual());

commit;