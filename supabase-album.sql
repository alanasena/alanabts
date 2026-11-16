-- =========================================================
-- ÁLBUM (câmera): cole no SQL Editor do Supabase e clique em RUN.
-- =========================================================
alter table album_fotos add column if not exists lugar text;
alter table album_fotos add column if not exists data date;
