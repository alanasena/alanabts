import type { Metadata } from "next";
import { Trancado } from "@/components/Sessao";
import QuadroIdeias from "@/components/QuadroIdeias";

export const metadata: Metadata = { title: "Ideias de conteúdo" };

export default function Pagina() {
  return (
    <div className="pagina vibe-winx pagina-larga">
      <h1 className="titulo-pagina">Ideias de conteúdo <span className="selo-privado">só a Alana</span></h1>
      <Trancado>
        <QuadroIdeias />
      </Trancado>
    </div>
  );
}
