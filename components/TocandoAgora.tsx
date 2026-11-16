"use client";

import { useEffect, useState } from "react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";

// Janelinha "tocando agora" da página inicial. Conversa com o MP3 do canto.
export default function TocandoAgora() {
  const [titulo, setTitulo] = useState("aperta o play ✦");
  const [tocando, setTocando] = useState(false);

  useEffect(() => {
    const ouvir = (e: Event) => {
      const d = (e as CustomEvent<{ titulo?: string; tocando?: boolean }>).detail;
      if (d.titulo) setTitulo(d.titulo);
      if (typeof d.tocando === "boolean") setTocando(d.tocando);
    };
    window.addEventListener("bts:mp3-estado", ouvir);
    window.dispatchEvent(new CustomEvent("bts:mp3", { detail: "estado" }));
    return () => window.removeEventListener("bts:mp3-estado", ouvir);
  }, []);

  const mandar = (acao: string) => window.dispatchEvent(new CustomEvent("bts:mp3", { detail: acao }));

  return (
    <div className="tocando-agora">
      <div className="tocando-info">
        <div>
          <p className="tocando-titulo">{titulo}</p>
          <p className="tocando-sub">playlist da alana</p>
        </div>
        <span className={`mini-eq ${tocando ? "ativo" : ""}`} aria-hidden>
          {Array.from({ length: 7 }, (_, i) => <i key={i} style={{ animationDelay: `${i * 90}ms` }} />)}
        </span>
      </div>
      <div className="tocando-barra"><span className={tocando ? "andando" : ""} /></div>
      <div className="tocando-botoes">
        <button onClick={() => mandar("voltar")} aria-label="Voltar"><SkipBack size={15} /></button>
        <button onClick={() => mandar("play")} aria-label={tocando ? "Pausar" : "Tocar"}>{tocando ? <Pause size={15} /> : <Play size={15} />}</button>
        <button onClick={() => mandar("passar")} aria-label="Passar"><SkipForward size={15} /></button>
      </div>
    </div>
  );
}
