import type { Metadata, Viewport } from "next";
import "@fontsource/bodoni-moda/800-italic.css";
import "@fontsource/bodoni-moda/700.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/700-italic.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/vt323/400.css";
import "@fontsource/rubik/800-italic.css";
import "@fontsource/rubik/900-italic.css";
import "@fontsource/space-mono/400.css";
import "@fontsource/space-mono/700.css";
import "./globals.css";
import Efeitos from "@/components/Efeitos";
import Sessao from "@/components/Sessao";
import TelaCarregando from "@/components/TelaCarregando";
import Nav from "@/components/Nav";
import Player from "@/components/Player";
import BarraWindows from "@/components/BarraWindows";
import FundoDecorado from "@/components/Adesivos";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: { default: SITE.nome, template: `%s ✦ ${SITE.curto}` },
  description: "O QG da Alana: ideias, conteúdos, músicas, astrologia e muito glitter.",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#f26aa6",
  width: "device-width",
  initialScale: 1,
};

// evita "piscar" claro quando o modo noturno tá ligado
const temaInicial = `try{var d=document.documentElement;if(localStorage.getItem('bts:tema')==='noite')d.dataset.tema='noite';var v=localStorage.getItem('bts:visual');if(v)d.dataset.visual=v}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-visual={SITE.visual} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: temaInicial }} />
      </head>
      <body>
        <Efeitos>
          <Sessao>
          <TelaCarregando />
          <FundoDecorado />
          <Nav />
          <main className="conteudo">{children}</main>
          <Player />
            <BarraWindows />
          </Sessao>
        </Efeitos>
      </body>
    </html>
  );
}
