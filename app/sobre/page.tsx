import type { Metadata } from "next";
import EmBreve from "@/components/EmBreve";

export const metadata: Metadata = { title: "Sobre mim" };

export default function Pagina() {
  return (
    <EmBreve
      titulo="Sobre mim"
      icone="💋"
      vibe="revista"
      etapa="próxima etapa"
      cor="rosa"
      vaiTer={[
        "Besteirinhas sobre a Alana em estilo coluna de revista",
        "Suas redes sociais (@alanabts_)",
      ]}
    />
  );
}
