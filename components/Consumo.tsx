"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BookOpen, Clapperboard, ExternalLink, MonitorPlay, Music2, Pause, Pencil, Play, Plus } from "lucide-react";
import { supabase, subirFoto } from "@/lib/supabase";
import { paraEmbed } from "@/lib/embed";
import { useSessao } from "./Sessao";
import Modal from "./Modal";

type Coisa = { id: string; tipo: string; titulo: string; detalhe: string | null; link: string | null; capa: string | null; comentario: string | null; status: string | null; atual: boolean; criado_em: string };

const ABAS = [
  { id: "ouvindo", nome: "Tocando agora", tipos: ["musica"], icone: Music2 },
  { id: "vendo", nome: "Assistindo", tipos: ["serie", "filme"], icone: Clapperboard },
  { id: "lendo", nome: "Lendo", tipos: ["livro"], icone: BookOpen },
  { id: "yt", nome: "YouTube & podcasts", tipos: ["video", "podcast"], icone: MonitorPlay },
] as const;
const TIPOS = [
  { id: "musica", nome: "música", detalhe: "artista" },
  { id: "serie", nome: "série", detalhe: "onde assiste (Netflix, Max...)" },
  { id: "filme", nome: "filme", detalhe: "ano ou diretor" },
  { id: "livro", nome: "livro", detalhe: "autor(a)" },
  { id: "video", nome: "YouTube", detalhe: "canal" },
  { id: "podcast", nome: "podcast", detalhe: "quem apresenta" },
];
const nomeTipo = (t: string) => TIPOS.find((x) => x.id === t)?.nome ?? t;

export default function Consumo() {
  const { usuaria } = useSessao();
  const [coisas, setCoisas] = useState<Coisa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [aba, setAba] = useState<(typeof ABAS)[number]["id"]>("ouvindo");
  const [sel, setSel] = useState(0);
  const [tocando, setTocando] = useState(false);
  const [editando, setEditando] = useState<Partial<Coisa> | null>(null);

  const carregar = useCallback(async () => {
    const { data, error } = await supabase().from("consumo").select("*").order("criado_em", { ascending: false });
    if (error) setErro("Não consegui carregar agora.");
    else setCoisas(((data ?? []) as Coisa[]).map((c) => ({ ...c, atual: c.atual ?? true })));
    setCarregando(false);
  }, []);
  useEffect(() => { carregar(); }, [carregar, usuaria]);

  // escuta o iPod pra saber se tá tocando
  useEffect(() => {
    const ouvir = (e: Event) => setTocando(!!(e as CustomEvent<{ tocando: boolean }>).detail?.tocando);
    window.addEventListener("bts:mp3-estado", ouvir);
    window.dispatchEvent(new CustomEvent("bts:mp3", { detail: "estado" }));
    return () => window.removeEventListener("bts:mp3-estado", ouvir);
  }, []);

  const abaAtual = ABAS.find((a) => a.id === aba)!;
  const daAba = useMemo(() => coisas.filter((c) => (abaAtual.tipos as readonly string[]).includes(c.tipo)), [coisas, abaAtual]);
  const agora = daAba.filter((c) => c.atual);
  const historico = daAba.filter((c) => !c.atual);
  const lista = [...agora, ...historico];
  const atual = lista.length ? lista[((sel % lista.length) + lista.length) % lista.length] : null;

  const trocarAba = (a: typeof aba) => { setAba(a); setSel(0); };
  const tocarNoIpod = (c: Coisa | null) => {
    if (!c?.link || !paraEmbed(c.link)) return false;
    window.dispatchEvent(new CustomEvent("bts:mp3", { detail: { tocar: { nome: `${c.titulo}${c.detalhe ? " - " + c.detalhe : ""}`, url: c.link } } }));
    return true;
  };
  const play = () => {
    if (!tocando && tocarNoIpod(atual)) return;
    window.dispatchEvent(new CustomEvent("bts:mp3", { detail: "play" }));
  };

  return (
    <div className="wmp-pagina">
      <div className="wmp-rolagem">
      <div className="wmp2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="wmp2-moldura" src="/aero/wmp.webp" alt="" draggable={false} />
        <span className="wmp2-nome">Alana Media Player</span>

        <nav className="wmp2-abas">
          {ABAS.map((a) => (
            <button key={a.id} className={a.id === aba ? "ativa" : ""} onClick={() => trocarAba(a.id)}>{a.nome}</button>
          ))}
          {usuaria && <button className="wmp2-add" onClick={() => setEditando({ tipo: abaAtual.tipos[0], atual: true })}><Plus size={12} /> adicionar</button>}
        </nav>

        {carregando || erro ? (
          <div className="wmp2-palco"><p className="wmp2-aviso">{erro || "carregando biblioteca..."}</p></div>
        ) : aba === "ouvindo" ? (
          <>
            <div className="wmp2-palco">
              <div className={`wmp-vis ${tocando ? "on" : ""}`} aria-hidden>
                {Array.from({ length: 30 }).map((_, k) => <i key={k} style={{ animationDelay: `${-(k * 137) % 900}ms`, animationDuration: `${600 + ((k * 211) % 700)}ms` }} />)}
              </div>
              {atual ? (
                <div className="wmp2-capa">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {atual.capa ? <img src={atual.capa} alt="" /> : <span className="sem-capa"><Music2 /></span>}
                  <div className="wmp2-info">
                    <b>{atual.titulo}</b>
                    <span>{atual.detalhe}</span>
                    {atual.status && <em>{atual.status}</em>}
                    {atual.comentario && <p>&ldquo;{atual.comentario}&rdquo;</p>}
                  </div>
                </div>
              ) : <p className="wmp2-aviso">nenhuma música por aqui ainda</p>}
            </div>
            <aside className="wmp2-lista">
              <p className="wmp2-lista-tit">Now Playing <small>{lista.length} itens</small></p>
              {lista.map((c, k) => (
                <button key={c.id} className={`${c === atual ? "sel" : ""} ${c.atual ? "" : "antiga"}`} onClick={() => setSel(k)} onDoubleClick={() => tocarNoIpod(c)}>
                  <span className="pl-txt"><b>{c.titulo}</b><small>{c.detalhe}</small></span>
                  {usuaria && <Pencil className="pl-editar" onClick={(e) => { e.stopPropagation(); setEditando(c); }} />}
                </button>
              ))}
              {!lista.length && <p className="wmp-vazio">Drag items here</p>}
            </aside>
          </>
        ) : (
          <div className="wmp2-biblio">
            {[["agora", agora], ["já foi", historico]].map(([nome, itens]) =>
              (itens as Coisa[]).length ? (
                <section key={nome as string}>
                  <p className="wmp2-secao">{nome as string}</p>
                  <div className="wmp2-grade">
                    {(itens as Coisa[]).map((c) => (
                      <div key={c.id} className={`wmp2-card ${c === atual ? "sel" : ""}`} onClick={() => setSel(lista.indexOf(c))}>
                        <div className="card-capa">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          {c.capa ? <img src={c.capa} alt="" /> : <span className="sem-capa"><abaAtual.icone /></span>}
                          {c.status && <span className="card-status">{c.status}</span>}
                        </div>
                        <b>{c.titulo}</b>
                        <small>{[nomeTipo(c.tipo), c.detalhe].filter(Boolean).join(" · ")}</small>
                        {c.comentario && <p>&ldquo;{c.comentario}&rdquo;</p>}
                        <span className="card-acoes">
                          {c.link && <a href={c.link} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>abrir <ExternalLink /></a>}
                          {(c.tipo === "podcast" || c.tipo === "video") && c.link && paraEmbed(c.link) ? <button onClick={(e) => { e.stopPropagation(); tocarNoIpod(c); }}><Play /> no iPod</button> : null}
                          {usuaria && <button onClick={(e) => { e.stopPropagation(); setEditando(c); }}><Pencil /></button>}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null,
            )}
            {!lista.length && <p className="wmp2-aviso escuro">nada por aqui ainda</p>}
          </div>
        )}

        <div className="wmp2-tocando"><b>{atual?.titulo ?? ""}</b><small>{atual?.detalhe ?? ""}</small></div>

        {/* botões de verdade em cima dos botões da foto */}
        <button className="wb b-shuffle" aria-label="aleatório" onClick={() => lista.length && setSel(Math.floor(Math.random() * lista.length))} />
        <button className="wb b-stop" aria-label="parar" onClick={() => tocando && window.dispatchEvent(new CustomEvent("bts:mp3", { detail: "play" }))} />
        <button className="wb b-prev" aria-label="anterior" onClick={() => setSel((x) => x - 1)} />
        <button className={`wb b-play ${tocando ? "pausar" : ""}`} aria-label="tocar" onClick={play}>{tocando && <Pause fill="currentColor" />}</button>
        <button className="wb b-next" aria-label="próximo" onClick={() => setSel((x) => x + 1)} />
      </div>
      </div>
      {aba === "ouvindo" && <p className="wmp-dica">o play toca a música selecionada no iPod (se tiver link do Spotify ou YouTube). Clique duas vezes numa música da lista também funciona.</p>}

      {editando && <EditarCoisa coisa={editando} aoFechar={() => setEditando(null)} aoSalvar={() => { setEditando(null); carregar(); }} />}
    </div>
  );
}

function EditarCoisa({ coisa, aoFechar, aoSalvar }: { coisa: Partial<Coisa>; aoFechar: () => void; aoSalvar: () => void }) {
  const [c, setC] = useState(coisa);
  const [subindo, setSubindo] = useState(false);
  const [erro, setErro] = useState("");
  const set = (k: Partial<Coisa>) => setC((x) => ({ ...x, ...k }));
  const tipo = TIPOS.find((t) => t.id === c.tipo) ?? TIPOS[0];

  const subir = async (f?: File) => {
    if (!f) return;
    setSubindo(true);
    try { set({ capa: await subirFoto(f, "consumo") }); } catch { setErro("Não consegui subir a foto."); }
    setSubindo(false);
  };
  const salvar = async () => {
    if (!c.titulo?.trim()) { setErro("Falta o nome!"); return; }
    const dados = { tipo: c.tipo, titulo: c.titulo.trim(), detalhe: c.detalhe?.trim() || null, link: c.link?.trim() || null, capa: c.capa?.trim() || null, comentario: c.comentario?.trim() || null, status: c.status?.trim() || null, atual: c.atual ?? true };
    const sb = supabase().from("consumo");
    const { error } = c.id ? await sb.update(dados).eq("id", c.id) : await sb.insert(dados);
    if (error) setErro("Não consegui salvar. Você rodou o SQL dessa página no Supabase?");
    else aoSalvar();
  };
  const apagar = async () => {
    if (!c.id || !confirm("Apagar?")) return;
    await supabase().from("consumo").delete().eq("id", c.id);
    aoSalvar();
  };

  return (
    <Modal titulo={c.id ? "editar.exe" : "adicionar.exe"} cor="azul" aoFechar={aoFechar}>
      <div className="spill-editor">
        <div className="ed-linha">
          <label>o que é?
            <select value={c.tipo} onChange={(e) => set({ tipo: e.target.value })}>
              {TIPOS.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </select>
          </label>
          <label>nome<input value={c.titulo ?? ""} onChange={(e) => set({ titulo: e.target.value })} /></label>
        </div>
        <div className="ed-linha">
          <label>{tipo.detalhe}<input value={c.detalhe ?? ""} onChange={(e) => set({ detalhe: e.target.value })} /></label>
          <label>status<input value={c.status ?? ""} onChange={(e) => set({ status: e.target.value })} placeholder={c.tipo === "serie" ? "ex: T2 E5" : c.tipo === "livro" ? "ex: pág. 120" : "ex: no repeat"} /></label>
        </div>
        <label>link (Spotify, YouTube, Netflix...)<input value={c.link ?? ""} onChange={(e) => set({ link: e.target.value })} placeholder="https://..." /></label>
        <label className="ed-capa">
          capa
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {c.capa && <img src={c.capa} alt="" />}
          <input type="file" accept="image/*" onChange={(e) => subir(e.target.files?.[0])} />
          {subindo && <small>subindo...</small>}
        </label>
        <label>ou cola o link da capa<input value={c.capa ?? ""} onChange={(e) => set({ capa: e.target.value })} placeholder="https://...jpg" /></label>
        <label>o que eu tô achando<textarea rows={2} value={c.comentario ?? ""} onChange={(e) => set({ comentario: e.target.value })} /></label>
        <label className="ed-check"><input type="checkbox" checked={c.atual ?? true} onChange={(e) => set({ atual: e.target.checked })} /> ainda tô nessa (desmarca quando terminar, aí vai pro "já foi")</label>
        {erro && <p className="erro">{erro}</p>}
        <div className="ed-botoes">
          {c.id && <button className="ed-rascunho" onClick={apagar}>apagar</button>}
          <button className="ed-publicar" onClick={salvar}>salvar</button>
        </div>
      </div>
    </Modal>
  );
}
