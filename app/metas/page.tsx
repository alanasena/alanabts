import type { Metadata } from "next";
import { Trancado } from "@/components/Sessao";
import PainelMetas from "@/components/PainelMetas";

export const metadata: Metadata = { title: "Metas" };

export default function Pagina() {
  return (
    <div className="pagina vibe-winx pagina-larga">
      <h1 className="titulo-pagina">Metas <span className="selo-privado">só a Alana</span></h1>
      <Trancado>
        <PainelMetas />
      </Trancado>
    </div>
  );
}
