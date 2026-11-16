import type { Metadata, Viewport } from "next";
import "./globals.css";
import Efeitos from "@/components/Efeitos";
import TelaCarregando from "@/components/TelaCarregando";
import Nav from "@/components/Nav";
import Player from "@/components/Player";
import FundoDecorado from "@/components/Adesivos";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: { default: SITE.nome, template: `%s ✦ ${SITE.curto}` },
  description: "O QG da Alana: ideias, conteúdos, músicas, astrologia e muito glitter.",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#59c8ff",
  width: "device-width",
  initialScale: 1,
};

// evita "piscar" claro quando o modo noturno tá ligado
const temaInicial = `try{if(localStorage.getItem('bts:tema')==='noite')document.documentElement.dataset.tema='noite'}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: temaInicial }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Pacifico&family=VT323&family=Playfair+Display:ital,wght@0,700;1,600&display=swap"
        />
      </head>
      <body>
        <Efeitos>
          <TelaCarregando />
          <FundoDecorado />
          <Nav />
          <main className="conteudo">{children}</main>
          <footer className="rodape">
            feito com 💖, glitter e internet discada ✦ {SITE.curto} © {new Date().getFullYear()}
          </footer>
          <Player />
        </Efeitos>
      </body>
    </html>
  );
}
