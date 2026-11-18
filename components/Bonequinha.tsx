"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Check, RotateCw, Download, Footprints, Gem, Image as ImageIcon, Move, Palette, RotateCcw, Save, Scissors, Shirt, Shuffle, Sparkles, Star, Undo2 } from "lucide-react";
import { useSessao } from "@/components/Sessao";
import { supabase } from "@/lib/supabase";
import { CABELO_ATRAS, EIXO, NOME_PARTE, PARTES, PESCOCO, POSICOES, type Pos } from "@/config/bonequinha-posicoes";
import {
  ACESSORIOS, BATONS, BLUSAS, CABELOS, ESMALTES, FUNDOS, PARTE_DE_BAIXO, SAPATOS, SOMBRAS, UNHAS, VESTIDOS, type Peca,
} from "@/config/bonequinha";

const P = "/bonequinha";
const W = 384, H = 1024;
type Ajustes = Record<string, Pos>;
const partesDe = (id: string) => PARTES[id] ?? [id];
// desenha a peça no lugar dela, girando em volta do centro
function desenharPeca(ctx: CanvasRenderingContext2D, img: CanvasImageSource, [x, y, w, h, r = 0]: Pos) {
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate((r * Math.PI) / 180);
  ctx.drawImage(img, -w / 2, -h / 2, w, h); ctx.restore();
}
// mangas: ponto do ombro e do pulso na boneca
function pontosEixo(id: string, [x, y, w, h, r = 0]: Pos) {
  const [v1, v2] = EIXO[id], cx = x + w / 2, cy = y + h / 2, s = Math.sin((r * Math.PI) / 180), c = Math.cos((r * Math.PI) / 180);
  return [v1, v2].map((v) => [cx - s * (v - 0.5) * h, cy + c * (v - 0.5) * h]);
}
// monta a manga a partir do ombro (A) e do pulso (B), mantendo a largura
function mangaEntre(id: string, w: number, A: number[], B: number[]): Pos {
  const [v1, v2] = EIXO[id], dx = B[0] - A[0], dy = B[1] - A[1];
  const h = Math.max(20, Math.hypot(dx, dy) / (v2 - v1)), r = Math.atan2(-dx, dy);
  const cx = A[0] + Math.sin(r) * (v1 - 0.5) * h, cy = A[1] - Math.cos(r) * (v1 - 0.5) * h;
  return [cx - w / 2, cy - h / 2, w, h, (r * 180) / Math.PI];
}
// cantos da peça já girados: [sup-esq, sup-dir, inf-dir, inf-esq]
function cantos([x, y, w, h, r = 0]: Pos) {
  const cx = x + w / 2, cy = y + h / 2, c = Math.cos((r * Math.PI) / 180), s = Math.sin((r * Math.PI) / 180);
  return ([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]] as const).map(([dx, dy]) => [cx + dx * c - dy * s, cy + dx * s + dy * c]);
}

type Look = {
  cabelo: string | null; corCabelo: string; pele: string;
  cima: string | null; baixo: string | null; vestido: string | null; sapato: string | null; acessorios: string[];
  batom: string; sombra: string; blush: boolean; fundo: string;
};
const LOOK_ALANA: Look = {
  cabelo: "h2_1", corCabelo: "natural", pele: "natural", cima: "c01", baixo: "b01", vestido: null, sapato: "s2_1",
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

async function desenharBoneca(ctx: CanvasRenderingContext2D, l: Look, aj: Ajustes, marcar: string | null = null) {
  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(await carregar(`${P}/base.webp`), 0, 0);
  // com sapato, esconde os dedos da boneca que ficariam aparecendo por trás
  if (l.sapato) { ctx.save(); ctx.globalCompositeOperation = "destination-out"; ctx.fillRect(0, 975, W, H - 975); ctx.restore(); }

  // maquiagem
  if (l.sombra) {
    ctx.save(); ctx.globalCompositeOperation = "multiply"; ctx.globalAlpha = 0.5;
    for (const ex of [134, 210]) {
      const g = ctx.createRadialGradient(ex, 150, 2, ex, 150, 30);
      g.addColorStop(0, l.sombra); g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(ex, 150, 30, 15, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  if (l.blush) {
    ctx.save(); ctx.globalAlpha = 0.32;
    for (const bx of [116, 228]) {
      const g = ctx.createRadialGradient(bx, 203, 1, bx, 203, 22);
      g.addColorStop(0, "#ff5f8f"); g.addColorStop(1, "rgba(255,95,143,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(bx, 203, 22, 14, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  if (l.batom) {
    const lab = await carregar(`${P}/labios.webp`);
    ctx.save(); ctx.globalCompositeOperation = "multiply"; ctx.globalAlpha = 0.75;
    ctx.drawImage(preencher(lab, l.batom), 0, 0); ctx.restore();
  }

  // cabelo
  if (l.cabelo) {
    desenharPeca(ctx, await carregar(`${P}/cabelos/${l.cabelo}.webp`), aj[l.cabelo] ?? POSICOES[l.cabelo]);
    // cabelo comprido passa por trás dos ombros, braços e tronco
    if (CABELO_ATRAS.includes(l.cabelo)) ctx.drawImage(await carregar(`${P}/corpo-frente.webp`), 0, 0);
  }
  // roupas
  // sapato primeiro, pra calça ficar por cima dele
  if (l.sapato) ctx.drawImage(await carregar(`${P}/sapatos/${l.sapato}.webp`), 0, 0);
  const roupas = l.vestido ? [l.vestido] : [l.baixo, l.cima].filter((r): r is string => !!r);
  for (const r of roupas) for (const p of partesDe(r)) desenharPeca(ctx, await carregar(`${P}/pecas/${p}.webp`), aj[p] ?? POSICOES[p]);
  // alças que amarram no pescoço passam por trás dele
  if (roupas.some((r) => PESCOCO.includes(r))) ctx.drawImage(await carregar(`${P}/pescoco.webp`), 0, 0);
  for (const a of l.acessorios) ctx.drawImage(await carregar(`${P}/acessorios/${a}.webp`), 0, 0);
  // no modo ajustar, contorna a peça que está sendo mexida
  if (marcar && (marcar === l.cabelo || roupas.some((r) => partesDe(r).includes(marcar)))) {
    const pos = aj[marcar] ?? POSICOES[marcar], k = cantos(pos);
    ctx.save(); ctx.setLineDash([8, 6]); ctx.lineWidth = 2.5; ctx.strokeStyle = "#ff2d95";
    ctx.beginPath(); k.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.stroke();
    ctx.setLineDash([]); ctx.fillStyle = "#fff"; ctx.lineWidth = 3;
    if (EIXO[marcar]) {
      // manga: uma bolinha no ombro e outra no pulso, ligadas por uma linha
      const [A, B] = pontosEixo(marcar, pos);
      ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke();
      for (const [x, y] of [A, B]) { ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    } else for (const [x, y] of k) { ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    ctx.restore();
  }
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
    ctx.save(); ctx.globalCompositeOperation = "multiply"; ctx.drawImage(c, 0, 0); ctx.restore();
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
  const { usuaria } = useSessao();
  const [ajustes, setAjustes] = useState<Ajustes>({});
  const [ajustando, setAjustando] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [aviso, setAviso] = useState("");
  const arrasto = useRef<{ px: number; py: number; ini: Pos; canto: number } | null>(null);

  // posições salvas pela Alana
  useEffect(() => {
    supabase().from("bonequinha_ajustes").select("id,x,y,w,h,r").then(({ data }) => {
      if (!data) return;
      const a: Ajustes = {};
      for (const r of data) a[r.id] = [r.x, r.y, r.w, r.h, r.r ?? 0];
      setAjustes(a);
    });
  }, []);

  const set = (k: Partial<Look>) => setLook((l) => ({ ...l, ...k }));

  useEffect(() => {
    const n = ++vez.current;
    const off = novoCanvas(), x = off.getContext("2d")!;
    desenharBoneca(x, look, ajustes, ajustando ? editando : null).then(() => {
      if (n !== vez.current || !tela.current) return;
      const c = tela.current.getContext("2d")!;
      c.clearRect(0, 0, W, H); c.drawImage(off, 0, 0);
      setCarregando(false);
    });
  }, [look, ajustes, ajustando, editando]);

  useEffect(() => {
    if (aba !== "unhas" || !telaMao.current) return;
    desenharMao(telaMao.current.getContext("2d")!, unhas);
  }, [unhas, aba]);

  const baixarBoneca = useCallback(async () => {
    const c = novoCanvas(720, 1080), x = c.getContext("2d")!;
    await desenharFundo(x, look.fundo, 720, 1080);
    const off = novoCanvas(); await desenharBoneca(off.getContext("2d")!, look, ajustes);
    x.drawImage(off, (720 - W * 1.02) / 2, 30, W * 1.02, H * 1.02);
    x.font = "italic 900 34px Rubik, sans-serif"; x.fillStyle = "#fff"; x.strokeStyle = "#c2185b"; x.lineWidth = 6;
    x.strokeText("alana bts", 26, 56); x.fillText("alana bts", 26, 56);
    baixar(c, "minha-bonequinha.png");
  }, [look, ajustes]);

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
    setEditando(id); setAviso("");
  };

  /* ---------- modo ajustar (só pra Alana logada) ---------- */
  const vestidas = (look.vestido ? [look.vestido] : [look.cima, look.baixo].filter((r): r is string => !!r)).flatMap((r) => [...partesDe(r)].reverse()).concat(look.cabelo ? [look.cabelo] : []);
  const alvo = editando && vestidas.includes(editando) ? editando : vestidas[0] ?? null;
  const posDe = (id: string): Pos => ajustes[id] ?? POSICOES[id];
  const mexer = (f: (p: Pos) => Pos) => {
    if (!alvo) return;
    setAjustes((a) => ({ ...a, [alvo]: f(a[alvo] ?? POSICOES[alvo]) }));
    setAviso("");
  };
  // muda o tamanho mantendo o centro no lugar
  const escala = (fw: number, fh: number) => mexer(([x, y, w, h, r]) => [x + (w - w * fw) / 2, y + (h - h * fh) / 2, w * fw, h * fh, r]);
  const andar = (dx: number, dy: number) => mexer(([x, y, w, h, r]) => [x + dx, y + dy, w, h, r]);
  // manga gira em volta do ombro; o resto gira em volta do meio
  const girar = (g: number) => mexer((p) => {
    const [x, y, w, h, r = 0] = p;
    if (!alvo || !EIXO[alvo]) return [x, y, w, h, r + g];
    const [A, B] = pontosEixo(alvo, p), t = (g * Math.PI) / 180, dx = B[0] - A[0], dy = B[1] - A[1];
    return mangaEntre(alvo, w, A, [A[0] + dx * Math.cos(t) - dy * Math.sin(t), A[1] + dx * Math.sin(t) + dy * Math.cos(t)]);
  });
  const salvar = async () => {
    if (!alvo) return;
    // salva a peça inteira (corpo e mangas juntos)
    const dono = Object.keys(PARTES).find((k) => PARTES[k].includes(alvo));
    const ids = dono ? PARTES[dono] : [alvo];
    setAviso("salvando...");
    const { error } = await supabase().from("bonequinha_ajustes").upsert(ids.map((id) => {
      const [x, y, w, h, r = 0] = posDe(id);
      return { id, x, y, w, h, r, atualizado_em: new Date().toISOString() };
    }));
    setAviso(error ? "não consegui salvar 😢 tenta de novo" : "salvo! ✨");
  };
  const voltarPadrao = () => { if (alvo) { setAjustes((a) => ({ ...a, [alvo]: POSICOES[alvo] })); setAviso("voltou pro padrão (aperta salvar pra guardar)"); } };
  const ponto = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { px: ((e.clientX - r.left) / r.width) * W, py: ((e.clientY - r.top) / r.height) * H };
  };
  const nomeDe = (id: string) => NOME_PARTE[id] ?? (PARTES[id] ? "corpo" : [...BLUSAS, ...PARTE_DE_BAIXO, ...VESTIDOS, ...CABELOS].find((p) => p.id === id)?.nome ?? id);

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

      <div className={`bq-mesa ${usuaria && ajustando ? "ajustando" : ""}`}>
        {/* palco */}
        <div className="bq-palco-moldura">
          <div className={`bq-palco fundo-${look.fundo}`}>
            <canvas ref={tela} width={W} height={H} className={`${carregando ? "carregando" : ""} ${ajustando && alvo ? "arrastavel" : ""}`}
              onPointerDown={(e) => {
                if (!ajustando || !alvo) return;
                e.currentTarget.setPointerCapture(e.pointerId);
                const { px, py } = ponto(e); const ini = posDe(alvo);
                // pegou numa bolinha do canto? então é pra mudar o tamanho
                // nas mangas: 4 = ombro, 5 = pulso
                const canto = EIXO[alvo]
                  ? (() => { const i = pontosEixo(alvo, ini).findIndex(([x, y]) => Math.hypot(px - x, py - y) < 24); return i < 0 ? -1 : 4 + i; })()
                  : cantos(ini).findIndex(([x, y]) => Math.hypot(px - x, py - y) < 22);
                arrasto.current = { px, py, ini, canto };
              }}
              onPointerMove={(e) => {
                const a = arrasto.current; if (!a || !alvo) return;
                const { px, py } = ponto(e);
                const [x, y, w, h, r = 0] = a.ini;
                if (a.canto < 0) { mexer(() => [x + px - a.px, y + py - a.py, w, h, r]); return; }
                if (a.canto >= 4) {
                  // a ponta que você não está puxando fica presa
                  const [A, B] = pontosEixo(alvo, a.ini), P2 = [px, py];
                  mexer(() => (a.canto === 5 ? mangaEntre(alvo, w, A, P2) : mangaEntre(alvo, w, P2, B)));
                  return;
                }
                // o canto oposto fica parado; conta tudo "desgirado"
                const k = cantos(a.ini), op = k[(a.canto + 2) % 4];
                const c = Math.cos((r * Math.PI) / 180), s = Math.sin((r * Math.PI) / 180);
                const dx = px - op[0], dy = py - op[1];
                const lx = dx * c + dy * s, ly = -dx * s + dy * c;
                const nw = Math.max(12, Math.abs(lx)), nh = Math.max(12, Math.abs(ly));
                const mx = ((Math.sign(lx) || 1) * nw) / 2, my = ((Math.sign(ly) || 1) * nh) / 2;
                const cx = op[0] + mx * c - my * s, cy = op[1] + mx * s + my * c;
                mexer(() => [cx - nw / 2, cy - nh / 2, nw, nh, r]);
              }}
              onPointerUp={() => { arrasto.current = null; }}
              onPointerCancel={() => { arrasto.current = null; }}
            />
            {carregando && <span className="bq-carregando">arrumando a boneca...</span>}
          </div>
          <div className="bq-acoes">
            <button onClick={() => setLook(LOOK_ALANA)}><Star size={15} /> look da Alana</button>
            <button onClick={aleatorio}><Shuffle size={15} /> sortear</button>
            <button onClick={() => setLook((l) => ({ ...VAZIO, fundo: l.fundo }))}><RotateCcw size={15} /> tirar tudo</button>
            <button className="bq-baixar" onClick={baixarBoneca}><Download size={15} /> baixar foto</button>
            {usuaria && (
              <button className={ajustando ? "on" : ""} onClick={() => { setAjustando((v) => !v); setAviso(""); }}>
                <Move size={15} /> {ajustando ? "terminar ajuste" : "ajustar roupas"}
              </button>
            )}
          </div>
        </div>

        {usuaria && ajustando && (
          <aside className="bq-ajuste">
            {!alvo ? (
              <p>veste uma roupa ou escolhe um cabelo pra ajustar 👗</p>
            ) : (
              <>
                {vestidas.length > 1 && (
                  <div className="bq-sub">
                    {vestidas.map((v) => <button key={v} className={alvo === v ? "on" : ""} onClick={() => setEditando(v)}>{nomeDe(v)}</button>)}
                  </div>
                )}
                <p><b>{nomeDe(alvo)}</b> · {EIXO[alvo] ? "puxa a bolinha do ombro e a do pulso; a outra ponta fica presa" : "arrasta a roupa na boneca ou puxa as bolinhas dos cantos"}</p>
                <div className="bq-ajuste-linhas">
                  <span>tamanho</span><button onClick={() => escala(0.98, 0.98)}>−</button><button onClick={() => escala(1.02, 1.02)}>+</button>
                  <span>largura</span><button onClick={() => escala(0.98, 1)}>−</button><button onClick={() => escala(1.02, 1)}>+</button>
                  <span>comprimento</span><button onClick={() => escala(1, 0.98)}>−</button><button onClick={() => escala(1, 1.02)}>+</button>
                </div>
                <div className="bq-setas">
                  <button onClick={() => girar(-2)} aria-label="girar pra esquerda"><RotateCcw size={15} /></button>
                  <button onClick={() => girar(2)} aria-label="girar pra direita"><RotateCw size={15} /></button>
                  <button onClick={() => andar(-1, 0)} aria-label="esquerda"><ArrowLeft size={15} /></button>
                  <button onClick={() => andar(0, -1)} aria-label="cima"><ArrowUp size={15} /></button>
                  <button onClick={() => andar(0, 1)} aria-label="baixo"><ArrowDown size={15} /></button>
                  <button onClick={() => andar(1, 0)} aria-label="direita"><ArrowRight size={15} /></button>
                </div>
                <div className="bq-sub">
                  <button className="bq-baixar" onClick={salvar}><Save size={14} /> salvar</button>
                  <button onClick={voltarPadrao}><Undo2 size={14} /> voltar ao padrão</button>
                </div>
                {aviso && <p className="bq-aviso">{aviso.startsWith("salvo") && <Check size={14} />} {aviso}</p>}
              </>
            )}
          </aside>
        )}

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
                <Grade itens={CABELOS} ativo={(id) => look.cabelo === id} aoClicar={(id) => { set({ cabelo: look.cabelo === id ? null : id }); setEditando(id); }} />
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
