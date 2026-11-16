"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { hojeISO, textoFaltam, dataBonita } from "@/lib/datas";
import type { Evento, Meta } from "@/lib/tipos";
import { useSessao } from "./Sessao";

function SoAlana({ href }: { href: string }) {
  return (
    <div className="em-breve-mini">
      <p className="pixel">só a Alana vê</p>
      <p>Essa parte é secreta</p>
      <Link href={href} className="botao-gloss">entrar</Link>
    </div>
  );
}

export function ProximoPost() {
  const { usuaria, carregando } = useSessao();
  const [posts, setPosts] = useState<Evento[] | null>(null);
  const [contadores, setContadores] = useState<Evento[]>([]);

  useEffect(() => {
    if (!usuaria) return;
    const sb = supabase();
    sb.from("eventos").select("*").eq("tipo", "post").gte("data", hojeISO()).order("data").order("hora", { nullsFirst: true }).limit(3)
      .then(({ data }) => setPosts((data ?? []) as Evento[]));
    sb.from("eventos").select("*").eq("contador", true).gte("data", hojeISO()).order("data").limit(4)
      .then(({ data }) => setContadores((data ?? []) as Evento[]));
  }, [usuaria]);

  if (carregando) return <p className="pixel">...</p>;
  if (!usuaria) return <SoAlana href="/calendario" />;
  if (!posts) return <p className="pixel">carregando...</p>;

  return (
    <div className="proximos">
      {posts.length === 0 ? (
        <p>Nenhum post agendado. <Link href="/ideias">Escolhe uma ideia →</Link></p>
      ) : (
        <ul className="lista-proximos">
          {posts.map((p, i) => (
            <li key={p.id} className={i === 0 ? "destaque" : ""}>
              <span className="quando">{p.data === hojeISO() ? "HOJE" : dataBonita(p.data)}{p.hora && ` · ${p.hora.slice(0, 5)}`}</span>
              <span>{p.titulo}</span>
            </li>
          ))}
        </ul>
      )}
      {contadores.length > 0 && (
        <ul className="lista-contadores">
          {contadores.map((c) => (
            <li key={c.id}><b>{textoFaltam(c.data)}</b> pra {c.titulo}</li>
          ))}
        </ul>
      )}
      <Link href="/calendario" className="link-simples">abrir calendário →</Link>
    </div>
  );
}

export function MetasDoMes() {
  const { usuaria, carregando } = useSessao();
  const [metas, setMetas] = useState<Meta[] | null>(null);

  useEffect(() => {
    if (!usuaria) return;
    const d = new Date();
    supabase().from("metas").select("*").eq("periodo", "mes").eq("ano", d.getFullYear()).eq("mes", d.getMonth() + 1).order("criado_em")
      .then(({ data }) => setMetas((data ?? []) as Meta[]));
  }, [usuaria]);

  if (carregando) return <p className="pixel">...</p>;
  if (!usuaria) return <SoAlana href="/metas" />;
  if (!metas) return <p className="pixel">carregando...</p>;

  const feitas = metas.filter((m) => m.concluida).length;
  return (
    <div>
      <div className="progresso">
        <div className="progresso-barra">
          <span style={{ width: `${metas.length ? (feitas / metas.length) * 100 : 0}%` }} />
        </div>
        <p className="progresso-texto"><b>{feitas} de {metas.length}</b> metas cumpridas</p>
      </div>
      <ul className="lista-check mini">
        {metas.filter((m) => !m.concluida).slice(0, 4).map((m) => (
          <li key={m.id}>☐ {m.titulo}</li>
        ))}
      </ul>
      <Link href="/metas" className="link-simples">{metas.length ? "ver todas →" : "escrever metas do mês →"}</Link>
    </div>
  );
}
