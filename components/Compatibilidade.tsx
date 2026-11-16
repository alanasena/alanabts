"use client";

import { useState } from "react";
import { SIGNOS, SIMBOLOS } from "@/lib/astro";
import { COMPATIBILIDADE } from "@/config/astrologia";

export default function Compatibilidade() {
  const [signo, setSigno] = useState(3);
  const c = COMPATIBILIDADE[signo];
  return (
    <div className="compat">
      <div className="compat-signos">
        {SIGNOS.map((s, i) => (
          <button key={s} className={i === signo ? "ativo" : ""} onClick={() => setSigno(i)} title={s}>
            {SIMBOLOS[i]}
          </button>
        ))}
      </div>
      <p className="compat-par">{"♏\uFE0E"} escorpião + {SIMBOLOS[signo]} {SIGNOS[signo].toLowerCase()}</p>
      <div className="progresso-barra"><span style={{ width: `${c.nota}%` }} /></div>
      <p className="compat-nota">{c.nota}% de compatibilidade</p>
      <p className="compat-texto">{c.texto}</p>
    </div>
  );
}
