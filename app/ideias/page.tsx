import type { Metadata } from "next";
import EmBreve from "@/components/EmBreve";

export const metadata: Metadata = { title: "Ideias de conteúdo" };

export default function Pagina() {
  return (
    <EmBreve
      titulo="Ideias de conteúdo"
      icone="💡"
      vibe="winx"
      etapa="etapa 2"
      cor="lilas"
      privada
      vaiTer={[
        "Quadro estilo ClickUp: Ideia → Roteiro → Gravando → Editando → Postado",
        "Cartões com título, descrição, formato, tema, link de referência e imagens",
        "Arrastar a ideia pro calendário",
      ]}
    />
  );
}
