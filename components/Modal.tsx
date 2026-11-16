"use client";

import { useEffect } from "react";
import Janela, { type CorJanela } from "./Janela";

export default function Modal({
  titulo,
  icone,
  cor = "rosa",
  aoFechar,
  children,
}: {
  titulo: string;
  icone?: string;
  cor?: CorJanela;
  aoFechar: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && aoFechar();
    window.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [aoFechar]);

  return (
    <div className="modal-fundo" onMouseDown={(e) => e.target === e.currentTarget && aoFechar()}>
      <div className="modal-caixa" role="dialog" aria-modal="true" aria-label={titulo}>
        <button className="modal-x" onClick={aoFechar} aria-label="Fechar">×</button>
        <Janela titulo={titulo} icone={icone} cor={cor}>
          {children}
        </Janela>
      </div>
    </div>
  );
}
