import type { Metadata } from "next";
import EmBreve from "@/components/EmBreve";

export const metadata: Metadata = { title: "Calendário de posts" };

export default function Pagina() {
  return (
    <EmBreve
      titulo="Calendário de posts"
      icone="📅"
      vibe="winx"
      etapa="etapa 2"
      cor="rosa"
      privada
      vaiTer={[
        "Visão por semana (e por mês, se quiser)",
        "O que postar em cada dia",
        "Botão de ativar contador de dias até um evento",
      ]}
    />
  );
}
