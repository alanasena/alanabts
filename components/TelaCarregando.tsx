"use client";

import { useEffect, useState } from "react";

const MENSAGENS = [
  "passando gloss...",
  "alinhando os astros...",
  "baixando glitter (99 MB)...",
  "chamando as divas...",
  "conectando na internet discada...",
  "escolhendo o look do dia...",
  "carregando o QG...",
];

// Aparece uma vez por visita (some sozinha em ~2,5s)
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
    const fim = setTimeout(() => setSaindo(true), 2600);
    const some = setTimeout(() => setVisivel(false), 3100);
    return () => {
      clearInterval(troca);
      clearTimeout(fim);
      clearTimeout(some);
    };
  }, []);

  if (!visivel) return null;

  return (
    <div className={`carregando ${saindo ? "saindo" : ""}`} aria-hidden>
      <div className="carregando-caixa">
        <div className="carregando-logo">
          <span className="logo-alana">Alana</span>
          <span className="logo-bts">Behind the Scenes</span>
        </div>
        <div className="carregando-barra">
          <div className="carregando-blocos">
            <i /><i /><i />
          </div>
        </div>
        <p className="carregando-msg">{MENSAGENS[msg]}</p>
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
    </div>
  );
}
