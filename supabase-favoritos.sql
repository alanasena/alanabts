-- =========================================================
-- FAVORITOS DO MÊS: cole no SQL Editor do Supabase e clique em RUN.
-- =========================================================
alter table favoritos add column if not exists mes text;        -- ex: 2026-11
alter table favoritos add column if not exists categoria text;
alter table favoritos add column if not exists criado_em timestamptz not null default now();
