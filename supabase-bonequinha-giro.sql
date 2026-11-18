-- =========================================================
-- CLOSET: cole no SQL Editor do Supabase e clique em RUN.
-- Agora as roupas também podem girar.
-- =========================================================
alter table bonequinha_ajustes add column if not exists r double precision not null default 0;
