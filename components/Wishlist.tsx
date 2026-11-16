"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Pencil, Plus } from "lucide-react";
import { supabase, subirFoto } from "@/lib/supabase";
import { useSessao } from "./Sessao";
import Modal from "./Modal";
import Recorte from "./Recorte";
import { SITE } from "@/config/site";
import { NOTINHAS, REVISTA, SECOES } from "@/config/wishlist";

type Item = { id: string; nome: string; foto: string | null; preco: number | null; link: string | null; prioridade: number; categoria: string | null; comprado: boolean; criado_em: string };
type Pagina =
  | { tipo: "capa" }
  | { tipo: "indice" }
  | { tipo: "abertura"; secao: (typeof SECOES)[number] }
  | { tipo: "itens"; secao: (typeof SECOES)[number]; itens: Item[]; parte: number }
  | { tipo: "comprei" }
  | { tipo: "anuncio" }
  | { tipo: "fim" };

const POR_PAGINA = 3;
const ENFEITES = ["estrela-pink", "borboleta", "boca-rosa", "estrela-glitter", "cerejas2", "coracao-fogo", "estrela-neon", "borboleta-roxa"];
const RODAPES = ["peças-chave da temporada", "aprovado pela redação", "lista oficial de desejos", "o carrinho agradece", "tendência certa"];
const real = (n: number | null) => (n == null ? "" : n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }));
const hash = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const secaoDe = (cat: string | null) => SECOES.find((s) => s.id === cat) ?? SECOES[SECOES.length - 1];

export default function Wishlist() {
  const { usuaria } = useSessao();
  const [itens, setItens] = useState<Item[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [folha, setFolha] = useState(0); // PC: quantas folhas já viraram | celular: página atual
  const [celular, setCelular] = useState(false);
  const [virando, setVirando] = useState<"" | "frente" | "tras">("");
  const [animando, setAnimando] = useState(-1); // folha que está virando agora fica por cima
  const [editando, setEditando] = useState<Partial<Item> | null>(null);

  const carregar = useCallback(async () => {
    const { data, error } = await supabase().from("wishlist").select("*").order("criado_em", { ascending: false });
    if (error) setErro("Não consegui carregar a wishlist agora.");
    else setItens((data ?? []) as Item[]);
    setCarregando(false);
  }, []);
  useEffect(() => { carregar(); }, [carregar, usuaria]);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const f = () => setCelular(mq.matches);
    f();
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);

  // monta as páginas da revista
  const paginas = useMemo<Pagina[]>(() => {
    const ps: Pagina[] = [{ tipo: "capa" }, { tipo: "indice" }];
    for (const s of SECOES) {
      const daSecao = itens.filter((i) => secaoDe(i.categoria).id === s.id && !i.comprado);
      if (!daSecao.length) continue;
      ps.push({ tipo: "abertura", secao: s });
      for (let k = 0; k < daSecao.length; k += POR_PAGINA) ps.push({ tipo: "itens", secao: s, itens: daSecao.slice(k, k + POR_PAGINA), parte: k / POR_PAGINA });
    }
    if (itens.some((i) => i.comprado)) ps.push({ tipo: "comprei" });
    if (ps.length % 2 === 0) ps.push({ tipo: "anuncio" }); // pra contracapa cair certinho no verso
    ps.push({ tipo: "fim" });
    return ps;
  }, [itens]);

  const totalFolhas = Math.ceil(paginas.length / 2);
  const max = celular ? paginas.length - 1 : totalFolhas;
  const ir = (d: number) => {
    const alvo = Math.max(0, Math.min(max, folha + d));
    if (alvo === folha) return;
    if (celular) {
      setVirando(d > 0 ? "frente" : "tras");
      setTimeout(() => { setFolha(alvo); setVirando(""); }, 380);
    } else {
      setAnimando(d > 0 ? folha : alvo);
      setFolha(alvo);
      setTimeout(() => setAnimando(-1), 1000);
    }
  };
  const irPara = (pagina: number) => setFolha(celular ? pagina : Math.ceil(pagina / 2));

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("input, textarea, select")) return;
      if (e.key === "ArrowRight") ir(1);
      if (e.key === "ArrowLeft") ir(-1);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });

  const marcarComprei = async (it: Item) => {
    setItens((l) => l.map((x) => (x.id === it.id ? { ...x, comprado: !x.comprado } : x)));
    await supabase().from("wishlist").update({ comprado: !it.comprado }).eq("id", it.id);
  };

  const indicePagina = (secao: string) => paginas.findIndex((p) => p.tipo === "abertura" && p.secao.id === secao);

  const desenhar = (p: Pagina, n: number) => (
    <PaginaRevista key={n} p={p} n={n} itens={itens} usuaria={!!usuaria} carregando={carregando} erro={erro}
      irPara={irPara} indicePagina={indicePagina} aoEditar={setEditando} aoComprei={marcarComprei} />
  );

  return (
    <div className="wish">
      <div className="wish-topo">
        <p>clica nas setinhas ou nos cantos da página pra folhear</p>
        {usuaria && <button onClick={() => setEditando({ prioridade: 2, comprado: false, categoria: SECOES[0].id })}><Plus size={16} /> adicionar desejo</button>}
      </div>

      {celular ? (
        <div className="revista-cel">
          <div className={`folha-cel ${virando}`}>{desenhar(paginas[Math.min(folha, paginas.length - 1)], Math.min(folha, paginas.length - 1))}</div>
        </div>
      ) : (
        <div className={`revista-livro ${folha === 0 ? "fechada" : folha >= totalFolhas ? "fechada-fim" : ""}`}>
          {Array.from({ length: totalFolhas }).map((_, k) => {
            const virada = k < folha;
            return (
              <div key={k} className={`folha-livro ${virada ? "virada" : ""}`} style={{ zIndex: k === animando ? 999 : virada ? k + 1 : totalFolhas - k }}>
                <div className="lado frente" onClick={() => !virada && ir(1)}>{paginas[2 * k] && desenhar(paginas[2 * k], 2 * k)}</div>
                <div className="lado verso" onClick={() => virada && ir(-1)}>{paginas[2 * k + 1] && desenhar(paginas[2 * k + 1], 2 * k + 1)}</div>
              </div>
            );
          })}
        </div>
      )}

      <div className="wish-setas">
        <button onClick={() => ir(-1)} disabled={folha === 0} aria-label="voltar página"><ChevronLeft /></button>
        <span>{celular ? `${folha + 1} / ${paginas.length}` : folha === 0 ? "capa" : folha >= totalFolhas ? "contracapa" : `pág. ${2 * folha} e ${2 * folha + 1}`}</span>
        <button onClick={() => ir(1)} disabled={folha >= max} aria-label="próxima página"><ChevronRight /></button>
      </div>

      {editando && <EditarItem item={editando} aoFechar={() => setEditando(null)} aoSalvar={() => { setEditando(null); carregar(); }} />}
    </div>
  );
}

// ---------- cada página ----------
function PaginaRevista({ p, n, itens, usuaria, carregando, erro, irPara, indicePagina, aoEditar, aoComprei }: {
  p: Pagina; n: number; itens: Item[]; usuaria: boolean; carregando: boolean; erro: string;
  irPara: (n: number) => void; indicePagina: (s: string) => number; aoEditar: (i: Item) => void; aoComprei: (i: Item) => void;
}) {
  const hoje = new Date();
  const pendentes = itens.filter((i) => !i.comprado);
  const pare = (e: React.MouseEvent) => e.stopPropagation();

  if (p.tipo === "capa")
    return (
      <div className="pg pg-capa">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="capa-fundo" src={SITE.foto} alt="" />
        <p className="capa-mes">{MESES[hoje.getMonth()]} {hoje.getFullYear()} · edição desejos</p>
        <h1 className="capa-nome">{REVISTA.titulo}</h1>
        <div className="capa-linhas esq">
          <p><b>{pendentes.length}</b> desejos</p>
          <p className="fina">{REVISTA.chamadas[0]}<br />{REVISTA.chamadas[1]}</p>
        </div>
        <div className="capa-linhas dir">
          {SECOES.filter((s) => pendentes.some((i) => secaoDe(i.categoria).id === s.id)).slice(0, 3).map((s) => (
            <p key={s.id}><b>especial</b> {s.nome.toLowerCase()}</p>
          ))}
        </div>
        <p className="capa-wish">the<br />wishlist<br />issue</p>
        <div className="capa-preco">{REVISTA.preco}</div>
      </div>
    );

  if (p.tipo === "indice")
    return (
      <div className="pg pg-indice">
        <Recorte texto="nesta edicao" altura={46} semente={2} />
        {carregando ? <p className="pg-aviso">carregando...</p> : erro ? <p className="pg-aviso">{erro}</p> : null}
        <ol>
          {SECOES.map((s) => {
            const i = indicePagina(s.id);
            if (i < 0) return null;
            return (
              <li key={s.id} onClick={(e) => { pare(e); irPara(i); }}>
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <span className="nome">{s.nome}</span>
                <span className="qtd">{pendentes.filter((x) => secaoDe(x.categoria).id === s.id).length} itens</span>
              </li>
            );
          })}
        </ol>
        {!carregando && !pendentes.length && <p className="pg-aviso">A wishlist tá vazia... {usuaria ? "adiciona o primeiro desejo lá em cima!" : "por enquanto!"}</p>}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ind-ad a1" src="/revista/adesivos/gloss.webp" alt="" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ind-ad a2" src="/revista/adesivos/estrela-pink.webp" alt="" />
        <p className="pg-num">{n + 1}</p>
      </div>
    );

  if (p.tipo === "abertura")
    return (
      <div className={`pg pg-abertura c${SECOES.indexOf(p.secao) % 4}`}>
        <p className="ab-tag">especial</p>
        <Recorte texto={p.secao.nome} altura={58} semente={SECOES.indexOf(p.secao)} />
        <p className="ab-texto">{p.secao.texto}</p>
        <p className="ab-assina">por Alana</p>
        <p className="pg-num">{n + 1}</p>
      </div>
    );

  if (p.tipo === "itens")
    return (
      <div className={`pg pg-itens c${SECOES.indexOf(p.secao) % 4}`}>
        <p className="it-cabeca">{p.secao.nome.toLowerCase()} {p.parte > 0 && <small>(continuação)</small>}</p>
        <div className="it-lista">
          {p.itens.map((it, k) => (
            <div key={it.id} className={`it ${k % 2 ? "inv" : ""}`}>
              <div className="it-foto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {it.foto ? <img src={it.foto} alt="" /> : <span>sem foto</span>}
                {it.preco != null && <span className="it-preco">{real(it.preco)}</span>}
              </div>
              <div className="it-info">
                <span className="it-nota">{NOTINHAS[hash(it.id) % NOTINHAS.length]}</span>
                <b>{it.nome}</b>
                <span className="it-acoes" onClick={pare}>
                  {it.link && <a href={it.link} target="_blank" rel="noreferrer">quero! <ExternalLink size={12} /></a>}
                  {usuaria && <button onClick={() => aoComprei(it)}>comprei!</button>}
                  {usuaria && <button onClick={() => aoEditar(it)} aria-label="editar"><Pencil size={12} /></button>}
                </span>
              </div>
            </div>
          ))}
          {p.itens.length < POR_PAGINA && (
            <div className="it-vaga">
              <span>espaço reservado pro<br /><b>próximo desejo</b></span>
            </div>
          )}
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="it-ad" src={`/revista/adesivos/${ENFEITES[(n + p.parte) % ENFEITES.length]}.webp`} alt="" />
        <p className="it-rodape">{RODAPES[n % RODAPES.length]}</p>
        <p className="pg-num">{n + 1}</p>
      </div>
    );

  if (p.tipo === "comprei") {
    const comprados = itens.filter((i) => i.comprado);
    return (
      <div className="pg pg-comprei">
        <Recorte texto="ja e meu" altura={50} semente={5} />
        <p className="cp-sub">desejos realizados</p>
        <div className="cp-grade">
          {comprados.length ? comprados.map((it) => (
            <div key={it.id} className="cp-item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {it.foto ? <img src={it.foto} alt="" /> : <span className="cp-sem">{it.nome}</span>}
              <span className="carimbo">COMPREI!</span>
              <small>{it.nome}</small>
              {usuaria && <button onClick={(e) => { pare(e); aoComprei(it); }}>desfazer</button>}
            </div>
          )) : <p className="pg-aviso">Ainda nada... mas logo logo!</p>}
        </div>
        <p className="pg-num">{n + 1}</p>
      </div>
    );
  }

  if (p.tipo === "anuncio")
    return (
      <div className="pg pg-anuncio">
        <p className="an-tag">publicidade</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/revista/adesivos/celular-flip.webp" alt="" className="an-cel" />
        <p className="an-txt">segue lá no insta<br /><b>@{SITE.instagram}</b></p>
        <p className="an-mini">bastidores, looks e muito glitter</p>
        <p className="pg-num">{n + 1}</p>
      </div>
    );

  return (
    <div className="pg pg-fim">
      <p className="fim-txt">continua na<br /><b>próxima edição</b></p>
      <p className="fim-ig">@{SITE.instagram}</p>
      <div className="fim-barras" aria-hidden />
    </div>
  );
}

// ---------- adicionar / editar ----------
function EditarItem({ item, aoFechar, aoSalvar }: { item: Partial<Item>; aoFechar: () => void; aoSalvar: () => void }) {
  const [it, setIt] = useState(item);
  const [preco, setPreco] = useState(item.preco != null ? String(item.preco).replace(".", ",") : "");
  const [subindo, setSubindo] = useState(false);
  const [erro, setErro] = useState("");
  const set = (k: Partial<Item>) => setIt((x) => ({ ...x, ...k }));

  const subir = async (f?: File) => {
    if (!f) return;
    setSubindo(true);
    try { set({ foto: await subirFoto(f, "wishlist") }); } catch { setErro("Não consegui subir a foto."); }
    setSubindo(false);
  };
  const salvar = async () => {
    if (!it.nome?.trim()) { setErro("Falta o nome!"); return; }
    const n = parseFloat(preco.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", "."));
    const dados = { nome: it.nome.trim(), foto: it.foto || null, preco: isNaN(n) ? null : n, link: it.link?.trim() || null, categoria: it.categoria, comprado: !!it.comprado, prioridade: it.prioridade ?? 2 };
    const sb = supabase().from("wishlist");
    const { error } = it.id ? await sb.update(dados).eq("id", it.id) : await sb.insert(dados);
    if (error) setErro("Não consegui salvar.");
    else aoSalvar();
  };
  const apagar = async () => {
    if (!it.id || !confirm("Tirar esse item da wishlist?")) return;
    await supabase().from("wishlist").delete().eq("id", it.id);
    aoSalvar();
  };

  return (
    <Modal titulo={it.id ? "editar_desejo.exe" : "novo_desejo.exe"} cor="rosa" aoFechar={aoFechar}>
      <div className="spill-editor">
        <label>o que é?<input value={it.nome ?? ""} onChange={(e) => set({ nome: e.target.value })} placeholder="ex: calça flare jeans" /></label>
        <div className="ed-linha">
          <label>preço<input value={preco} onChange={(e) => setPreco(e.target.value)} placeholder="ex: 129,90" inputMode="decimal" /></label>
          <label>seção
            <select value={it.categoria ?? ""} onChange={(e) => set({ categoria: e.target.value })}>
              {SECOES.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}
            </select>
          </label>
        </div>
        <label>link da loja<input value={it.link ?? ""} onChange={(e) => set({ link: e.target.value })} placeholder="https://..." /></label>
        <label className="ed-capa">
          foto (de preferência com fundo branco ou sem fundo)
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {it.foto && <img src={it.foto} alt="" />}
          <input type="file" accept="image/*" onChange={(e) => subir(e.target.files?.[0])} />
          {subindo && <small>subindo...</small>}
        </label>
        <label>ou cola o link da foto<input value={it.foto ?? ""} onChange={(e) => set({ foto: e.target.value })} placeholder="https://...jpg" /></label>
        {it.id && <label className="ed-check"><input type="checkbox" checked={!!it.comprado} onChange={(e) => set({ comprado: e.target.checked })} /> já comprei</label>}
        {erro && <p className="erro">{erro}</p>}
        <div className="ed-botoes">
          {it.id && <button className="ed-rascunho" onClick={apagar}>apagar</button>}
          <button className="ed-publicar" onClick={salvar}>salvar</button>
        </div>
      </div>
    </Modal>
  );
}
