import type { Metadata } from "next";
import EmBreve from "@/components/EmBreve";

export const metadata: Metadata = { title: "Bonequinha" };

export default function Pagina() {
  return (
    <EmBreve
      titulo="Bonequinha"
      icone=""
      vibe="stardoll"
      etapa="etapa da bonequinha"
      cor="rosa"
      vaiTer={[
        "A Alana em versão bonequinha, estilo Stardoll/Barbie/Polly",
        "Roupas, sapatos, acessórios e cabelos pra trocar",
        "Qualquer pessoa pode brincar e baixar a foto do look",
      ]}
    />
  );
}
