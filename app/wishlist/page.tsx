import type { Metadata } from "next";
import EmBreve from "@/components/EmBreve";

export const metadata: Metadata = { title: "Wishlist" };

export default function Pagina() {
  return (
    <EmBreve
      titulo="Wishlist"
      icone=""
      vibe="oncinha"
      etapa="próxima etapa"
      cor="oncinha"
      vaiTer={[
        "Itens com foto, preço, link e prioridade",
        "Separado por categoria",
        "Botão de COMPREI!",
      ]}
    />
  );
}
