import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Recorte from "@/components/Recorte";
import { SITE } from "@/config/site";
import { AMO, PAGINA, PERGUNTAS } from "@/config/sobre";

export const metadata: Metadata = { title: "Sobre mim" };

// adesivo solto na página: n = nome do arquivo em /public/revista/adesivos
type Pos = { t?: string; l?: string; r?: string; b?: string; w: number; g?: number; pc?: boolean };
function Ad({ n, p }: { n: string; p: Pos }) {
  const s: CSSProperties = { top: p.t, left: p.l, right: p.r, bottom: p.b, width: p.w, transform: `rotate(${p.g ?? 0}deg)` };
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={`ad ${p.pc ? "so-pc" : ""}`} src={`/revista/adesivos/${n}.webp`} alt="" style={s} />;
}

const ADESIVOS_P2: [string, Pos][] = [
  ["pretty-grl", { t: "150px", l: "34%", w: 200, g: -6, pc: true }],
  ["estrela-pink", { t: "60px", r: "36%", w: 70, g: 12, pc: true }],
  ["fun", { t: "960px", l: "36%", w: 120, g: 8, pc: true }],
  ["globo2", { t: "230px", l: "-30px", w: 120, g: 0, pc: true }],
  ["celular-flip", { t: "540px", l: "37%", w: 90, g: -14, pc: true }],
  ["gloss", { t: "660px", l: "40%", w: 60, g: 18, pc: true }],
  ["borboleta-roxa", { t: "330px", l: "36%", w: 110, g: -12, pc: true }],
  ["cerejas2", { b: "150px", l: "3%", w: 90, g: 10, pc: true }],
  ["sandalia", { t: "880px", r: "6px", w: 130, g: -8, pc: true }],
  ["estrela-neon", { t: "470px", r: "-26px", w: 100, g: -10 }],
  ["cool", { t: "1090px", l: "31%", w: 140, g: -8, pc: true }],
  ["tamagotchi", { b: "70px", l: "22%", w: 100, g: 12, pc: true }],
  ["bola8", { b: "300px", r: "40%", w: 70, g: 0, pc: true }],
  ["estrela-zebra", { b: "40px", r: "8px", w: 80, g: 14, pc: true }],
  ["ipod", { t: "760px", l: "38%", w: 90, g: 8, pc: true }],
  ["boca-rosa", { t: "28px", l: "52%", w: 110, g: -6, pc: true }],
];

const ADESIVOS_P3: [string, Pos][] = [
  ["vinil", { t: "-70px", r: "-70px", w: 190, g: 0 }],
  ["sunshine", { t: "40px", l: "40px", w: 170, g: -8, pc: true }],
  ["estrela-cromada", { t: "200px", l: "-24px", w: 100, g: -12 }],
  ["cd", { t: "560px", r: "-40px", w: 150, g: 0, pc: true }],
  ["style", { b: "30px", l: "16%", w: 120, g: 6, pc: true }],
  ["oculos-pink", { b: "180px", r: "50px", w: 140, g: -8, pc: true }],
  ["morangos", { t: "330px", r: "14px", w: 60, g: 14, pc: true }],
  ["swag", { b: "60px", r: "18%", w: 110, g: 6, pc: true }],
  ["fita-cassete", { t: "420px", l: "-30px", w: 140, g: -10, pc: true }],
  ["estrela-glitter", { t: "170px", r: "14px", w: 70, g: 14, pc: true }],
];

export default function Sobre() {
  return (
    <div className="pagina revista-pag">
      {/* ============ página 2 ============ */}
      <article className="folha">
        <span className="etiqueta">{PAGINA.etiqueta}</span>

        <header className="folha-topo">
          <h1 className="all-about">all about</h1>
          <div className="nome-recorte">
            <Recorte texto="alana" altura={120} semente={1} />
          </div>
          <div className="chamada-tags">
            <span>{PAGINA.chamada[0]}</span>
            <span>{PAGINA.chamada[1]}</span>
          </div>
        </header>

        <div className="folha-corpo">
          <figure className="foto-grande">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={SITE.foto} alt="Alana" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="fita fita-a" src="/revista/adesivos/fita-amarela.webp" alt="" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="fita fita-b" src="/revista/adesivos/fita-xadrez-azul.webp" alt="" />
          </figure>

          <div className="circulo-fav">
            <p className="fav-titulo">meus favoritos...</p>
            {PAGINA.favoritos.map(([t, txt], i) => (
              <div key={t} className={`fav ${i % 3 === 2 ? "faixa-branca" : ""}`}>
                <b>...{t}</b>
                <p>{txt}</p>
              </div>
            ))}
          </div>

          <div className="circulo-agora">
            <b>quem sou eu</b>
            <p>{PAGINA.agora}</p>
          </div>
        </div>

        <div className="bloco-gatos">
          <b>Thor &amp; Tiana</b>
          <div className="gatos-polaroids">
            <span>foto do Thor</span>
            <span>foto da Tiana</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="gato-ad" src="/revista/adesivos/gato-preto.webp" alt="" />
          </div>
          <p>{PAGINA.gatos}</p>
        </div>

        {ADESIVOS_P2.map(([n, p]) => <Ad key={n} n={n} p={p} />)}

        <footer className="folha-pe">
          <span className="num-pag">2</span>
          <span>mais de mim no instagram: <b>@{SITE.instagram}</b></span>
        </footer>
      </article>

      {/* ============ página 3 ============ */}
      <article className="folha folha-2">
        <span className="etiqueta">entrevista</span>
        <div className="folha2-titulo">
          <Recorte texto="perguntas rapidas" altura={64} semente={4} />
        </div>

        <div className="bolhas-pr">
          {PERGUNTAS.map(([p, r], i) => (
            <div key={p} className={`bolha-pr b${i % 4}`}>
              <b>{p}</b>
              <p>{r}</p>
            </div>
          ))}
        </div>

        <div className="amo-bloco">
          <p className="fav-titulo">coisas que eu amo...</p>
          <div className="amo-tiras">
            {AMO.map((a, i) => (
              <span key={a} style={{ transform: `rotate(${((i * 5) % 7) - 3}deg)` }}>{a}</span>
            ))}
          </div>
        </div>

        {ADESIVOS_P3.map(([n, p]) => <Ad key={n} n={n} p={p} />)}

        <footer className="folha-pe">
          <span className="num-pag">3</span>
          <span>foto com a Anitta chegando em breve...</span>
        </footer>
      </article>
    </div>
  );
}
