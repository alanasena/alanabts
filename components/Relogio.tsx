"use client";

import { useEffect, useState } from "react";

function saudacao(h: number) {
  if (h < 5) return "Boa madrugada";
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export default function Relogio() {
  const [agora, setAgora] = useState<Date | null>(null);
  useEffect(() => {
    setAgora(new Date());
    const t = setInterval(() => setAgora(new Date()), 15000);
    return () => clearInterval(t);
  }, []);

  if (!agora) return <div className="relogio">&nbsp;</div>;

  const data = agora.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const hora = agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="relogio">
      <p className="saudacao">{saudacao(agora.getHours())}!</p>
      <p className="data">{data}</p>
      <p className="hora pixel">{hora}</p>
    </div>
  );
}
