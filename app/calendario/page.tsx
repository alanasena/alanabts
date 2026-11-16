import type { Metadata } from "next";
import { Trancado } from "@/components/Sessao";
import Calendario from "@/components/Calendario";

export const metadata: Metadata = { title: "Calendário de posts" };

export default function Pagina() {
  return (
    <div className="pagina vibe-winx pagina-larga">
      <h1 className="titulo-pagina">Calendário <span className="selo-privado">só a Alana</span></h1>
      <Trancado>
        <Calendario />
      </Trancado>
    </div>
  );
}
