import type { Metadata } from "next";
import { Suspense } from "react";
import Blog from "@/components/Blog";

export const metadata: Metadata = { title: "Blog" };

export default function Pagina() {
  return (
    <div className="pagina pagina-blog">
      <Suspense fallback={<p className="spill-aviso">carregando...</p>}>
        <Blog />
      </Suspense>
    </div>
  );
}
