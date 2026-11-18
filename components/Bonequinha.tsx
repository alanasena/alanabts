"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Footprints, Gem, Image as ImageIcon, Palette, RotateCcw, Scissors, Shirt, Shuffle, Sparkles, Star } from "lucide-react";
import {
  ACESSORIOS, BATONS, BLUSAS, CABELOS, ESMALTES, FUNDOS, PARTE_DE_BAIXO, SAPATOS, SOMBRAS, UNHAS, VESTIDOS, type Peca,
} from "@/config/bonequinha";

const P = "/bonequinha";
const OX = 40, OY = 40; // folga em volta da boneca (mão e coques)
const W = 384 + OX * 2, H = 1024 + OY;

type Look = {
  cabelo: string | null; corCabelo: string; pele: string;
  cima: string | null; baixo: string | null; vestido: string | null; sapato: string | null; acessorios: string[];
  batom: string; sombra: string; blush: boolean; fundo: string;
};
const LOOK_ALANA: Look = {
  cabelo: "h2_1", corCabelo: "natural", pele: "natural", cima: "r1_0c", baixo: "r1_0b", vestido: null, sapato: "s2_1",
  acessorios: ["a1_3"], batom: "", sombra: "", blush: false, fundo: "rosa",
};
const VAZIO: Look = { ...LOOK_ALANA, cabelo: null, cima: null, baixo: null, vestido: null, sapato: null, acessorios: [], batom: "", sombra: "", blush: false };

/* ---------- carregar imagens uma vez só ---------- */
const cache = new Map<string, Promise<HTMLImageElement>>();
function carregar(src: string) {
  if (!cache.has(src)) {
    cache.set(src, new Promise((ok, erro) => {
      const im = new Image();
      im.onload = () => ok(im);
      im.onerror = erro;
      im.src = src;
    }));
  }
  return cache.get(src)!;
}

function novoCanvas(w = W, h = H) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  return c;
}
// preenche o formato de uma máscara com uma cor
function preencher(mascara: HTMLImageElement, cor: string) {
  const c = novoCanvas(mascara.width, mascara.height), x = c.getContext("2d")!;
  x.fillStyle = cor; x.fillRect(0, 0, c.width, c.height);
  x.globalCompositeOperation = "destination-in";
  x.drawImage(mascara, 0, 0);
  return c;
}

async function desenharBoneca(ctx: CanvasRenderingContext2D, l: Look) {
  ctx.clearRect(0, 0, W, H);
  const img = (n: string) => carregar(`${P}/${n}.webp`);
  const pos = (im: CanvasImageSource) => ctx.drawImage(im, OX, OY);
  if (l.cabelo) ctx.drawImage(await img(`cabelos/${l.cabelo}`), OX, OY - 40); // parte de trás do cabelo, atrás do corpo
  pos(await img("base"));
  ctx.drawImage(await img("mao-extra"), OX - 40, OY);
  // com sapato, esconde os dedos da boneca que ficariam aparecendo por trás
  if (l.sapato) { ctx.save(); ctx.globalCompositeOperation = "destination-out"; ctx.fillRect(0, OY + 975, W, 60); ctx.restore(); }

  // maquiagem
  if (l.sombra) {
    ctx.save(); ctx.globalCompositeOperation = "multiply"; ctx.globalAlpha = 0.5;
    for (const ex of [134, 210]) {
      const g = ctx.createRadialGradient(OX + ex, OY + 150, 2, OX + ex, OY + 150, 30);
      g.addColorStop(0, l.sombra); g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(OX + ex, OY + 150, 30, 15, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  if (l.blush) {
    ctx.save(); ctx.globalAlpha = 0.32;
    for (const bx of [116, 228]) {
      const g = ctx.createRadialGradient(OX + bx, OY + 203, 1, OX + bx, OY + 203, 22);
      g.addColorStop(0, "#ff5f8f"); g.addColorStop(1, "rgba(255,95,143,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(OX + bx, OY + 203, 22, 14, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  if (l.batom) {
    ctx.save(); ctx.globalCompositeOperation = "multiply"; ctx.globalAlpha = 0.8;
    pos(preencher(await img("labios"), l.batom)); ctx.restore();
  }

  // roupas: sapato primeiro, pra calça ficar por cima dele
  const camadas: string[] = [];
  if (l.sapato) camadas.push(`sapatos/${l.sapato}`);
  if (l.vestido) camadas.push(`roupas/${l.vestido}`);
  else {
    if (l.baixo) camadas.push(`roupas/${l.baixo}`);
    if (l.cima) camadas.push(`roupas/${l.cima}`);
  }
  for (const c of camadas) pos(await img(c));
  if (l.cabelo) ctx.drawImage(await img(`cabelos/${l.cabelo}-frente`), OX, OY - 40); // franja e mechas da frente
  for (const a of l.acessorios) pos(await img(`acessorios/${a}`));
}

async function desenharFundo(ctx: CanvasRenderingContext2D, fundo: string, w: number, h: number) {
  if (fundo === "praia" || fundo === "oncinha") {
    const im = await carregar(fundo === "praia" ? "/h2o/praia-coqueiros.webp" : "/oncinha-rosa.webp");
    if (fundo === "oncinha") { ctx.fillStyle = ctx.createPattern(im, "repeat")!; ctx.fillRect(0, 0, w, h); }
    else { const s = Math.max(w / im.width, h / im.height); ctx.drawImage(im, (w - im.width * s) / 2, (h - im.height * s) / 2, im.width * s, im.height * s); }
    return;
  }
  const g = ctx.createLinearGradient(0, 0, 0, h);
  if (fundo === "glitter") { g.addColorStop(0, "#3a0a2a"); g.addColorStop(1, "#c2185b"); }
  else if (fundo === "passarela") { g.addColorStop(0, "#1a1020"); g.addColorStop(1, "#4a2a5a"); }
  else { g.addColorStop(0, "#ffd6ea"); g.addColorStop(1, "#ff9ccb"); }
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  if (fundo === "glitter" || fundo === "rosa") {
    for (let i = 0; i < 260; i++) {
      const x = (i * 97.13) % w, y = (i * 211.7) % h, r = (i % 4) + 0.6;
      ctx.fillStyle = `rgba(255,255,255,${0.15 + (i % 5) * 0.12})`;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
  }
  if (fundo === "passarela") {
    ctx.fillStyle = "rgba(255,255,255,.08)";
    for (const x of [w * 0.2, w * 0.8]) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x - 140, h); ctx.lineTo(x + 140, h); ctx.fill(); }
    ctx.fillStyle = "#e9e2ef"; ctx.beginPath(); ctx.moveTo(w * 0.42, h * 0.72); ctx.lineTo(w * 0.58, h * 0.72); ctx.lineTo(w * 0.85, h); ctx.lineTo(w * 0.15, h); ctx.fill();
  }
}

/* ---------- unhas ---------- */
type Unha = { cor: string; estampa: "liso" | "glitter" | "oncinha" | "degrade" };
async function desenharMao(ctx: CanvasRenderingContext2D, unhas: Unha[]) {
  const mao = await carregar(`${P}/mao.webp`);
  ctx.clearRect(0, 0, mao.width, mao.height);
  ctx.drawImage(mao, 0, 0);
  for (let i = 0; i < unhas.length; i++) {
    const u = unhas[i];
    if (!u.cor) continue;
    const mk = await carregar(`${P}/unha${i + 1}.webp`);
    const c = novoCanvas(mao.width, mao.height), x = c.getContext("2d")!;
    const [ux, uy, uw, uh] = UNHAS[i];
    if (u.estampa === "oncinha") { x.fillStyle = x.createPattern(await carregar("/oncinha-rosa.webp"), "repeat")!; x.fillRect(0, 0, c.width, c.height); x.globalCompositeOperation = "multiply"; x.fillStyle = u.cor; x.globalAlpha = 0.5; x.fillRect(0, 0, c.width, c.height); x.globalAlpha = 1; x.globalCompositeOperation = "source-over"; }
    else if (u.estampa === "degrade") { const g = x.createLinearGradient(0, uy, 0, uy + uh); g.addColorStop(0, "#ffffff"); g.addColorStop(1, u.cor); x.fillStyle = g; x.fillRect(0, 0, c.width, c.height); }
    else { x.fillStyle = u.cor; x.fillRect(0, 0, c.width, c.height); }
    if (u.estampa === "glitter") {
      for (let k = 0; k < 90; k++) {
        x.fillStyle = k % 3 ? "rgba(255,255,255,.85)" : "rgba(255,230,120,.9)";
        x.beginPath(); x.arc(ux + ((k * 37.7) % uw), uy + ((k * 53.3) % uh), 0.6 + (k % 3) * 0.5, 0, Math.PI * 2); x.fill();
      }
    }
    x.globalCompositeOperation = "destination-in"; x.drawImage(mk, 0, 0);
    ctx.drawImage(c, 0, 0); // cor viva por cima
    // sombrinha da unha por cima, pra não ficar chapado
    ctx.save(); ctx.globalCompositeOperation = "multiply"; ctx.globalAlpha = 0.35;
    const sombra = novoCanvas(mao.width, mao.height), xs = sombra.getContext("2d")!;
    xs.drawImage(mao, 0, 0); xs.globalCompositeOperation = "destination-in"; xs.drawImage(mk, 0, 0);
    ctx.drawImage(sombra, 0, 0); ctx.restore();
    // brilho por cima pra parecer esmalte
    ctx.save(); ctx.globalAlpha = 0.55; ctx.globalCompositeOperation = "screen";
    const g2 = ctx.createLinearGradient(ux, uy, ux + uw, uy + uh);
    g2.addColorStop(0.15, "rgba(255,255,255,0)"); g2.addColorStop(0.35, "rgba(255,255,255,.55)"); g2.addColorStop(0.5, "rgba(255,255,255,0)");
    const c2 = novoCanvas(mao.width, mao.height), x2 = c2.getContext("2d")!;
    x2.fillStyle = g2; x2.fillRect(ux, uy, uw, uh); x2.globalCompositeOperation = "destination-in"; x2.drawImage(mk, 0, 0);
    ctx.drawImage(c2, 0, 0); ctx.restore();
  }
}

function baixar(c: HTMLCanvasElement, nome: string) {
  const a = document.createElement("a");
  a.download = nome; a.href = c.toDataURL("image/png"); a.click();
}

const ABAS = [
  { id: "cabelo", nome: "cabelo", icone: Scissors },
  { id: "roupas", nome: "roupas", icone: Shirt },
  { id: "sapatos", nome: "sapatos", icone: Footprints },
  { id: "acessorios", nome: "acessórios", icone: Gem },
  { id: "make", nome: "maquiagem", icone: Palette },
  { id: "unhas", nome: "unhas", icone: Sparkles },
  { id: "fundo", nome: "fundo", icone: ImageIcon },
] as const;
type Aba = (typeof ABAS)[number]["id"];

export default function Bonequinha() {
  const [look, setLook] = useState<Look>(LOOK_ALANA);
  const [aba, setAba] = useState<Aba>("roupas");
  const [gaveta, setGaveta] = useState<"cima" | "baixo" | "vestidos">("cima");
  const [unhas, setUnhas] = useState<Unha[]>(UNHAS.map(() => ({ cor: "", estampa: "liso" })));
  const [esmalte, setEsmalte] = useState<Unha>({ cor: ESMALTES[0], estampa: "liso" });
  const [carregando, setCarregando] = useState(true);
  const tela = useRef<HTMLCanvasElement>(null);
  const telaMao = useRef<HTMLCanvasElement>(null);
  const vez = useRef(0);

  const set = (k: Partial<Look>) => setLook((l) => ({ ...l, ...k }));

  useEffect(() => {
    const n = ++vez.current;
    const off = novoCanvas(), x = off.getContext("2d")!;
    desenharBoneca(x, look).then(() => {
      if (n !== vez.current || !tela.current) return;
      const c = tela.current.getContext("2d")!;
      c.clearRect(0, 0, W, H); c.drawImage(off, 0, 0);
      setCarregando(false);
    });
  }, [look]);

  useEffect(() => {
    if (aba !== "unhas" || !telaMao.current) return;
    desenharMao(telaMao.current.getContext("2d")!, unhas);
  }, [unhas, aba]);

  const baixarBoneca = useCallback(async () => {
    const c = novoCanvas(720, 1080), x = c.getContext("2d")!;
    await desenharFundo(x, look.fundo, 720, 1080);
    const off = novoCanvas(); await desenharBoneca(off.getContext("2d")!, look);
    x.drawImage(off, (720 - W * 1.02) / 2, 30, W * 1.02, H * 1.02);
    x.font = "italic 900 34px Rubik, sans-serif"; x.fillStyle = "#fff"; x.strokeStyle = "#c2185b"; x.lineWidth = 6;
    x.strokeText("alana bts", 26, 56); x.fillText("alana bts", 26, 56);
    baixar(c, "minha-bonequinha.png");
  }, [look]);

  const aleatorio = () => {
    const sorteia = <T,>(l: T[]) => l[Math.floor(Math.random() * l.length)];
    const vestido = Math.random() < 0.3;
    setLook((l) => ({
      ...l,
      cabelo: sorteia(CABELOS).id,
      vestido: vestido ? sorteia(VESTIDOS).id : null, cima: vestido ? null : sorteia(BLUSAS).id, baixo: vestido ? null : sorteia(PARTE_DE_BAIXO).id,
      sapato: sorteia(SAPATOS).id, acessorios: ACESSORIOS.filter(() => Math.random() < 0.35).map((a) => a.id),
      batom: sorteia(BATONS), sombra: sorteia(SOMBRAS), blush: Math.random() < 0.5,
    }));
  };

  const vestir = (tipo: "cima" | "baixo" | "vestidos", id: string) => {
    if (tipo === "vestidos") set({ vestido: look.vestido === id ? null : id, cima: null, baixo: null });
    else if (tipo === "cima") set({ cima: look.cima === id ? null : id, vestido: null });
    else set({ baixo: look.baixo === id ? null : id, vestido: null });
  };

  const Grade = ({ itens, ativo, aoClicar, pasta = "mini" }: { itens: Peca[]; ativo: (id: string) => boolean; aoClicar: (id: string) => void; pasta?: string }) => (
    <div className="bq-grade">
      {itens.map((p) => (
        <button key={p.id} className={ativo(p.id) ? "on" : ""} onClick={() => aoClicar(p.id)} title={p.nome}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${P}/${pasta}/${p.id}.webp`} alt={p.nome} loading="lazy" />
        </button>
      ))}
    </div>
  );
  const Bolinhas = ({ cores, ativo, aoClicar, nenhum }: { cores: string[]; ativo: string; aoClicar: (c: string) => void; nenhum?: string }) => (
    <div className="bq-cores">
      {cores.map((c) => (
        <button key={c || "nada"} className={`${c === ativo ? "on" : ""} ${c ? "" : "nada"}`} style={{ background: c || undefined }} onClick={() => aoClicar(c)} aria-label={c || nenhum}>
          {!c && "×"}
        </button>
      ))}
    </div>
  );

  return (
    <div className="bq">
      <header className="bq-topo">
        <h1><span>closet</span> da alana</h1>
        <p>vista a bonequinha do jeito que quiser e baixe a foto no final</p>
      </header>

      <div className="bq-mesa">
        {/* palco */}
        <div className="bq-palco-moldura">
          <div className={`bq-palco fundo-${look.fundo}`}>
            <canvas ref={tela} width={W} height={H} className={carregando ? "carregando" : ""} />
            {carregando && <span className="bq-carregando">arrumando a boneca...</span>}
          </div>
          <div className="bq-acoes">
            <button onClick={() => setLook(LOOK_ALANA)}><Star size={15} /> look da Alana</button>
            <button onClick={aleatorio}><Shuffle size={15} /> sortear</button>
            <button onClick={() => setLook((l) => ({ ...VAZIO, fundo: l.fundo }))}><RotateCcw size={15} /> tirar tudo</button>
            <button className="bq-baixar" onClick={baixarBoneca}><Download size={15} /> baixar foto</button>
          </div>
        </div>

        {/* closet */}
        <section className="bq-closet">
          <nav className="bq-abas">
            {ABAS.map((a) => (
              <button key={a.id} className={aba === a.id ? "on" : ""} onClick={() => setAba(a.id)}><a.icone size={17} /><span>{a.nome}</span></button>
            ))}
          </nav>
          <div className="bq-gaveta">
            {aba === "cabelo" && (
              <>
                <p className="bq-tit">penteado</p>
                <Grade itens={CABELOS} ativo={(id) => look.cabelo === id} aoClicar={(id) => set({ cabelo: look.cabelo === id ? null : id })} />
              </>
            )}
            {aba === "roupas" && (
              <>
                <div className="bq-sub">
                  {([["cima", "blusas"], ["baixo", "saias & calças"], ["vestidos", "vestidos"]] as const).map(([g, n]) => (
                    <button key={g} className={gaveta === g ? "on" : ""} onClick={() => setGaveta(g)}>{n}</button>
                  ))}
                </div>
                <Grade
                  itens={gaveta === "cima" ? BLUSAS : gaveta === "baixo" ? PARTE_DE_BAIXO : VESTIDOS}
                  ativo={(id) => look.cima === id || look.baixo === id || look.vestido === id}
                  aoClicar={(id) => vestir(gaveta, id)}
                />
              </>
            )}
            {aba === "sapatos" && <Grade itens={SAPATOS} ativo={(id) => look.sapato === id} aoClicar={(id) => set({ sapato: look.sapato === id ? null : id })} />}
            {aba === "acessorios" && (
              <>
                <p className="bq-tit">pode escolher vários</p>
                <Grade itens={ACESSORIOS} ativo={(id) => look.acessorios.includes(id)} aoClicar={(id) => set({ acessorios: look.acessorios.includes(id) ? look.acessorios.filter((a) => a !== id) : [...look.acessorios, id] })} />
              </>
            )}
            {aba === "make" && (
              <>
                <p className="bq-tit">batom</p>
                <Bolinhas cores={BATONS} ativo={look.batom} aoClicar={(c) => set({ batom: c })} nenhum="sem batom" />
                <p className="bq-tit">sombra</p>
                <Bolinhas cores={SOMBRAS} ativo={look.sombra} aoClicar={(c) => set({ sombra: c })} nenhum="sem sombra" />
                <p className="bq-tit">blush</p>
                <div className="bq-sub"><button className={look.blush ? "on" : ""} onClick={() => set({ blush: !look.blush })}>{look.blush ? "com blush" : "sem blush"}</button></div>
              </>
            )}
            {aba === "unhas" && (
              <div className="bq-manicure">
                <div className="bq-mao">
                  <canvas ref={telaMao} width={543} height={724} onClick={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - r.left) / r.width) * 543, y = ((e.clientY - r.top) / r.height) * 724;
                    let perto = 0, menor = Infinity;
                    UNHAS.forEach(([ux, uy, uw, uh], i) => { const d = Math.hypot(x - (ux + uw / 2), y - (uy + uh / 2)); if (d < menor) { menor = d; perto = i; } });
                    if (menor < 140) setUnhas((u) => u.map((v, k) => (k === perto ? { ...esmalte } : v)));
                  }} />
                  {UNHAS.map(([x, y, w, h], i) => (
                    <button key={i} className="bq-unha" style={{ left: `${(x / 543) * 100}%`, top: `${(y / 724) * 100}%`, width: `${(w / 543) * 100}%`, height: `${(h / 724) * 100}%` }}
                      onClick={() => setUnhas((u) => u.map((v, k) => (k === i ? { ...esmalte } : v)))} aria-label={`pintar unha ${i + 1}`} />
                  ))}
                </div>
                <div className="bq-esmaltes">
                  <p className="bq-tit">1. escolhe a cor · 2. clica na unha (ou em pintar todas)</p>
                  <div className="bq-cores">
                    {ESMALTES.map((c) => <button key={c} className={esmalte.cor === c ? "on" : ""} style={{ background: c }} onClick={() => setEsmalte((e) => ({ ...e, cor: c }))} />)}
                  </div>
                  <div className="bq-sub">
                    {(["liso", "glitter", "oncinha", "degrade"] as const).map((e) => (
                      <button key={e} className={esmalte.estampa === e ? "on" : ""} onClick={() => setEsmalte((x) => ({ ...x, estampa: e }))}>{e === "degrade" ? "degradê" : e}</button>
                    ))}
                  </div>
                  <div className="bq-sub">
                    <button onClick={() => setUnhas(UNHAS.map(() => ({ ...esmalte })))}>pintar todas</button>
                    <button onClick={() => setUnhas(UNHAS.map(() => ({ cor: "", estampa: "liso" })))}>tirar esmalte</button>
                    <button className="bq-baixar" onClick={() => telaMao.current && baixar(telaMao.current, "minhas-unhas.png")}><Download size={14} /> baixar</button>
                  </div>
                </div>
              </div>
            )}
            {aba === "fundo" && (
              <div className="bq-fundos">
                {FUNDOS.map((f) => (
                  <button key={f.id} className={`fundo-${f.id} ${look.fundo === f.id ? "on" : ""}`} onClick={() => set({ fundo: f.id })}><span>{f.nome}</span></button>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
