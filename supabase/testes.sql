-- cria um usuário de teste com a chave "minha-chave-123" hasheada
insert into public.users (telegram_id, first_name, username, access_key_hash)
values (999999999, 'Maria', 'maria_test',
        extensions.crypt('minha-chave-123', extensions.gen_salt('bf', 10)))
returning id, telegram_id, access_key_hash;


-- simula o login: a chave certa encontra o usuário
select id, first_name from public.users
where telegram_id = 999999999
  and access_key_hash = extensions.crypt('minha-chave-123', access_key_hash);

-- a chave errada não encontra nada
select id from public.users
where telegram_id = 999999999
  and access_key_hash = extensions.crypt('chave-errada', access_key_hash);

-- teste trigger e cascade
insert into public.tasks (user_id, title)
select id, 'Tarefa de teste' from public.users where telegram_id = 999999999;

update public.tasks set status = 'concluida' where title = 'Tarefa de teste';

select title, status, completed_at, updated_at from public.tasks where title = 'Tarefa de teste';

--limpeza
delete from public.users where telegram_id = 999999999;

select count(*) as tarefas_orfas from public.tasks;