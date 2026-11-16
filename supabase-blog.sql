-- =========================================================
-- BLOG (theSpill): cole no SQL Editor do Supabase e clique em RUN.
-- Pode rodar mais de uma vez sem problema.
-- =========================================================
alter table blog_posts add column if not exists tipo text not null default 'post';
alter table blog_posts add column if not exists categoria text;
alter table blog_posts add column if not exists tags text[] not null default '{}';
alter table blog_posts add column if not exists humor text;
alter table blog_posts add column if not exists ouvindo text;
alter table blog_posts add column if not exists publicado boolean not null default true;

-- visitante só vê o que foi publicado; rascunho só a Alana vê
drop policy if exists "todos_leem" on blog_posts;
drop policy if exists "todos_leem_publicados" on blog_posts;
create policy "todos_leem_publicados" on blog_posts for select using (publicado = true);
-- (a regra "alana_edita" que já existe deixa você ver e mexer em tudo quando está logada)
