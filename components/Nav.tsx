"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ABAS } from "@/config/site";
import { useEfeitos } from "./Efeitos";

export default function Nav() {
  const rota = usePathname();
  const { noite, alternarNoite, sons, alternarSons } = useEfeitos();

  return (
    <header className="topo">
      <div className="topo-linha">
        <Link href="/" className="topo-logo" aria-label="Início">
          <span className="logo-alana">Alana</span>
          <span className="logo-bts">BTS</span>
          <span className="logo-brilho">✦</span>
        </Link>
        <div className="topo-botoes">
          <button className="bolinha" onClick={alternarSons} title={sons ? "Desligar sons de clique" : "Ligar sons de clique"}>
            {sons ? "🔔" : "🔕"}
          </button>
          <button className="bolinha" onClick={alternarNoite} title={noite ? "Modo dia" : "Modo noturno"}>
            {noite ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
      <nav className="menu" aria-label="Abas do site">
        {ABAS.map((a) => {
          const ativa = a.href === "/" ? rota === "/" : rota.startsWith(a.href);
          return (
            <Link key={a.href} href={a.href} className={`pilula ${ativa ? "ativa" : ""}`}>
              <span aria-hidden>{a.icone}</span> {a.nome}
              {a.privada && <span className="cadeado" title="Só a Alana vê">🔒</span>}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
