import type { Metadata } from "next";
import Bonequinha from "@/components/Bonequinha";

export const metadata: Metadata = { title: "Bonequinha" };

export default function Pagina() {
  return (
    <div className="pagina pagina-bq">
      <Bonequinha />
    </div>
  );
}
