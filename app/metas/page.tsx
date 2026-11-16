import type { Metadata } from "next";
import EmBreve from "@/components/EmBreve";

export const metadata: Metadata = { title: "Metas" };

export default function Pagina() {
  return (
    <EmBreve
      titulo="Metas"
      icone="⭐"
      vibe="winx"
      etapa="etapa 2"
      cor="verde"
      privada
      vaiTer={[
        "Metas do mês e do ano, separadas por área",
        "Tarefas e compromissos do dia a dia",
        "Resumo no fim do mês: cumpri 7 de 10 ✨",
      ]}
    />
  );
}
