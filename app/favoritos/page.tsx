import type { Metadata } from "next";
import Favoritos from "@/components/Favoritos";

export const metadata: Metadata = { title: "Favoritos do mês" };

export default function Pagina() {
  return (
    <div className="pagina pagina-atv">
      <Favoritos />
    </div>
  );
}
