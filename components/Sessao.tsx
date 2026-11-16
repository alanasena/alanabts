"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import Janela from "./Janela";

type Ctx = {
  usuaria: User | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<string | null>;
  sair: () => Promise<void>;
};

const SessaoCtx = createContext<Ctx | null>(null);
export const useSessao = () => useContext(SessaoCtx)!;

export default function Sessao({ children }: { children: React.ReactNode }) {
  const [usuaria, setUsuaria] = useState<User | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const sb = supabase();
    sb.auth.getSession().then(({ data }) => {
      setUsuaria(data.session?.user ?? null);
      setCarregando(false);
    });
    const { data } = sb.auth.onAuthStateChange((_e, sessao) => setUsuaria(sessao?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  const entrar = async (email: string, senha: string) => {
    const { error } = await supabase().auth.signInWithPassword({ email, password: senha });
    if (!error) return null;
    return error.message.includes("Invalid") ? "E-mail ou senha errados 🥲" : "Não consegui entrar agora. Tenta de novo.";
  };
  const sair = async () => {
    await supabase().auth.signOut();
  };

  return <SessaoCtx.Provider value={{ usuaria, carregando, entrar, sair }}>{children}</SessaoCtx.Provider>;
}

export function FormEntrar() {
  const { entrar } = useSessao();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [indo, setIndo] = useState(false);

  return (
    <form
      className="form-entrar"
      onSubmit={async (e) => {
        e.preventDefault();
        setIndo(true);
        setErro((await entrar(email.trim(), senha)) ?? "");
        setIndo(false);
      }}
    >
      <label>
        e-mail
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
      </label>
      <label>
        senha
        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required autoComplete="current-password" />
      </label>
      {erro && <p className="erro">{erro}</p>}
      <button className="botao-gloss" disabled={indo}>{indo ? "entrando..." : "entrar ✦"}</button>
    </form>
  );
}

// Envolve as páginas privadas: sem login, mostra o cadeado
export function Trancado({ children }: { children: React.ReactNode }) {
  const { usuaria, carregando } = useSessao();
  if (carregando) return <p className="carregando-dados pixel">carregando...</p>;
  if (!usuaria)
    return (
      <div className="trancado">
        <Janela titulo="area_secreta.exe" icone="🔒" cor="preto" fita>
          <p className="trancado-msg">
            Ops! Essa parte é só da <b>Alana</b> 💅<br />
            Se você é a Alana, entra aqui:
          </p>
          <FormEntrar />
        </Janela>
      </div>
    );
  return <>{children}</>;
}
