-- 007_contexto_conversa.sql
-- O áudio chega numa mensagem separada do clique. Sem memória, o bot não sabe
-- que o áudio é a resposta do botão que acabou de ser apertado.
begin;

alter table public.users
  add column contexto          text,         -- 'add:tarefa', 'concl:evento', null
  add column contexto_em       timestamptz,  -- expira em 10 minutos
  add column ultima_interacao  timestamptz;

comment on column public.users.contexto is
  'Passo do menu que a usuária escolheu e ainda não completou. Máquina de estado de um campo só.';

commit;