"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Camera, Maximize2, Pencil, Plus } from "lucide-react";
import { supabase, subirFoto } from "@/lib/supabase";
import { useSessao } from "./Sessao";
import Modal from "./Modal";
import { SITE } from "@/config/site";
import { CATEGORIAS_FAV } from "@/config/favoritos";

type Fav = { id: string; tipo: string; titulo: string; capa: string | null; comentario: string | null; ordem: number; mes: string | null; categoria: string | null };
type Tela =
  | { t: "abertura" }
  | { t: "vinheta" }
  | { t: "top" }
  | { t: "item"; fav: Fav; n: number }
  | { t: "intervalo" }
  | { t: "vazio" }
  | { t: "fim" };

const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const mesAtual = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; };
const partes = (m: string) => { const [a, n] = m.split("-").map(Number); return { a, n }; };
const nomeMes = (m: string) => MESES[partes(m).n - 1] ?? m;
const proximoMes = (m: string) => MESES[partes(m).n % 12];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------------- cenário (fundo com raios, faixas e bolhas) ---------------- */
function Cenario({ cor = "azul", children }: { cor?: "azul" | "rosa" | "pessego"; children: React.ReactNode }) {
  return (
    <div className={`cena cena-${cor}`}>
      <div className="cena-raios" />
      <div className="cena-aro a1" /><div className="cena-aro a2" />
      <svg className="cena-faixas" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="fxAzul" x1="0" x2="1"><stop offset="0" stopColor="#2563c9" /><stop offset=".55" stopColor="#4f9dff" /><stop offset="1" stopColor="#a8d4ff" /></linearGradient>
          <linearGradient id="fxLar" x1="0" x2="1"><stop offset="0" stopColor="#ffb14a" /><stop offset=".5" stopColor="#ff7a1a" /><stop offset="1" stopColor="#ffc56e" /></linearGradient>
          <linearGradient id="fxRosa" x1="0" x2="1"><stop offset="0" stopColor="#ff8cc3" /><stop offset=".6" stopColor="#ff4f9f" /><stop offset="1" stopColor="#ff7ab8" /></linearGradient>
          <linearGradient id="fxPrata" x1="0" x2="1"><stop offset="0" stopColor="#c9d1db" /><stop offset=".5" stopColor="#eef2f6" /><stop offset="1" stopColor="#b4bfcc" /></linearGradient>
        </defs>
        <path className="fx f-prata" d="M-20 640 C 400 600, 900 650, 1620 520" stroke="url(#fxPrata)" strokeWidth="16" fill="none" />
        <path className="fx f-azul" d="M-20 700 C 420 650, 900 720, 1620 560 L1620 640 C 900 790, 420 720, -20 790 Z" fill="url(#fxAzul)" />
        <path className="fx f-lar" d="M-20 820 C 500 790, 1000 830, 1620 690" stroke="url(#fxLar)" strokeWidth="26" fill="none" />
        <path className="fx f-rosa" d="M900 940 C 1200 860, 1400 830, 1620 780 L1620 940 Z" fill="url(#fxRosa)" />
        <path className="fx f-rosa2" d="M820 -20 C 1100 60, 1350 90, 1620 160 L1620 70 C 1350 20, 1150 0, 1000 -20 Z" fill="url(#fxRosa)" />
        <path className="fx f-lar2" d="M-20 150 C 200 120, 380 170, 520 110" stroke="url(#fxLar)" strokeWidth="20" fill="none" strokeLinecap="round" />
      </svg>
      <span className="bolha b1" /><span className="bolha b2" /><span className="bolha b3 rosa" /><span className="bolha b4" /><span className="bolha b5 rosa" />
      <span className="brilho s1" /><span className="brilho s2 dourado" /><span className="brilho s3" />
      <div className="cena-conteudo">{children}</div>
    </div>
  );
}

const Logo = ({ grande }: { grande?: boolean }) => (
  <span className={`atv-logo ${grande ? "grande" : ""}`}><b>alana</b><i>TV</i></span>
);

/* ---------------- cada tela do programa ---------------- */
function TelaPrograma({ tela, mes, doMes }: { tela: Tela; mes: string; doMes: Fav[] }) {
  const nm = cap(nomeMes(mes));
  switch (tela.t) {
    case "abertura":
      return (
        <Cenario>
          <div className="tl-abertura">
            <span className="tx-rosa tx-refl gigante">alana</span>
            <span className="pilula-tv">TV</span>
            <span className="tl-apresenta">APRESENTA</span>
          </div>
        </Cenario>
      );
    case "vinheta":
      return (
        <Cenario>
          <Logo />
          <div className="tl-vinheta">
            <span className="tx-cromo enorme">Favoritos</span>
            <span className="tx-rosa tx-refl grande">de {nm}</span>
          </div>
        </Cenario>
      );
    case "top":
      return (
        <Cenario>
          <Logo />
          <div className="tl-top">
            <span className="tx-cromo grande">Top do Mês</span>
            <ol>
              {doMes.slice(0, 7).map((f, i) => (
                <li key={f.id} className={`barra cor${i % 3}`} style={{ animationDelay: `${200 + i * 120}ms` }}>
                  <span className="moeda">{i + 1}</span>
                  <span className="barra-txt">{f.titulo}</span>
                </li>
              ))}
            </ol>
          </div>
        </Cenario>
      );
    case "item": {
      const f = tela.fav;
      const motivos = (f.comentario ?? "").split(/\n+/).map((s) => s.trim()).filter(Boolean);
      // tamanho da letra pra caber: depende da maior palavra e do tamanho total
      const maiorPalavra = Math.max(...f.titulo.split(/\s+/).map((w) => w.length));
      const tam = Math.round(Math.min(140, 760 / Math.max(maiorPalavra, 4), f.titulo.length > 24 ? 80 : 140));
      return (
        <Cenario cor="rosa">
          <span className="selo-mes">FAVORITOS DE {nomeMes(mes).toUpperCase()}</span>
          <Logo />
          <div className="tl-item">
            <div className="foto-card">
              <div className="foto-dentro">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {f.capa ? <img src={f.capa} alt="" /> : <span className="sem-foto"><Camera /><b>{f.titulo}</b></span>}
              </div>
            </div>
            <div className="item-lado">
              <div className="item-titulo">
                <span className="moeda grande">#{tela.n}</span>
                <span className="tx-rosa" style={{ fontSize: `calc(var(--u) * ${tam})` }}>{f.titulo}</span>
              </div>
              {(motivos.length > 0 || f.categoria) && (
                <div className="caixa-amei">
                  <span className="pilula-azul">{motivos.length ? "POR QUE EU AMEI" : "CATEGORIA"}</span>
                  {motivos.length > 1 ? (
                    <ul>{motivos.slice(0, 4).map((m) => <li key={m}>{m}</li>)}</ul>
                  ) : motivos.length === 1 ? <p>{motivos[0]}</p> : null}
                </div>
              )}
              {f.categoria && <span className="pilula-rosa">{f.categoria}</span>}
            </div>
          </div>
        </Cenario>
      );
    }
    case "intervalo":
      return (
        <Cenario cor="pessego">
          <Logo />
          <div className="tl-intervalo">
            <span className="tx-cromo enorme">Não sai daí!</span>
            <span className="faixa-rosa">Já já tem mais favoritos</span>
          </div>
        </Cenario>
      );
    case "vazio":
      return (
        <Cenario cor="pessego">
          <Logo />
          <div className="tl-intervalo">
            <span className="tx-cromo grande">Em breve!</span>
            <span className="faixa-rosa">os favoritos de {nomeMes(mes)} ainda não foram ao ar</span>
          </div>
        </Cenario>
      );
    case "fim":
      return (
        <Cenario cor="rosa">
          <div className="tl-fim">
            <span className="tx-rosa enorme">Valeu, gente!</span>
            <span className="tx-cromo medio">Até os favoritos de {cap(proximoMes(mes))}!</span>
          </div>
          <div className="fim-rodape">
            <Logo />
            <span className="faixa-laranja">Me segue: @{SITE.instagram}</span>
          </div>
        </Cenario>
      );
  }
}

/* ---------------- controle remoto (foto de um controle rosa de verdade) ---------------- */
function Controle({ ligada, onPower, onCh, onAnt, onProx, onMenu, onNum, onTelaCheia, onInicio, onAleatorio }: {
  ligada: boolean; onPower: () => void; onCh: (d: number) => void; onAnt: () => void; onProx: () => void; onMenu: () => void; onNum: (n: number) => void; onTelaCheia?: () => void; onInicio: () => void; onAleatorio: () => void; cheia?: boolean;
}) {
  return (
    <div className="controle2" aria-label="controle remoto">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/tv/controle.webp" alt="" draggable={false} />
      <span className={`ctl2-led ${ligada ? "on" : ""}`} />
      <button className="cb redondo" style={{ left: "15.49%", top: "4.19%", width: "14.08%", height: "4.09%" }} onClick={onPower} aria-label="ligar ou desligar" />
      <button className="cb redondo" style={{ left: "15.85%", top: "11.15%", width: "11.97%", height: "3.48%" }} onClick={() => onNum(1)} aria-label="favorito 1" />
      <button className="cb redondo" style={{ left: "35.92%", top: "11.15%", width: "11.97%", height: "3.48%" }} onClick={() => onNum(2)} aria-label="favorito 2" />
      <button className="cb redondo" style={{ left: "55.28%", top: "11.15%", width: "11.97%", height: "3.48%" }} onClick={() => onNum(3)} aria-label="favorito 3" />
      <button className="cb redondo" style={{ left: "15.85%", top: "16.05%", width: "11.97%", height: "3.48%" }} onClick={() => onNum(4)} aria-label="favorito 4" />
      <button className="cb redondo" style={{ left: "35.92%", top: "16.05%", width: "11.97%", height: "3.48%" }} onClick={() => onNum(5)} aria-label="favorito 5" />
      <button className="cb redondo" style={{ left: "55.28%", top: "16.05%", width: "11.97%", height: "3.48%" }} onClick={() => onNum(6)} aria-label="favorito 6" />
      <button className="cb redondo" style={{ left: "15.85%", top: "21.17%", width: "11.97%", height: "3.48%" }} onClick={() => onNum(7)} aria-label="favorito 7" />
      <button className="cb redondo" style={{ left: "35.92%", top: "21.17%", width: "11.97%", height: "3.48%" }} onClick={() => onNum(8)} aria-label="favorito 8" />
      <button className="cb redondo" style={{ left: "55.28%", top: "21.17%", width: "11.97%", height: "3.48%" }} onClick={() => onNum(9)} aria-label="favorito 9" />
      <button className="cb" style={{ left: "14.44%", top: "32.62%", width: "14.08%", height: "2.86%" }} onClick={onAnt} aria-label="voltar" />
      <button className="cb" style={{ left: "34.15%", top: "32.62%", width: "14.08%", height: "2.86%" }} onClick={onProx} aria-label="avançar" />
      <button className="cb" style={{ left: "53.17%", top: "32.62%", width: "14.08%", height: "2.86%" }} onClick={onAnt} aria-label="anterior" />
      <button className="cb" style={{ left: "72.89%", top: "32.62%", width: "14.08%", height: "2.86%" }} onClick={onProx} aria-label="próximo" />
      <button className="cb" style={{ left: "14.44%", top: "38.24%", width: "14.08%", height: "3.07%" }} onClick={onProx} aria-label="play" />
      <button className="cb" style={{ left: "71.83%", top: "38.24%", width: "14.08%", height: "3.07%" }} onClick={onInicio} aria-label="voltar pro começo" />
      <button className="cb redondo" style={{ left: "41.55%", top: "45.09%", width: "19.72%", height: "4.09%" }} onClick={() => onCh(1)} aria-label="próximo mês" />
      <button className="cb redondo" style={{ left: "41.55%", top: "57.67%", width: "19.72%", height: "4.09%" }} onClick={() => onCh(-1)} aria-label="mês anterior" />
      <button className="cb redondo" style={{ left: "20.77%", top: "50.61%", width: "14.08%", height: "5.73%" }} onClick={onAnt} aria-label="tela anterior" />
      <button className="cb redondo" style={{ left: "67.61%", top: "50.61%", width: "14.08%", height: "5.73%" }} onClick={onProx} aria-label="próxima tela" />
      <button className="cb redondo" style={{ left: "42.25%", top: "50.82%", width: "18.31%", height: "5.32%" }} onClick={onProx} aria-label="ok" />
      <button className="cb redondo" style={{ left: "16.20%", top: "59.61%", width: "11.27%", height: "3.27%" }} onClick={onMenu} aria-label="top do mês" />
      <button className="cb redondo" style={{ left: "74.30%", top: "43.97%", width: "11.27%", height: "3.27%" }} onClick={onMenu} aria-label="top do mês" />
      <button className="cb redondo" style={{ left: "74.30%", top: "64.93%", width: "11.27%", height: "3.27%" }} onClick={onAnt} aria-label="voltar" />
      <button className="cb redondo" style={{ left: "74.30%", top: "80.78%", width: "11.27%", height: "3.27%" }} onClick={onAleatorio} aria-label="favorito aleatório" />
      <button className="cb redondo" style={{ left: "54.58%", top: "80.78%", width: "11.27%", height: "3.27%" }} onClick={() => onTelaCheia?.()} aria-label="tela cheia" />
      <span className="ctl2-marca">alana <i>TV</i></span>
    </div>
  );
}

/* ---------------- página ---------------- */
export default function Favoritos() {
  const { usuaria } = useSessao();
  const [favs, setFavs] = useState<Fav[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mes, setMes] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);
  const [ligada, setLigada] = useState(true);
  const [cheia, setCheia] = useState(false);
  const [mostrarCtl, setMostrarCtl] = useState(true);
  const [chiado, setChiado] = useState(false);
  const [editando, setEditando] = useState<Partial<Fav> | null>(null);
  const cheiaRef = useRef<HTMLDivElement>(null);

  const carregar = useCallback(async () => {
    const { data } = await supabase().from("favoritos").select("*").order("ordem").order("titulo");
    setFavs((data ?? []) as Fav[]);
    setCarregando(false);
  }, []);
  useEffect(() => { carregar(); }, [carregar, usuaria]);

  const meses = useMemo(() => {
    const m = new Set(favs.map((f) => f.mes).filter(Boolean) as string[]);
    m.add(mesAtual());
    return [...m].sort();
  }, [favs]);
  const escolhido = mes ?? (favs.some((f) => f.mes === mesAtual()) ? mesAtual() : meses.filter((m) => favs.some((f) => f.mes === m)).pop() ?? mesAtual());
  const doMes = useMemo(() => favs.filter((f) => f.mes === escolhido).sort((a, b) => a.ordem - b.ordem), [favs, escolhido]);

  // roteiro do programa: abertura, vinheta, top, contagem regressiva com intervalos, encerramento
  const telas = useMemo<Tela[]>(() => {
    const t: Tela[] = [{ t: "abertura" }, { t: "vinheta" }];
    if (!doMes.length) return [...t, { t: "vazio" }, { t: "fim" }];
    t.push({ t: "top" });
    const contagem = [...doMes].map((f, i) => ({ f, n: i + 1 })).reverse();
    contagem.forEach(({ f, n }, k) => {
      t.push({ t: "item", fav: f, n });
      if ((k + 1) % 3 === 0 && k < contagem.length - 1) t.push({ t: "intervalo" });
    });
    t.push({ t: "fim" });
    return t;
  }, [doMes]);
  const atual = telas[Math.min(idx, telas.length - 1)];

  const trocar = useCallback((novo: number) => {
    setChiado(true);
    setTimeout(() => { setIdx(Math.max(0, Math.min(telas.length - 1, novo))); setChiado(false); }, 140);
  }, [telas.length]);
  const prox = useCallback(() => trocar(idx + 1), [idx, trocar]);
  const ant = useCallback(() => trocar(idx - 1), [idx, trocar]);
  const canal = useCallback((d: number) => {
    const i = meses.indexOf(escolhido) + d;
    if (i < 0 || i >= meses.length) return;
    setChiado(true);
    setTimeout(() => { setMes(meses[i]); setIdx(0); setChiado(false); }, 180);
  }, [meses, escolhido]);
  const irNum = useCallback((n: number) => {
    const i = telas.findIndex((t) => t.t === "item" && t.n === n);
    if (i >= 0) trocar(i);
  }, [telas, trocar]);
  const aleatorio = useCallback(() => {
    const itens = telas.map((t, i) => (t.t === "item" ? i : -1)).filter((i) => i >= 0);
    if (itens.length) trocar(itens[Math.floor(Math.random() * itens.length)]);
  }, [telas, trocar]);
  const irTop = useCallback(() => { const i = telas.findIndex((t) => t.t === "top"); if (i >= 0) trocar(i); }, [telas, trocar]);

  const abrirCheia = () => {
    setLigada(true);
    setCheia(true);
    setTimeout(() => cheiaRef.current?.requestFullscreen?.().catch(() => {}), 30);
  };
  const fecharCheia = useCallback(() => {
    setCheia(false);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }, []);
  useEffect(() => {
    const f = () => { if (!document.fullscreenElement) setCheia(false); };
    document.addEventListener("fullscreenchange", f);
    return () => document.removeEventListener("fullscreenchange", f);
  }, []);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("input, textarea, select")) return;
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); prox(); }
      else if (e.key === "ArrowLeft") ant();
      else if (e.key === "ArrowUp" && cheia) { e.preventDefault(); canal(1); }
      else if (e.key === "ArrowDown" && cheia) { e.preventDefault(); canal(-1); }
      else if (/^[1-9]$/.test(e.key)) irNum(Number(e.key));
      else if (e.key.toLowerCase() === "f") cheia ? fecharCheia() : abrirCheia();
      else if (e.key.toLowerCase() === "h") setMostrarCtl((m) => !m);
      else if (e.key === "Escape" && cheia) fecharCheia();
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });

  const mover = async (f: Fav, d: number) => {
    const i = doMes.indexOf(f), j = i + d;
    if (j < 0 || j >= doMes.length) return;
    const nova = [...doMes];
    [nova[i], nova[j]] = [nova[j], nova[i]];
    const comOrdem = nova.map((x, k) => ({ ...x, ordem: k }));
    setFavs((l) => l.map((x) => comOrdem.find((y) => y.id === x.id) ?? x));
    await Promise.all(comOrdem.map((x) => supabase().from("favoritos").update({ ordem: x.ordem }).eq("id", x.id)));
  };

  const palco = (
    <div className="palco">
      {ligada ? (
        <div key={`${escolhido}-${idx}`} className="palco-tela">
          {carregando ? <Cenario><div className="tl-intervalo"><span className="tx-cromo medio">sintonizando...</span></div></Cenario> : <TelaPrograma tela={atual} mes={escolhido} doMes={doMes} />}
        </div>
      ) : <div className="palco-desligada" />}
      {chiado && <div className="palco-chiado" />}
      {ligada && <span className="palco-canal">CH {String(meses.indexOf(escolhido) + 1).padStart(2, "0")} · {nomeMes(escolhido).slice(0, 3).toUpperCase()}</span>}
    </div>
  );

  const controle = (
    <Controle ligada={ligada} cheia={cheia} onPower={() => (cheia ? fecharCheia() : setLigada((l) => !l))} onCh={canal} onAnt={ant} onProx={prox} onMenu={irTop} onNum={irNum} onTelaCheia={cheia ? undefined : abrirCheia} onInicio={() => trocar(0)} onAleatorio={aleatorio} />
  );

  return (
    <div className="atv2">
      <div className="sala">
        <div className="tv2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/tv/tv.webp" alt="" draggable={false} />
          <div className="tv2-tela">{!cheia && palco}</div>
          <span className="tv2-marca">alana</span>
          <i className={`tv2-led ${ligada ? "on" : ""}`} />
        </div>
        <div className="sala-lado">
          {controle}
          <p className="dica-ctl">use o controle ou as setinhas do teclado. <b>ZOOM</b> no controle (ou a tecla <b>F</b>) abre a tela cheia pra gravar.</p>
        </div>
      </div>

      {/* lista do mês (pra organizar) */}
      <section className="grade-prog">
        <div className="grade-topo">
          <span className="tx-cromo pequeno">Programação</span>
          <div className="canais">
            {meses.map((m) => (
              <button key={m} className={m === escolhido ? "on" : ""} onClick={() => { setMes(m); setIdx(0); }}>{nomeMes(m).slice(0, 3)} {partes(m).a !== new Date().getFullYear() ? partes(m).a : ""}</button>
            ))}
          </div>
          {usuaria && <button className="btn-novo" onClick={() => setEditando({ mes: escolhido, categoria: CATEGORIAS_FAV[0], ordem: doMes.length })}><Plus size={16} /> novo favorito</button>}
        </div>
        {!doMes.length && <p className="grade-vazia">Nenhum favorito em {nomeMes(escolhido)} ainda.</p>}
        <ol className="grade-lista">
          {doMes.map((f, i) => (
            <li key={f.id} className={`barra cor${i % 3}`}>
              <span className="moeda">{i + 1}</span>
              <button className="barra-txt" onClick={() => irNum(i + 1)}>{f.titulo}{f.categoria && <small>{f.categoria}</small>}</button>
              {usuaria && (
                <span className="barra-edit">
                  <button onClick={() => mover(f, -1)} aria-label="subir"><ArrowUp size={14} /></button>
                  <button onClick={() => mover(f, 1)} aria-label="descer"><ArrowDown size={14} /></button>
                  <button onClick={() => setEditando(f)} aria-label="editar"><Pencil size={14} /></button>
                </span>
              )}
            </li>
          ))}
        </ol>
        {usuaria && doMes.length > 0 && <p className="grade-dica">o #1 é o mais amado: no programa a contagem vai do último até ele. Dica: no &quot;por que eu amei&quot;, cada linha vira uma estrelinha.</p>}
      </section>

      {/* tela cheia pra gravar */}
      {cheia && (
        <div ref={cheiaRef} className="tela-cheia" onClick={(e) => { if (!(e.target as HTMLElement).closest(".controle")) prox(); }}>
          {palco}
          {mostrarCtl && <div className="cheia-ctl">{controle}</div>}
          <button className="cheia-esconder" onClick={(e) => { e.stopPropagation(); setMostrarCtl((m) => !m); }}>{mostrarCtl ? "esconder controle (H)" : "mostrar controle"}</button>
          <span className="cheia-sair" onClick={(e) => { e.stopPropagation(); fecharCheia(); }}><Maximize2 size={14} /> sair (Esc)</span>
        </div>
      )}

      {editando && <EditarFav fav={editando} aoFechar={() => setEditando(null)} aoSalvar={() => { setEditando(null); carregar(); }} />}
    </div>
  );
}

function EditarFav({ fav, aoFechar, aoSalvar }: { fav: Partial<Fav>; aoFechar: () => void; aoSalvar: () => void }) {
  const [f, setF] = useState(fav);
  const [subindo, setSubindo] = useState(false);
  const [erro, setErro] = useState("");
  const set = (k: Partial<Fav>) => setF((x) => ({ ...x, ...k }));

  const subir = async (a?: File) => {
    if (!a) return;
    setSubindo(true);
    try { set({ capa: await subirFoto(a, "favoritos") }); } catch { setErro("Não consegui subir a foto."); }
    setSubindo(false);
  };
  const salvar = async () => {
    if (!f.titulo?.trim()) { setErro("Falta o nome!"); return; }
    const cat = f.categoria?.trim() || "outro";
    const dados = { titulo: f.titulo.trim(), capa: f.capa?.trim() || null, comentario: f.comentario?.trim() || null, mes: f.mes || mesAtual(), categoria: cat, tipo: cat, ordem: f.ordem ?? 0 };
    const sb = supabase().from("favoritos");
    const { error } = f.id ? await sb.update(dados).eq("id", f.id) : await sb.insert(dados);
    if (error) setErro("Não consegui salvar. Você rodou o SQL dos favoritos no Supabase?");
    else aoSalvar();
  };
  const apagar = async () => {
    if (!f.id || !confirm("Tirar esse favorito?")) return;
    await supabase().from("favoritos").delete().eq("id", f.id);
    aoSalvar();
  };

  return (
    <Modal titulo={f.id ? "editar_favorito.exe" : "novo_favorito.exe"} cor="azul" aoFechar={aoFechar}>
      <div className="spill-editor">
        <label>o que é?<input value={f.titulo ?? ""} onChange={(e) => set({ titulo: e.target.value })} placeholder="ex: Gloss rosinha" /></label>
        <div className="ed-linha">
          <label>categoria
            <input list="cats-fav" value={f.categoria ?? ""} onChange={(e) => set({ categoria: e.target.value })} />
            <datalist id="cats-fav">{CATEGORIAS_FAV.map((c) => <option key={c} value={c} />)}</datalist>
          </label>
          <label>mês<input type="month" value={f.mes ?? mesAtual()} onChange={(e) => set({ mes: e.target.value })} /></label>
        </div>
        <label className="ed-capa">
          foto (de preferência sem fundo ou com fundo branco)
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {f.capa && <img src={f.capa} alt="" />}
          <input type="file" accept="image/*" onChange={(e) => subir(e.target.files?.[0])} />
          {subindo && <small>subindo...</small>}
        </label>
        <label>ou cola o link da foto<input value={f.capa ?? ""} onChange={(e) => set({ capa: e.target.value })} placeholder="https://...jpg" /></label>
        <label>por que eu amei (cada linha vira uma estrelinha)<textarea rows={4} value={f.comentario ?? ""} onChange={(e) => set({ comentario: e.target.value })} placeholder={"dura o dia todo\nnão gruda\no cheirinho é de morango"} /></label>
        {erro && <p className="erro">{erro}</p>}
        <div className="ed-botoes">
          {f.id && <button className="ed-rascunho" onClick={apagar}>apagar</button>}
          <button className="ed-publicar" onClick={salvar}>salvar</button>
        </div>
      </div>
    </Modal>
  );
}
