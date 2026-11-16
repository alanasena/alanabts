import type { Metadata } from "next";
import EmBreve from "@/components/EmBreve";

export const metadata: Metadata = { title: "Tô ouvindo & vendo" };

export default function Pagina() {
  return (
    <EmBreve
      titulo="Tô ouvindo & vendo"
      icone=""
      vibe="y2k"
      etapa="próxima etapa"
      cor="prata"
      vaiTer={[
        "Músicas e playlist do momento",
        "O que você tá assistindo e lendo agora (séries, filmes, Corrida das Blogueiras...)",
      ]}
    />
  );
}
