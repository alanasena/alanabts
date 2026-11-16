"use client";

import { useEffect, useState } from "react";
import { fraseDoDia } from "@/config/frases";
import { faseDaLua } from "@/lib/lua";

// Calculado no navegador pra usar a data/hora certinha de quem abre
export function FraseDoDia() {
  const [frase, setFrase] = useState("");
  useEffect(() => setFrase(fraseDoDia()), []);
  return <blockquote className="frase">{frase || "…"}</blockquote>;
}

export function LuaDeHoje() {
  const [lua, setLua] = useState<ReturnType<typeof faseDaLua> | null>(null);
  useEffect(() => setLua(faseDaLua()), []);
  if (!lua) return <div className="lua">…</div>;
  return (
    <div className="lua">
      <DesenhoLua fracao={lua.fracao} />
      <div>
        <p className="lua-nome">{lua.nome}</p>
        <p className="lua-luz">{lua.iluminacao}% iluminada</p>
        <p className="lua-dica">{lua.dica}</p>
      </div>
    </div>
  );
}

// Lua desenhada: parte iluminada muda com a fase
function DesenhoLua({ fracao }: { fracao: number }) {
  const r = 26;
  const crescente = fracao < 0.5;
  const k = Math.cos(2 * Math.PI * fracao); // 1 = nova, -1 = cheia
  const rx = Math.abs(k) * r;
  const ladoLuz = crescente ? 1 : 0;
  const curva = k > 0 ? (crescente ? 0 : 1) : crescente ? 1 : 0;
  const d = `M30 4 A${r} ${r} 0 0 ${ladoLuz} 30 56 A${rx} ${r} 0 0 ${curva} 30 4Z`;
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" className="lua-desenho" aria-hidden>
      <circle cx="30" cy="30" r={r} fill="#2a2023" />
      <path d={d} fill="#f7efe2" />
      <circle cx="30" cy="30" r={r} fill="none" stroke="#141010" strokeWidth="2" />
    </svg>
  );
}
