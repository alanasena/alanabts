"use client";

import { useEffect, useState } from "react";

// Abertura de computador antigo: BIOS → logo carregando → discando a internet.
// Aparece uma vez por visita e dá pra pular.

const LINHAS_BIOS = [
  "ALANA-BTS BIOS v2.0.04  (C) 2004 Behind the Scenes Inc.",
  "Processador: Diva Pentium IV  2.4 GHz",
  "Memoria: 512 MB ............................ OK",
  "Detectando glitter ......................... OK",
  "Carregando oncinha.sys ..................... OK",
  "Carregando divas_do_pop.dll ................ OK",
  "Iniciando o QG da Alana...",
];

type Fase = "bios" | "logo" | "discando" | "fim";

export default function TelaCarregando() {
  const [fase, setFase] = useState<Fase>("bios");
  const [linhas, setLinhas] = useState(0);
  const [visivel, setVisivel] = useState(true);
  const [kbps, setKbps] = useState(0);

  useEffect(() => {
    let jaViu = false;
    try {
      jaViu = sessionStorage.getItem("bts:carregou") === "1";
      sessionStorage.setItem("bts:carregou", "1");
    } catch {}
    if (jaViu || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisivel(false);
      return;
    }
    const t: ReturnType<typeof setTimeout>[] = [];
    LINHAS_BIOS.forEach((_, i) => t.push(setTimeout(() => setLinhas(i + 1), 120 + i * 150)));
    t.push(setTimeout(() => setFase("logo"), 1350));
    t.push(setTimeout(() => setFase("discando"), 2900));
    for (let i = 1; i <= 8; i++) t.push(setTimeout(() => setKbps(Math.min(56, i * 7)), 2900 + i * 110));
    t.push(setTimeout(() => setFase("fim"), 4000));
    t.push(setTimeout(() => setVisivel(false), 4450));
    return () => t.forEach(clearTimeout);
  }, []);

  if (!visivel) return null;

  const pular = () => {
    setFase("fim");
    setTimeout(() => setVisivel(false), 300);
  };

  return (
    <div className={`boot ${fase === "fim" ? "saindo" : ""}`} aria-hidden>
      <div className="crt" />

      {fase === "bios" && (
        <pre className="boot-bios">
          {LINHAS_BIOS.slice(0, linhas).join("\n")}
          <span className="cursor-piscando">_</span>
        </pre>
      )}

      {fase === "logo" && (
        <div className="boot-logo">
          <span className="boot-alana">alana</span>
          <span className="boot-xp">behind the scenes <i>xp</i></span>
          <div className="boot-barra">
            <div className="boot-blocos"><i /><i /><i /></div>
          </div>
          <span className="boot-copy">Copyright © 2004 Alana BTS. Todos os direitos (e glitters) reservados.</span>
        </div>
      )}

      {(fase === "discando" || fase === "fim") && (
        <div className="boot-dialogo">
          <div className="boot-dialogo-titulo">
            <span>Conectar a internet</span>
            <span className="x">×</span>
          </div>
          <div className="boot-dialogo-corpo">
            <div className="boot-icones">
              <span className="pc" />
              <span className="pontinhos"><i /><i /><i /><i /><i /></span>
              <span className="globo" />
            </div>
            <p>Discando para alanabts.vercel.app...</p>
            <p className="vel">Conectado a {kbps} kbps</p>
            <div className="boot-progresso"><span style={{ width: `${(kbps / 56) * 100}%` }} /></div>
          </div>
        </div>
      )}

      <button className="boot-pular" onClick={pular}>pular ›</button>
    </div>
  );
}
