import type { Metadata } from "next";
import EmBreve from "@/components/EmBreve";

export const metadata: Metadata = { title: "Roletas" };

export default function Pagina() {
  return (
    <EmBreve
      titulo="Roletas"
      icone="🎡"
      vibe="tv"
      etapa="etapa das roletas"
      cor="prata"
      vaiTer={[
        "Roleta de temas do repertório cultural: 10 min pra pesquisar, 1 min pra explicar",
        "Histórico dos temas que já caíram, com suas anotações",
        "Roleta do top 250 do IMDb (sem terror e sem filme impossível de achar)",
        "Diário de filmes estilo Letterboxd: assisti, nota e o que achei",
      ]}
    />
  );
}
