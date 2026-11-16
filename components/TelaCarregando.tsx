"use client";

import { useEffect, useState } from "react";

const MENSAGENS = [
  "passando gloss...",
  "alinhando os astros...",
  "baixando glitter (99 MB)...",
  "chamando as divas...",
  "conectando na internet discada...",
  "escolhendo a calça de cintura baixa...",
  "abrindo o QG...",
];

// Celular flip carregando. Aparece uma vez por visita.
export default function TelaCarregando() {
  const [visivel, setVisivel] = useState(true);
  const [saindo, setSaindo] = useState(false);
  const [msg, setMsg] = useState(0);

  useEffect(() => {
    let jaViu = false;
    try {
      jaViu = sessionStorage.getItem("bts:carregou") === "1";
      sessionStorage.setItem("bts:carregou", "1");
    } catch {}
    if (jaViu) {
      setVisivel(false);
      return;
    }
    const troca = setInterval(() => setMsg((m) => (m + 1) % MENSAGENS.length), 520);
    const fim = setTimeout(() => setSaindo(true), 2700);
    const some = setTimeout(() => setVisivel(false), 3200);
    return () => {
      clearInterval(troca);
      clearTimeout(fim);
      clearTimeout(some);
    };
  }, []);

  if (!visivel) return null;

  return (
    <div className={`carregando ${saindo ? "saindo" : ""}`} aria-hidden>
      <div className="flip">
        <div className="flip-tampa">
          <div className="flip-tela">
            <span className="flip-sinal">▂▄▆█ 2000</span>
            <span className="flip-logo">Alana</span>
            <span className="flip-bts">BTS</span>
            <div className="carregando-barra">
              <div className="carregando-blocos"><i /><i /><i /></div>
            </div>
            <p className="carregando-msg">{MENSAGENS[msg]}</p>
          </div>
        </div>
        <div className="flip-dobra" />
        <div className="flip-teclado">
          <div className="flip-direcional" />
          <div className="flip-teclas">
            {"123456789*0#".split("").map((t) => (
              <i key={t}>{t}</i>
            ))}
          </div>
        </div>
      </div>
      <button
        className="carregando-pular"
        onClick={() => {
          setSaindo(true);
          setTimeout(() => setVisivel(false), 300);
        }}
      >
        pular ›
      </button>
    </div>
  );
}
