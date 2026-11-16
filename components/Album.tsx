"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BatteryFull, ImagePlus, Pencil, Play } from "lucide-react";
import { supabase, subirFoto } from "@/lib/supabase";
import { useSessao } from "./Sessao";
import Modal from "./Modal";

type Foto = { id: string; url: string; legenda: string | null; album: string | null; lugar: string | null; data: string | null; criado_em: string };
type Tela = "foto" | "galeria" | "menu";

const TODAS = "todas";
const fmtData = (f: Foto) => {
  const d = f.data ? new Date(f.data + "T12:00:00") : new Date(f.criado_em);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
};

export default function Album() {
  const { usuaria } = useSessao();
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [album, setAlbum] = useState(TODAS);
  const [i, setI] = useState(0);
  const [tela, setTela] = useState<Tela>("foto");
  const [osd, setOsd] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [editando, setEditando] = useState<Foto | null>(null);
  const [subindo, setSubindo] = useState<{ feitas: number; total: number } | null>(null);
  const [albumNovo, setAlbumNovo] = useState("");
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    const { data, error } = await supabase().from("album_fotos").select("*").order("data", { ascending: false, nullsFirst: false }).order("criado_em", { ascending: false });
    if (error) setErro("Não consegui carregar as fotos agora.");
    else setFotos((data ?? []) as Foto[]);
    setCarregando(false);
  }, []);
  useEffect(() => { carregar(); }, [carregar, usuaria]);

  const albuns = useMemo(() => [...new Set(fotos.map((f) => f.album).filter(Boolean) as string[])].sort(), [fotos]);
  const lista = album === TODAS ? fotos : fotos.filter((f) => f.album === album);
  const atual = lista.length ? lista[((i % lista.length) + lista.length) % lista.length] : null;
  const pos = lista.length ? ((i % lista.length) + lista.length) % lista.length : 0;

  // foto deitada? a câmera gira junto
  const [deitada, setDeitada] = useState(false);
  useEffect(() => {
    if (!atual) return;
    const img = new Image();
    img.onload = () => setDeitada(img.naturalWidth > img.naturalHeight * 1.05);
    img.src = atual.url;
  }, [atual]);

  const passar = (d: number) => { setI((x) => x + d); setZoom(1); setTela("foto"); };
  const escolherAlbum = (a: string) => { setAlbum(a); setI(0); setZoom(1); setTela("foto"); };

  // setinhas do teclado também passam as fotos
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("input, textarea, select")) return;
      if (e.key === "ArrowRight") passar(1);
      if (e.key === "ArrowLeft") passar(-1);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  const subirVarias = async (arquivos: FileList | null) => {
    if (!arquivos?.length) return;
    const destino = albumNovo.trim() || (album !== TODAS ? album : null);
    setErro("");
    setSubindo({ feitas: 0, total: arquivos.length });
    let feitas = 0;
    for (const arq of Array.from(arquivos)) {
      try {
        const url = await subirFoto(arq, "album");
        const data = arq.lastModified ? new Date(arq.lastModified).toISOString().slice(0, 10) : null;
        const { error } = await supabase().from("album_fotos").insert({ url, album: destino, data });
        if (error) throw error;
      } catch {
        setErro("Alguma foto não subiu. Você rodou o SQL do álbum no Supabase?");
      }
      feitas++;
      setSubindo({ feitas, total: arquivos.length });
    }
    setSubindo(null);
    setAlbumNovo("");
    if (destino) setAlbum(destino);
    setI(0);
    carregar();
  };

  return (
    <div className="album-cam">
      <header className="cam-titulo">
        <h1>alana<span>cam</span></h1>
        <p>clica nos botões da câmera: as setinhas passam as fotos, <b>MENU</b> troca o álbum, <b>HOME</b> mostra todas, o botão do meio liga e desliga as informações e <b>W / T</b> dá zoom.</p>
      </header>

      <div className="cam-palco">
        {/* ---------- a câmera ---------- */}
        <div className={`camera-caixa ${deitada && tela === "foto" ? "deitada" : ""}`}>
        <div className="camera">
          <div className="cam-tela"><div className="tela-conteudo">
            {carregando ? (
              <p className="osd-centro">carregando...</p>
            ) : erro && !fotos.length ? (
              <p className="osd-centro">{erro}</p>
            ) : tela === "menu" ? (
              <div className="osd-menu">
                <p className="osd-topo">MENU · ÁLBUNS</p>
                {[TODAS, ...albuns].map((a) => (
                  <button key={a} className={a === album ? "ativo" : ""} onClick={() => escolherAlbum(a)}>
                    {a === TODAS ? "todas as fotos" : a} <span>{a === TODAS ? fotos.length : fotos.filter((f) => f.album === a).length}</span>
                  </button>
                ))}
              </div>
            ) : tela === "galeria" ? (
              <div className="osd-galeria">
                {lista.map((f, k) => (
                  <button key={f.id} className={k === pos ? "ativo" : ""} onClick={() => { setI(k); setTela("foto"); }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.url} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            ) : atual ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="cam-foto" src={atual.url} alt={atual.legenda ?? ""} style={{ transform: `scale(${zoom})` }} />
                {osd && (
                  <div className="osd">
                    <p className="osd-topo"><span><Play size={13} fill="currentColor" /> {pos + 1}/{lista.length}</span><span>{album === TODAS ? "" : album}</span><BatteryFull size={18} /></p>
                    <div className="osd-baixo">
                      {atual.legenda && <p className="osd-legenda">{atual.legenda}</p>}
                      <p className="osd-info">
                        {atual.lugar && <span>{atual.lugar}</span>}
                        <span>{fmtData(atual)}</span>
                      </p>
                    </div>
                  </div>
                )}
                {zoom > 1 && <span className="osd-zoom">x{zoom}</span>}
              </>
            ) : (
              <p className="osd-centro">NO IMAGE<br /><small>{usuaria ? "sobe suas fotos aqui do lado" : "ainda não tem foto aqui"}</small></p>
            )}
          </div></div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="cam-corpo" src="/album/camera.webp" alt="" draggable={false} />
          <button className="cam-btn b-ant" aria-label="foto anterior" onClick={() => passar(-1)} />
          <button className="cam-btn b-prox" aria-label="próxima foto" onClick={() => passar(1)} />
          <button className="cam-btn b-meio" aria-label="mostrar ou esconder informações" onClick={() => { setTela("foto"); setOsd((o) => !o); }} />
          <button className="cam-btn b-menu" aria-label="menu de álbuns" onClick={() => setTela((t) => (t === "menu" ? "foto" : "menu"))} />
          <button className="cam-btn b-home" aria-label="ver todas as fotos" onClick={() => setTela((t) => (t === "galeria" ? "foto" : "galeria"))} />
          <button className="cam-btn b-w" aria-label="diminuir zoom" onClick={() => setZoom((z) => Math.max(1, z - 0.5))} />
          <button className="cam-btn b-t" aria-label="aumentar zoom" onClick={() => setZoom((z) => Math.min(3, z + 0.5))} />
        </div>
        </div>

        {/* ---------- do lado: álbuns, rolo de fotos e subir ---------- */}
        <aside className="cam-lado">
          <div className="cam-albuns">
            {[TODAS, ...albuns].map((a) => (
              <button key={a} className={a === album ? "ativo" : ""} onClick={() => escolherAlbum(a)}>{a === TODAS ? "todas" : a}</button>
            ))}
          </div>

          {atual && (
            <div className="cam-detalhe">
              {atual.legenda ? <p className="cd-legenda">{atual.legenda}</p> : <p className="cd-legenda vazio">sem legenda</p>}
              <p className="cd-info">{[atual.lugar, fmtData(atual), atual.album].filter(Boolean).join(" · ")}</p>
              {usuaria && <button onClick={() => setEditando(atual)}><Pencil size={14} /> editar essa foto</button>}
            </div>
          )}

          <div className="cam-rolo">
            {lista.map((f, k) => (
              <button key={f.id} className={k === pos ? "ativo" : ""} onClick={() => { setI(k); setZoom(1); setTela("foto"); }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.url} alt="" loading="lazy" />
              </button>
            ))}
          </div>

          {usuaria && (
            <div className="cam-subir">
              <p><ImagePlus size={16} /> subir fotos</p>
              <label>
                álbum
                <input list="albuns-existentes" value={albumNovo} onChange={(e) => setAlbumNovo(e.target.value)} placeholder={album !== TODAS ? album : "ex: praia, Thor & Tiana"} />
                <datalist id="albuns-existentes">{albuns.map((a) => <option key={a} value={a} />)}</datalist>
              </label>
              <label className="cam-arquivo">
                {subindo ? `subindo ${subindo.feitas}/${subindo.total}...` : "escolher fotos (pode ser várias)"}
                <input type="file" accept="image/*" multiple disabled={!!subindo} onChange={(e) => { subirVarias(e.target.files); e.target.value = ""; }} />
              </label>
              <small>depois clica em "editar essa foto" pra pôr legenda, lugar e data.</small>
              {erro && <p className="erro">{erro}</p>}
            </div>
          )}
        </aside>
      </div>

      {editando && (
        <EditarFoto foto={editando} albuns={albuns} aoFechar={() => setEditando(null)} aoSalvar={() => { setEditando(null); carregar(); }} />
      )}
    </div>
  );
}

function EditarFoto({ foto, albuns, aoFechar, aoSalvar }: { foto: Foto; albuns: string[]; aoFechar: () => void; aoSalvar: () => void }) {
  const [f, setF] = useState(foto);
  const [erro, setErro] = useState("");
  const set = (k: Partial<Foto>) => setF((x) => ({ ...x, ...k }));

  const salvar = async () => {
    const { error } = await supabase().from("album_fotos").update({
      legenda: f.legenda?.trim() || null, lugar: f.lugar?.trim() || null, album: f.album?.trim() || null, data: f.data || null,
    }).eq("id", f.id);
    if (error) setErro("Não consegui salvar.");
    else aoSalvar();
  };
  const apagar = async () => {
    if (!confirm("Apagar essa foto do álbum?")) return;
    await supabase().from("album_fotos").delete().eq("id", f.id);
    aoSalvar();
  };

  return (
    <Modal titulo="editar_foto.exe" cor="rosa" aoFechar={aoFechar}>
      <div className="spill-editor cam-editor">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={f.url} alt="" />
        <label>legenda<textarea rows={2} value={f.legenda ?? ""} onChange={(e) => set({ legenda: e.target.value })} /></label>
        <div className="ed-linha">
          <label>lugar<input value={f.lugar ?? ""} onChange={(e) => set({ lugar: e.target.value })} placeholder="ex: praia de Canoa Quebrada" /></label>
          <label>data<input type="date" value={f.data ?? ""} onChange={(e) => set({ data: e.target.value })} /></label>
        </div>
        <label>álbum
          <input list="albuns-editar" value={f.album ?? ""} onChange={(e) => set({ album: e.target.value })} />
          <datalist id="albuns-editar">{albuns.map((a) => <option key={a} value={a} />)}</datalist>
        </label>
        {erro && <p className="erro">{erro}</p>}
        <div className="ed-botoes">
          <button className="ed-rascunho" onClick={apagar}>apagar foto</button>
          <button className="ed-publicar" onClick={salvar}>salvar</button>
        </div>
      </div>
    </Modal>
  );
}
