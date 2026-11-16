import type { Metadata } from "next";
import Wishlist from "@/components/Wishlist";

export const metadata: Metadata = { title: "Wishlist" };

export default function Pagina() {
  return (
    <div className="pagina pagina-wish">
      <Wishlist />
    </div>
  );
}
