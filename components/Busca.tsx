"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { ABAS } from "@/config/site";

const tirarAcento = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// Busca do topo: procura entre as abas do site
export default function Busca() {
  const [q, setQ] = useState("");
  const router = useRouter();
  const achadas = q ? ABAS.filter((a) => tirarAcento(a.nome).includes(tirarAcento(q))) : [];

  return (
    <form
      className="busca"
      onSubmit={(e) => {
        e.preventDefault();
        if (achadas[0]) {
          router.push(achadas[0].href);
          setQ("");
        }
      }}
    >
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="procurar no site..." aria-label="Procurar no site" />
      <button aria-label="Procurar"><Search size={16} /></button>
      {achadas.length > 0 && (
        <ul className="busca-resultados">
          {achadas.slice(0, 5).map((a) => (
            <li key={a.href}>
              <button type="button" onClick={() => { router.push(a.href); setQ(""); }}>{a.nome.toLowerCase()}</button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
