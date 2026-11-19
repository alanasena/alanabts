-- =========================================================
-- CLOSET: cole no SQL Editor do Supabase e clique em RUN.
-- Guarda os 4 cantos soltos de cada roupa/cabelo.
-- =========================================================
alter table bonequinha_ajustes add column if not exists q double precision[];
