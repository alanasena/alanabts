"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Brain, Camera, ChevronLeft, ChevronRight, House, Mail, Users, Flame, Frown, Heart, ImagePlus, Laugh, Moon, Music, Pencil, Pizza, Smile, Sparkles, Trash2, Tv, Zap,
  type LucideIcon,
} from "lucide-react";
import { supabase, subirFoto } from "@/lib/supabase";
import { useSessao } from "./Sessao";
import Modal from "./Modal";
import { SITE } from "@/config/site";
import { BLOG, CATEGORIAS, FATOS, HUMORES } from "@/config/blog";

export type Post = {
  id: string;
  titulo: string;
  conteudo: string;
  capa: string | null;
  criado_em: string;
  tipo: "post" | "update";
  categoria: string | null;
  tags: string[];
  humor: string | null;
  ouvindo: string | null;
  publicado: boolean;
};

const ICONES: Record<string, LucideIcon> = {
  sorriso: Smile, raio: Zap, coracao: Heart, risada: Laugh, brilho: Sparkles, pensando: Brain,
  sono: Moon, fogo: Flame, triste: Frown, pizza: Pizza, musica: Music, tv: Tv,
};

function IconeHumor({ humor }: { humor: string | null }) {
  const h = HUMORES.find((x) => x.id === humor);
  const I = ICONES[h?.icone ?? "sorriso"] ?? Smile;
  return <span className="humor-bola"><I size={16} strokeWidth={2.4} /></span>;
}

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
function quando(iso: string) {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}-${MESES[d.getMonth()]}-${String(d.getFullYear()).slice(2)}  ${p(d.getHours())}:${p(d.getMinutes())}`;
}

const FOTO_RE = /^!\[[^\]]*\]\((\S+)\)$/;
function resumo(txt: string, n = 170) {
  const limpo = txt.split(/\n+/).filter((l) => !FOTO_RE.test(l.trim())).join(" ").trim();
  return limpo.length > n ? limpo.slice(0, n).trimEnd() + "..." : limpo;
}
function contarFotos(p: Post) {
  return p.conteudo.split("\n").filter((l) => FOTO_RE.test(l.trim())).length + (p.capa ? 1 : 0);
}
function Conteudo({ texto }: { texto: string }) {
  return (
    <div className="spill-texto">
      {texto.split(/\n\s*\n/).map((bloco, i) => {
        const b = bloco.trim();
        const m = b.match(FOTO_RE);
        if (m)
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={m[1]} alt="" className="spill-foto-meio" />
          );
        return b ? <p key={i}>{b}</p> : null;
      })}
    </div>
  );
}

function Aba({ children, setas }: { children: React.ReactNode; setas?: [() => void, () => void] }) {
  return (
    <div className="spill-aba">
      <h2><small>the</small>{children}</h2>
      {setas && (
        <span className="spill-setas">
          <button onClick={setas[0]} aria-label="anterior"><ChevronLeft size={16} strokeWidth={3} /></button>
          <button onClick={setas[1]} aria-label="próximo"><ChevronRight size={16} strokeWidth={3} /></button>
        </span>
      )}
    </div>
  );
}

const VAZIO: Omit<Post, "id" | "criado_em"> = { titulo: "", conteudo: "", capa: null, tipo: "post", categoria: "dia-a-dia", tags: [], humor: "feliz", ouvindo: "", publicado: true };

export default function Blog() {
  const router = useRouter();
  const params = useSearchParams();
  const { usuaria, sair } = useSessao();
  const [posts, setPosts] = useState<Post[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [editando, setEditando] = useState<(Partial<Post> & typeof VAZIO) | null>(null);
  const [destaque, setDestaque] = useState(0);
  const [fato, setFato] = useState(0);
  const [busca, setBusca] = useState(params.get("q") ?? "");

  const postId = params.get("post");
  const cat = params.get("cat");
  const tag = params.get("tag");
  const q = params.get("q");

  const carregar = useCallback(async () => {
    const { data, error } = await supabase().from("blog_posts").select("*").order("criado_em", { ascending: false });
    if (error) setErro("Não consegui carregar os posts agora.");
    else setPosts(((data ?? []) as Post[]).map((p) => ({ ...p, tags: p.tags ?? [], tipo: p.tipo ?? "post", publicado: p.publicado ?? true })));
    setCarregando(false);
  }, []);
  useEffect(() => { carregar(); }, [carregar, usuaria]);
  useEffect(() => { setFato(new Date().getDate() % FATOS.length); }, []);

  const ir = (q: Record<string, string>) => {
    const s = new URLSearchParams(q).toString();
    router.push(s ? `/blog?${s}` : "/blog");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const grandes = posts.filter((p) => p.tipo === "post");
  const novidades = grandes.slice(0, 5);
  const ultimoUpdate = posts[0];
  const atual = postId ? posts.find((p) => p.id === postId) : null;
  const filtrados = useMemo(() => {
    const t = q?.toLowerCase();
    return posts.filter((p) =>
      (!cat || p.categoria === cat) &&
      (!tag || p.tags.includes(tag)) &&
      (!t || `${p.titulo} ${p.conteudo} ${p.tags.join(" ")}`.toLowerCase().includes(t)),
    );
  }, [posts, cat, tag, q]);
  const todasTags = useMemo(() => [...new Set(posts.flatMap((p) => p.tags))].sort(), [posts]);
  const ouvindo = posts.filter((p) => p.ouvindo).slice(0, 4);

  const apagar = async (id: string) => {
    if (!confirm("Apagar esse post?")) return;
    await supabase().from("blog_posts").delete().eq("id", id);
    ir({});
    carregar();
  };

  const nomeCat = (id: string | null) => CATEGORIAS.find((c) => c.id === id)?.nome ?? "";

  return (
    <div className="spill">
      {/* ---------- topo ---------- */}
      <header className="spill-topo">
        <button className="spill-logo" onClick={() => ir({})} aria-label="início do blog">
          <span className="spill-estouro" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="spill-simbolo" src="/revista/adesivos/celular-flip.webp" alt="" />
          <span className="spill-the">the</span>
          <span className="spill-nome">{BLOG.nome}</span>
          <span className="spill-slogan">{BLOG.slogan[0]} <b>{BLOG.slogan[1]}</b> {BLOG.slogan[2]}</span>
        </button>
        <div className="spill-barra">
          <nav className="spill-menu">
            <button className={!cat && !postId && !tag && !q ? "ativo" : ""} onClick={() => ir({})}>HOME</button>
            {CATEGORIAS.map((c) => (
              <button key={c.id} className={cat === c.id ? "ativo" : ""} onClick={() => ir({ cat: c.id })}>{c.id === "dia-a-dia" ? "DIA A DIA" : c.id === "faculdade" ? "FACUL" : c.nome.split(" ")[0].toUpperCase()}</button>
            ))}
          </nav>
          <form className="spill-busca" onSubmit={(e) => { e.preventDefault(); ir(busca.trim() ? { q: busca.trim() } : {}); }}>
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="buscar" />
            <button>GO</button>
          </form>
        </div>
        <div className="spill-login">
          {usuaria ? (
            <>
              <button onClick={() => setEditando({ ...VAZIO })}>+ postar</button>
              <button onClick={() => setEditando({ ...VAZIO, tipo: "update" })}>+ update</button>
              <button onClick={sair}>sair</button>
            </>
          ) : (
            <a href="/entrar">Login</a>
          )}
        </div>
        <svg className="spill-redemoinho" viewBox="0 0 80 80" aria-hidden>
          <path d="M40 70c-18 0-28-14-22-28s26-14 28-2-12 14-16 6" fill="none" stroke="#ff4fa3" strokeWidth="7" strokeLinecap="round" />
          <path d="M44 66c20-2 30-20 22-34S40 16 34 26" fill="none" stroke="#2bb6e8" strokeWidth="6" strokeLinecap="round" />
          <path d="M30 12c10-8 26-6 32 4" fill="none" stroke="#ffd23d" strokeWidth="6" strokeLinecap="round" />
          <path d="M14 34c-6-10 0-22 10-24" fill="none" stroke="#9ad13a" strokeWidth="5" strokeLinecap="round" />
        </svg>
      </header>

      <div className="spill-caixa">
        {/* ---------- the RIGHT NOW ---------- */}
        <aside className="right-now">
          <h2 className="grafite"><small>THE</small>RIGHT NOW</h2>
          <div className="rn-card">
            <div className="rn-topo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={SITE.foto} alt="" />
              <div>
                <span className="rn-data">{ultimoUpdate ? quando(ultimoUpdate.criado_em) : "--"}</span>
                <b>Alana&apos;s</b>
                <span className="rn-sub">Newest Update:</span>
              </div>
            </div>
            <p className="rn-texto">{ultimoUpdate ? (ultimoUpdate.tipo === "update" ? ultimoUpdate.conteudo : ultimoUpdate.titulo) : "Nada por aqui ainda..."}</p>
            <p className="rn-humor">Mood = <IconeHumor humor={ultimoUpdate?.humor ?? "feliz"} /> <em>{ultimoUpdate?.humor ?? "feliz"}</em></p>
          </div>
        </aside>

        {/* ---------- miolo de cima ---------- */}
        <section className="spill-principal">
          {carregando ? (
            <p className="spill-aviso">carregando...</p>
          ) : erro ? (
            <p className="spill-aviso">{erro}</p>
          ) : atual ? (
            <article className="spill-post">
              <Aba>POST</Aba>
              <div className="spill-post-corpo">
                {!atual.publicado && <span className="selo-rascunho">rascunho</span>}
                <p className="post-meta">{quando(atual.criado_em)} · {nomeCat(atual.categoria)}</p>
                {atual.titulo && <h1>{atual.titulo}</h1>}
                <div className="post-faixa">
                  <span><b>FEELING:</b> <IconeHumor humor={atual.humor} /> {atual.humor}</span>
                  {atual.ouvindo && <span><b>OUVINDO:</b> <Music size={14} /> {atual.ouvindo}</span>}
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {atual.capa && <img className="post-capa" src={atual.capa} alt="" />}
                <Conteudo texto={atual.conteudo} />
                {atual.tags.length > 0 && (
                  <p className="post-tags">{atual.tags.map((t) => <button key={t} onClick={() => ir({ tag: t })}>#{t}</button>)}</p>
                )}
                {usuaria && (
                  <p className="post-acoes">
                    <button onClick={() => setEditando({ ...atual })}><Pencil size={14} /> editar</button>
                    <button onClick={() => apagar(atual.id)}><Trash2 size={14} /> apagar</button>
                  </p>
                )}
                <button className="spill-voltar" onClick={() => ir({})}>‹ voltar pro início</button>
              </div>
            </article>
          ) : (
            <>
              <Aba setas={[() => setDestaque((d) => (d - 1 + novidades.length) % Math.max(1, novidades.length)), () => setDestaque((d) => (d + 1) % Math.max(1, novidades.length))]}>NEW STUFF</Aba>
              {novidades.length ? (() => {
                const p = novidades[destaque % novidades.length];
                return (
                  <div className="new-stuff">
                    <div className="ns-tela">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {p.capa ? <img src={p.capa} alt="" /> : <div className="ns-sem-capa">{p.titulo}</div>}
                    </div>
                    <div className="ns-lado">
                      <p className="ns-chamada">HOT <span>NEW</span> POST</p>
                      <h3>{p.titulo}</h3>
                      <p>{resumo(p.conteudo, 140)}</p>
                      <button onClick={() => ir({ post: p.id })}>LÊ AGORA!</button>
                    </div>
                  </div>
                );
              })() : (
                <div className="new-stuff vazio"><p>Ainda não tem post. {usuaria ? "Clica em + postar lá em cima!" : "Volta daqui a pouco!"}</p></div>
              )}
              <Aba setas={[() => setFato((f) => (f - 1 + FATOS.length) % FATOS.length), () => setFato((f) => (f + 1) % FATOS.length)]}>FUN FACTS</Aba>
              <div className="fun-facts"><p>{FATOS[fato]}</p></div>
            </>
          )}
        </section>

        {/* ---------- the HOT PAGES ---------- */}
        {grandes.length > 0 && (
          <section className="hot-pages">
            <Aba>HOT POSTS</Aba>
            <div className="hp-faixa">
              {grandes.slice(0, 7).map((p, i) => (
                <button key={p.id} className="hp-card" onClick={() => ir({ post: p.id })}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {p.capa ? <img src={p.capa} alt="" /> : <span className={`hp-sem c${i % 4}`}>{p.titulo.slice(0, 40)}</span>}
                  <span className="hp-nome">{p.titulo}</span>
                  {contarFotos(p) > 0 && <span className="hp-num">{contarFotos(p)}</span>}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ---------- coluna da esquerda de baixo ---------- */}
        <aside className="spill-lado2">
          <div className="caixa-lado roxa">
            <Aba>OUVINDO</Aba>
            <ul>
              {ouvindo.length ? ouvindo.map((p) => <li key={p.id}><Music size={14} /> {p.ouvindo}</li>) : <li>nada ainda</li>}
            </ul>
          </div>
          <div className="caixa-lado">
            <Aba>TAGS</Aba>
            <p className="nuvem-tags">
              {todasTags.length ? todasTags.map((t) => (
                <button key={t} className={tag === t ? "ativo" : ""} onClick={() => ir({ tag: t })}>#{t}</button>
              )) : <span>sem tags ainda</span>}
            </p>
          </div>
        </aside>

        {/* ---------- feed (cada post vira um "update" do celular) ---------- */}
        <section className="spill-feed">
          <Aba>{cat ? nomeCat(cat).toUpperCase() : tag ? `#${tag.toUpperCase()}` : q ? `BUSCA: ${q.toUpperCase()}` : "NEWEST UPDATES"}</Aba>
          {!carregando && filtrados.length === 0 && <p className="spill-aviso">Nada por aqui.</p>}
          {filtrados.map((p) => p.tipo === "update" ? (
            <div key={p.id} className="pear-fundo">
              <div className="pear">
                <svg className="pear-corpo" viewBox="0 0 1000 560" aria-hidden>
                  <defs>
                    <linearGradient id="pearAzul" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#7cc8ff" /><stop offset=".35" stopColor="#2f86dc" /><stop offset="1" stopColor="#14509e" />
                    </linearGradient>
                    <radialGradient id="pearTela" cx=".28" cy=".35" r=".7">
                      <stop offset="0" stopColor="#2c5d55" /><stop offset=".45" stopColor="#15202a" /><stop offset="1" stopColor="#07080d" />
                    </radialGradient>
                    <radialGradient id="pearBotao" cx=".35" cy=".3" r=".8">
                      <stop offset="0" stopColor="#b5ecff" /><stop offset=".5" stopColor="#2a95e6" /><stop offset="1" stopColor="#0c4a95" />
                    </radialGradient>
                  </defs>
                  <path d="M40 300C20 180 120 150 260 130C420 105 600 20 800 20C940 20 1000 140 995 290C990 450 900 545 760 545C620 545 560 470 420 455C300 445 160 460 90 430C45 410 35 360 40 300Z" fill="url(#pearAzul)" stroke="#0b3d82" strokeWidth="6" />
                  <path d="M70 250C80 190 150 168 270 150C430 126 600 40 790 36C900 34 960 110 975 200" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="6" strokeLinecap="round" />
                  <path d="M68 300C55 205 140 178 270 160C430 138 600 52 780 50C850 50 875 120 875 290C875 450 840 515 760 515C630 515 570 450 425 430C300 418 170 432 100 410C70 395 64 350 68 300Z" fill="url(#pearTela)" stroke="#06244f" strokeWidth="5" />
                  <path d="M540 150C600 95 660 70 860 70M540 410C600 470 680 500 860 500" fill="none" stroke="#c2185b" strokeWidth="4" />
                  <circle cx="937" cy="300" r="40" fill="url(#pearBotao)" stroke="#0b3d82" strokeWidth="4" />
                  <path d="M925 296c0-12 10-18 18-14 6 3 8 10 14 12-4 10-14 16-24 14-6-1-8-6-8-12z" fill="#7ad8ff" />
                </svg>
                <span className="pear-tab t1"><Camera />Photos</span>
                <span className="pear-tab t2"><Mail />Mail</span>
                <span className="pear-tab t3"><House />Home</span>
                <span className="pear-tab t4"><Users />Friends</span>
                <span className="pear-marca">the{BLOG.nome}<small>MOBILE</small></span>
                <div className="pear-foto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={SITE.foto} alt="" />
                  <b>UPDATE</b>
                </div>
                <div className="pear-msg">
                  <p className="pear-nome">ALANA: {!p.publicado && <i className="selo-rascunho">rascunho</i>}</p>
                  <p className="pear-texto">{p.conteudo}</p>
                  <div className="pear-rodape">
                    <p className="pear-feeling">FEELING:<IconeHumor humor={p.humor} /></p>
                    <p className="pear-humor">{p.humor}</p>
                  </div>
                </div>
                <span className="pear-data">{quando(p.criado_em)}</span>
              </div>
              {usuaria && (
                <p className="pear-acoes">
                  <button onClick={() => setEditando({ ...p })}><Pencil size={13} /> editar</button>
                  <button onClick={() => apagar(p.id)}><Trash2 size={13} /> apagar</button>
                </p>
              )}
            </div>
          ) : (
            <div key={p.id} className={`status ${p.tipo}`}>
              <div className="status-foto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.capa ?? SITE.foto} alt="" />
                <span>{p.tipo === "post" ? "POST" : "UPDATE"}</span>
              </div>
              <div className="status-tela" role={p.tipo === "post" ? "button" : undefined} onClick={() => p.tipo === "post" && ir({ post: p.id })}>
                <p className="status-nome">ALANA: {!p.publicado && <i className="selo-rascunho">rascunho</i>}</p>
                {p.titulo && <p className="status-titulo">{p.titulo}</p>}
                <p className="status-texto">{p.tipo === "post" ? resumo(p.conteudo) : p.conteudo}</p>
                <p className="status-feeling">FEELING:</p>
                <p className="status-humor"><span>{p.humor}</span><IconeHumor humor={p.humor} /></p>
                <p className="status-data">{quando(p.criado_em)}{p.categoria ? ` · ${nomeCat(p.categoria)}` : ""}</p>
              </div>
            </div>
          ))}
        </section>
      </div>

      {editando && (
        <Editor
          inicial={editando}
          aoFechar={() => setEditando(null)}
          aoSalvar={(id) => { setEditando(null); carregar(); if (id) ir({ post: id }); }}
        />
      )}
    </div>
  );
}

// ---------- escrever / editar ----------
function Editor({ inicial, aoFechar, aoSalvar }: { inicial: Partial<Post> & typeof VAZIO; aoFechar: () => void; aoSalvar: (id?: string) => void }) {
  const [p, setP] = useState(inicial);
  const [tags, setTags] = useState(inicial.tags.join(", "));
  const [subindo, setSubindo] = useState("");
  const [erro, setErro] = useState("");
  const texto = useRef<HTMLTextAreaElement>(null);
  const update = p.tipo === "update";
  const set = (k: Partial<Post>) => setP((x) => ({ ...x, ...k }));

  const subirCapa = async (f?: File) => {
    if (!f) return;
    setSubindo("capa");
    try { set({ capa: await subirFoto(f, "blog") }); } catch { setErro("Não consegui subir a foto."); }
    setSubindo("");
  };
  const inserirFoto = async (f?: File) => {
    if (!f) return;
    setSubindo("meio");
    try {
      const url = await subirFoto(f, "blog");
      const el = texto.current;
      const pos = el?.selectionStart ?? p.conteudo.length;
      const novo = `${p.conteudo.slice(0, pos).trimEnd()}\n\n![foto](${url})\n\n${p.conteudo.slice(pos).trimStart()}`;
      set({ conteudo: novo });
    } catch { setErro("Não consegui subir a foto."); }
    setSubindo("");
  };

  const salvar = async (publicado: boolean) => {
    if (!p.conteudo.trim() || (!update && !p.titulo.trim())) { setErro(update ? "Escreve alguma coisa!" : "Falta o título ou o texto."); return; }
    const dados = {
      titulo: update ? "" : p.titulo.trim(),
      conteudo: p.conteudo.trim(),
      capa: update ? null : p.capa,
      tipo: p.tipo,
      categoria: p.categoria,
      tags: tags.split(",").map((t) => t.trim().replace(/^#/, "").toLowerCase()).filter(Boolean),
      humor: p.humor,
      ouvindo: p.ouvindo?.trim() || null,
      publicado,
    };
    const sb = supabase().from("blog_posts");
    const { data, error } = p.id ? await sb.update(dados).eq("id", p.id).select().single() : await sb.insert(dados).select().single();
    if (error) { setErro("Não consegui salvar. Você rodou o SQL novo do blog no Supabase?"); return; }
    aoSalvar(update ? undefined : (data as Post).id);
  };

  return (
    <Modal titulo={p.id ? "editar_post.exe" : update ? "novo_update.exe" : "novo_post.exe"} cor="azul" aoFechar={aoFechar}>
      <div className="spill-editor">
        <div className="ed-tipo">
          <button className={!update ? "ativo" : ""} onClick={() => set({ tipo: "post" })}>post</button>
          <button className={update ? "ativo" : ""} onClick={() => set({ tipo: "update" })}>update rápido</button>
        </div>
        {!update && (
          <label>título<input value={p.titulo} onChange={(e) => set({ titulo: e.target.value })} /></label>
        )}
        {!update && (
          <label className="ed-capa">
            foto de capa
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {p.capa && <img src={p.capa} alt="" />}
            <input type="file" accept="image/*" onChange={(e) => subirCapa(e.target.files?.[0])} />
            {subindo === "capa" && <small>subindo...</small>}
            {p.capa && <button type="button" onClick={() => set({ capa: null })}>tirar capa</button>}
          </label>
        )}
        <label>
          {update ? "o que tá rolando?" : "texto (deixa uma linha em branco entre os parágrafos)"}
          <textarea ref={texto} rows={update ? 3 : 12} value={p.conteudo} onChange={(e) => set({ conteudo: e.target.value })} />
        </label>
        {!update && (
          <label className="ed-foto-meio">
            <ImagePlus size={16} /> pôr foto no meio do texto (entra onde o cursor estiver)
            <input type="file" accept="image/*" onChange={(e) => inserirFoto(e.target.files?.[0])} />
            {subindo === "meio" && <small>subindo...</small>}
          </label>
        )}
        <div className="ed-linha">
          <label>humor
            <select value={p.humor ?? ""} onChange={(e) => set({ humor: e.target.value })}>
              {HUMORES.map((h) => <option key={h.id} value={h.id}>{h.id}</option>)}
            </select>
          </label>
          <label>ouvindo agora<input value={p.ouvindo ?? ""} onChange={(e) => set({ ouvindo: e.target.value })} placeholder="ex: Anitta - Envolver" /></label>
        </div>
        <div className="ed-linha">
          <label>assunto
            <select value={p.categoria ?? ""} onChange={(e) => set({ categoria: e.target.value })}>
              {CATEGORIAS.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </label>
          <label>tags (separa com vírgula)<input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="desperate housewives, pizza" /></label>
        </div>
        {erro && <p className="erro">{erro}</p>}
        <div className="ed-botoes">
          <button className="ed-rascunho" onClick={() => salvar(false)}>salvar rascunho</button>
          <button className="ed-publicar" onClick={() => salvar(true)}>publicar!</button>
        </div>
      </div>
    </Modal>
  );
}
