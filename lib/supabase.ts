"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Essas duas chaves são públicas (podem ficar no código).
// A segurança vem das regras do banco: só quem está logada edita.
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://uatchxbefkdksuixxvgi.supabase.co";
const CHAVE = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_90HqOXYwKy3fE0s2aWSTVA_v9y5-NJb";

let cliente: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
  cliente ??= createClient(URL, CHAVE, {
    auth: { persistSession: true, autoRefreshToken: true, storageKey: "bts:sessao" },
  });
  return cliente;
}

// Sobe uma imagem pra pasta "fotos" e devolve o link público
export async function subirFoto(arquivo: File, pasta: string): Promise<string> {
  const ext = arquivo.name.split(".").pop()?.toLowerCase() || "jpg";
  const caminho = `${pasta}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase().storage.from("fotos").upload(caminho, arquivo, { cacheControl: "31536000" });
  if (error) throw error;
  return supabase().storage.from("fotos").getPublicUrl(caminho).data.publicUrl;
}
