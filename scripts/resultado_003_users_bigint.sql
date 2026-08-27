select table_name, column_name, data_type, is_identity
from information_schema.columns
where (table_name = 'users' and column_name = 'id')
   or (table_name = 'tasks' and column_name = 'user_id')
order by table_name;

select u.id, u.telegram_id, count(t.id) as tarefas
from public.users u
left join public.tasks t on t.user_id = u.id
group by u.id, u.telegram_id
order by u.id;