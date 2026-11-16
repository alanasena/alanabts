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
      <span className="lua-emoji" aria-hidden>{lua.emoji}</span>
      <div>
        <p className="lua-nome">{lua.nome}</p>
        <p className="lua-luz">{lua.iluminacao}% iluminada</p>
        <p className="lua-dica">{lua.dica}</p>
      </div>
    </div>
  );
}
