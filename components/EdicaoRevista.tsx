"use client";

import { useEffect, useState } from "react";

// "Edição Nº 320 · novembro 2026" — muda sozinho todo dia
export default function EdicaoRevista() {
  const [texto, setTexto] = useState("edição especial");
  useEffect(() => {
    const d = new Date();
    const n = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000);
    const mes = d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
    setTexto(`edição nº ${n} · ${mes}`);
  }, []);
  return (
    <>
      <span>{texto}</span>
      <span className="capa-faixa">a revista oficial da sua it girl favorita</span>
    </>
  );
}
