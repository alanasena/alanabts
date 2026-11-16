"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ABAS } from "@/config/site";
import Icone from "./Icone";
import { Palette } from "lucide-react";
import { useEfeitos } from "./Efeitos";

// Barra de tarefas estilo Windows: botão Iniciar, aba aberta e relógio
export default function BarraWindows() {
  const rota = usePathname();
  const { visual, trocarVisual } = useEfeitos();
  const [aberto, setAberto] = useState(false);
  const [hora, setHora] = useState("");
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tic = () => setHora(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
    tic();
    const t = setInterval(tic, 15000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => setAberto(false), [rota]);

  useEffect(() => {
    if (!aberto) return;
    const fora = (e: MouseEvent) => {
      if (menu.current && !menu.current.contains(e.target as Node)) setAberto(false);
    };
    document.addEventListener("mousedown", fora);
    return () => document.removeEventListener("mousedown", fora);
  }, [aberto]);

  const atual = ABAS.find((a) => (a.href === "/" ? rota === "/" : rota.startsWith(a.href)));

  return (
    <div className="taskbar" ref={menu}>
      {aberto && (
        <nav className="menu-iniciar" aria-label="Menu iniciar">
          <div className="menu-iniciar-topo">
            <span className="menu-avatar" aria-hidden>A</span>
            <span>alana</span>
          </div>
          <div className="menu-iniciar-lista">
            {ABAS.map((a) => (
              <Link key={a.href} href={a.href} className="menu-iniciar-item">
                <Icone nome={a.icone} tamanho={18} />
                <span>{a.nome}</span>
                {a.privada && <Icone nome="cadeado" tamanho={12} className="cadeado" />}
              </Link>
            ))}
          </div>
        </nav>
      )}
      <button className={`iniciar ${aberto ? "ativo" : ""}`} onClick={() => setAberto((a) => !a)}>
        <span className="iniciar-logo" aria-hidden />
        iniciar
      </button>
      {atual && (
        <span className="taskbar-aba">
          <Icone nome={atual.icone} tamanho={14} />
          {atual.nome.toLowerCase().replace(/\s/g, "_")}.html
        </span>
      )}
      <span className="taskbar-bandeja">
        <button className="trocar-visual" onClick={trocarVisual} title="Trocar o visual do site">
          <Palette size={14} /> {visual === "oncinha" ? "visual oncinha" : "visual clarinho"}
        </button>
        <span className="taskbar-hora">{hora}</span>
      </span>
    </div>
  );
}
