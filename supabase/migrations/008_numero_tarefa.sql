-- 008_numero_reciclado.sql
-- numero é RÓTULO de exibição, não identidade. A identidade é o id.
-- Rótulo que a usuária fala em voz alta precisa caber na boca.
begin;

-- Entrada fechada não precisa de rótulo: devolve o número.
alter table public.entries alter column numero drop not null;

alter table public.entries drop constraint entries_numero_por_usuario;

-- Índice parcial: só o que tem rótulo participa da unicidade.
create unique index entries_numero_ativo_idx
  on public.entries (user_id, numero)
  where numero is not null;

create or replace function public.atribuir_numero_entry()
returns trigger
language plpgsql
as $$
begin
  if new.numero is null then
    -- Menor número LIVRE, não o próximo. É o que impede o crescimento.
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
-- Faxina do acervo atual, em dois tempos para não colidir no índice.
-- ------------------------------------------------------------------
update public.entries set numero = null;

with ordenado as (
  select id, row_number() over (partition by user_id order by criado_em, id) as n
  from public.entries
  where status = 'pendente'
)
update public.entries e
set numero = o.n
from ordenado o
where e.id = o.id;

commit;