import type { Metadata } from "next";
import Album from "@/components/Album";

export const metadata: Metadata = { title: "Álbum" };

export default function Pagina() {
  return (
    <div className="pagina pagina-album">
      <Album />
    </div>
  );
}
