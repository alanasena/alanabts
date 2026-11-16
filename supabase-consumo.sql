-- =========================================================
-- TÔ OUVINDO & VENDO: cole no SQL Editor do Supabase e clique em RUN.
-- =========================================================
alter table consumo add column if not exists comentario text;
alter table consumo add column if not exists status text;
alter table consumo add column if not exists atual boolean not null default true;
