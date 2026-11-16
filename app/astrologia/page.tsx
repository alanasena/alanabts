import type { Metadata } from "next";
import EmBreve from "@/components/EmBreve";

export const metadata: Metadata = { title: "Astrologia" };

export default function Pagina() {
  return (
    <EmBreve
      titulo="Astrologia"
      icone=""
      vibe="h2o"
      etapa="etapa da astrologia"
      cor="azul"
      vaiTer={[
        "Horóscopo do dia de Escorpião, completinho mas rápido de ler",
        "Seu mapa astral inteiro, com a roda desenhada e o que cada planeta significa",
        "Lua de hoje, previsão do mês e compatibilidade com outros signos",
        "Tudo sobre Escorpião + podcasts e conteúdos de astrologia",
      ]}
    />
  );
}
