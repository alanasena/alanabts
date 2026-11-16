import type { Metadata } from "next";
import EmBreve from "@/components/EmBreve";

export const metadata: Metadata = { title: "Blog" };

export default function Pagina() {
  return (
    <EmBreve
      titulo="Blog"
      icone="✍️"
      vibe="revista"
      etapa="próxima etapa"
      cor="rosa"
      vaiTer={[
        "Você escreve e publica na hora, direto pelo site",
        "Cara de coluna de revista dos anos 2000",
      ]}
    />
  );
}
