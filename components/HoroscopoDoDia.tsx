"use client";

import { useEffect, useState } from "react";
import { Briefcase, Heart, Sparkles } from "lucide-react";
import { posicoes, SIGNOS, SIMBOLOS } from "@/lib/astro";
import { faseDaLua } from "@/lib/lua";
import { ASPECTOS_LUA_SOL, CORES_SORTE, HOROSCOPO_CASAS, LUA_NO_SIGNO, MES_CASAS, RETROGRADOS } from "@/config/astrologia";

const ESCORPIAO = 7;
const SOL_NATAL = 227.8; // Escorpião 17°47'

function aspecto(a: number, b: number): string | null {
  const d = Math.abs(((a - b + 540) % 360) - 180);
  const tipos: [string, number][] = [["conjuncao", 0], ["sextil", 60], ["quadratura", 90], ["trigono", 120], ["oposicao", 180]];
  const achou = tipos.find(([, g]) => Math.abs(d - g) <= 6);
  return achou ? achou[0] : null;
}

type Dados = ReturnType<typeof calcular>;
function calcular(agora: Date) {
  const p = posicoes(agora);
  const lua = p.find((x) => x.id === "Moon")!;
  const sol = p.find((x) => x.id === "Sun")!;
  const casaLua = (lua.signo - ESCORPIAO + 12) % 12;
  const casaSol = (sol.signo - ESCORPIAO + 12) % 12;
  const dia = Math.floor(agora.getTime() / 86400000);
  return {
    data: agora.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" }),
    mes: agora.toLocaleDateString("pt-BR", { month: "long" }),
    lua,
    fase: faseDaLua(agora),
    texto: HOROSCOPO_CASAS[casaLua],
    luaSigno: LUA_NO_SIGNO[lua.signo],
    aspecto: aspecto(lua.lon, SOL_NATAL),
    retros: p.filter((x) => x.retro && RETROGRADOS[x.id]).map((x) => RETROGRADOS[x.id]),
    mesTexto: MES_CASAS[casaSol],
    cor: CORES_SORTE[(dia * 7) % CORES_SORTE.length],
    numero: ((dia * 13) % 99) + 1,
    ceu: p,
  };
}

export function HoroscopoDoDia() {
  const [d, setD] = useState<Dados | null>(null);
  useEffect(() => setD(calcular(new Date())), []);
  if (!d) return <p className="carregando-dados">lendo os astros...</p>;

  return (
    <div className="horoscopo">
      <p className="horoscopo-data">{d.data} · lua em {SIGNOS[d.lua.signo].toLowerCase()} {SIMBOLOS[d.lua.signo]} · {d.fase.nome.toLowerCase()}</p>
      <p className="horoscopo-clima">{d.texto.clima}</p>
      <ul className="horoscopo-areas">
        <li><Heart size={16} /><b>amor</b><span>{d.texto.amor}</span></li>
        <li><Briefcase size={16} /><b>trabalho</b><span>{d.texto.trabalho}</span></li>
        <li><Sparkles size={16} /><b>bem-estar</b><span>{d.texto.bemestar}</span></li>
      </ul>
      {d.aspecto && <p className="horoscopo-extra">✦ {ASPECTOS_LUA_SOL[d.aspecto]}</p>}
      {d.retros.map((r) => <p key={r} className="horoscopo-extra">⚠ {r}</p>)}
      <div className="sorte">
        <span>cor do dia: <b>{d.cor}</b></span>
        <span>número da sorte: <b>{d.numero}</b></span>
      </div>
    </div>
  );
}

export function PrevisaoMes() {
  const [d, setD] = useState<Dados | null>(null);
  useEffect(() => setD(calcular(new Date())), []);
  if (!d) return null;
  return (
    <div>
      <p className="horoscopo-data">previsão de {d.mes}</p>
      <p className="horoscopo-clima">{d.mesTexto}</p>
    </div>
  );
}

export function CeuDeHoje() {
  const [d, setD] = useState<Dados | null>(null);
  useEffect(() => setD(calcular(new Date())), []);
  if (!d) return null;
  return (
    <>
      <p className="horoscopo-extra">{d.luaSigno}</p>
      <ul className="lista-ceu">
        {d.ceu.map((p) => (
          <li key={p.id}>
            <span className="simbolo">{p.simbolo}</span>
            <span>{p.nome}</span>
            <span className="onde">{SIMBOLOS[p.signo]} {SIGNOS[p.signo]}{p.retro && " ℞"}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
