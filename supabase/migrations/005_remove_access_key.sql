-- 005_remove_access_key.sql
-- A chave permanente sai. O vínculo passa a ser o código de /vincular (Fase 8).
begin;
alter table public.users drop column access_key_hash;
commit;