import type { Metadata } from "next";
import EmBreve from "@/components/EmBreve";

export const metadata: Metadata = { title: "Favoritos" };

export default function Pagina() {
  return (
    <EmBreve
      titulo="Favoritos"
      icone=""
      vibe="tv"
      etapa="próxima etapa"
      cor="lilas"
      vaiTer={[
        "Suas séries e filmes favoritos (Desperate Housewives, Sex and the City...)",
      ]}
    />
  );
}
