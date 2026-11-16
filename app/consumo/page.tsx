import type { Metadata } from "next";
import Consumo from "@/components/Consumo";

export const metadata: Metadata = { title: "Tô ouvindo & vendo" };

export default function Pagina() {
  return (
    <div className="pagina pagina-aero">
      <Consumo />
    </div>
  );
}
