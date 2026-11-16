"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, BellOff, KeyRound, LogOut, Moon, Sun } from "lucide-react";
import { ABAS } from "@/config/site";
import { useEfeitos } from "./Efeitos";
import { useSessao } from "./Sessao";
import Icone from "./Icone";
import Faixa from "./Faixa";
import Busca from "./Busca";

export default function Nav() {
  const rota = usePathname();
  const { noite, alternarNoite, sons, alternarSons } = useEfeitos();
  const { usuaria, sair } = useSessao();

  return (
    <header className="topo">
      <Faixa />
      <div className="topo-linha">
        <Link href="/" className="topo-logo" aria-label="Início">
          <span className="logo-alana">alana</span>
          <span className="logo-bts">behind the scenes</span>
        </Link>

        <nav className="menu" aria-label="Abas do site">
          {ABAS.map((a) => {
            const ativa = a.href === "/" ? rota === "/" : rota.startsWith(a.href);
            return (
              <Link key={a.href} href={a.href} className={`menu-item ${ativa ? "ativa" : ""}`}>
                <span className="menu-icone">
                  <Icone nome={a.icone} tamanho={19} traco={1.7} />
                  {a.privada && <Icone nome="cadeado" tamanho={10} className="menu-cadeado" />}
                </span>
                <span className="menu-nome">{a.nome.toLowerCase()}</span>
              </Link>
            );
          })}
        </nav>

        <Busca />
        <div className="topo-botoes">
          {usuaria ? (
            <button className="bolinha" onClick={sair} title="Sair da conta"><LogOut size={16} /></button>
          ) : (
            <Link href="/entrar" className="bolinha" title="Entrar (só a Alana)"><KeyRound size={16} /></Link>
          )}
          <button className="bolinha" onClick={alternarSons} title={sons ? "Desligar sons de clique" : "Ligar sons de clique"}>
            {sons ? <Bell size={16} /> : <BellOff size={16} />}
          </button>
          <button className="bolinha" onClick={alternarNoite} title={noite ? "Modo dia" : "Modo noturno"}>
            {noite ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}
