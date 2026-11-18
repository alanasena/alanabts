-- =========================================================
-- CLOSET DA ALANA: cole no SQL Editor do Supabase e clique em RUN.
-- Guarda onde cada roupa fica em cima da boneca.
-- =========================================================
create table if not exists bonequinha_ajustes (
  id text primary key,            -- id da roupa (ex: c01, b05, v03)
  x double precision not null,
  y double precision not null,
  w double precision not null,
  h double precision not null,
  atualizado_em timestamptz not null default now()
);

alter table bonequinha_ajustes enable row level security;

drop policy if exists "todos_veem_ajustes" on bonequinha_ajustes;
create policy "todos_veem_ajustes" on bonequinha_ajustes for select using (true);

drop policy if exists "logada_salva_ajustes" on bonequinha_ajustes;
create policy "logada_salva_ajustes" on bonequinha_ajustes for all
  to authenticated using (true) with check (true);
