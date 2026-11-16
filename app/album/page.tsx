import type { Metadata } from "next";
import EmBreve from "@/components/EmBreve";

export const metadata: Metadata = { title: "Álbum" };

export default function Pagina() {
  return (
    <EmBreve
      titulo="Álbum"
      icone=""
      vibe="y2k"
      etapa="próxima etapa"
      cor="lilas"
      vaiTer={[
        "Suas fotos com família e amigos, estilo polaroid",
        "Você sobe as fotos pelo próprio site, do celular ou do PC",
      ]}
    />
  );
}
