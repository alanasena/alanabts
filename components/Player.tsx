"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, ListMusic, Pause, Play, SkipBack, SkipForward, Tv } from "lucide-react";
import { PLAYLISTS_SPOTIFY, PLAYLISTS_YOUTUBE, PODCASTS, type Fonte } from "@/config/midia";

// MP3 no canto da tela. Toca Spotify ou YouTube e continua tocando entre as abas.

type Modo = "musica" | "podcast";
type Origem =
  | { tipo: "spotify"; uri: string }
  | { tipo: "youtube"; video?: string; lista?: string }
  | null;

type SpotifyController = {
  loadUri: (uri: string) => void;
  play: () => void;
  togglePlay: () => void;
  pause: () => void;
  addListener: (ev: string, cb: (e: { data?: { isPaused?: boolean } }) => void) => void;
};
type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  nextVideo: () => void;
  previousVideo: () => void;
  getVideoData: () => { title?: string };
  loadPlaylist: (o: { list: string; listType: string }) => void;
  loadVideoById: (id: string) => void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: {
      createController: (el: HTMLElement, o: { uri: string; width?: string | number; height?: number }, cb: (c: SpotifyController) => void) => void;
    }) => void;
    onYouTubeIframeAPIReady?: () => void;
    YT?: { Player: new (el: HTMLElement, o: Record<string, unknown>) => YTPlayer; PlayerState: { PLAYING: number } };
  }
}

function lerOrigem(url: string): Origem {
  const sp = url.match(/open\.spotify\.com\/(?:intl-[a-z-]+\/)?(?:embed\/)?(playlist|album|track|show|episode|artist)\/([A-Za-z0-9]+)/);
  if (sp) return { tipo: "spotify", uri: `spotify:${sp[1]}:${sp[2]}` };
  const lista = url.match(/[?&]list=([A-Za-z0-9_-]+)/)?.[1];
  const video = url.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/)?.[1] ?? url.match(/[?&]v=([A-Za-z0-9_-]{6,})/)?.[1];
  if (lista || video) return { tipo: "youtube", lista, video };
  return null;
}

const CHAVE = "bts:minhas-fontes";
const carregarScript = (id: string, src: string) => {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.src = src;
  s.async = true;
  document.body.appendChild(s);
};

export default function Player() {
  const [modo, setModo] = useState<Modo>("musica");
  const [minhas, setMinhas] = useState<Fonte[]>([]);
  const [idx, setIdx] = useState(0);
  const [ativado, setAtivado] = useState(false);
  const [tocando, setTocando] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [menu, setMenu] = useState(false);
  const [tela, setTela] = useState(false);
  const [minimizado, setMinimizado] = useState(false);
  const [link, setLink] = useState("");
  const [erro, setErro] = useState("");

  const caixaSpotify = useRef<HTMLDivElement>(null);
  const caixaYT = useRef<HTMLDivElement>(null);
  const spotify = useRef<SpotifyController | null>(null);
  const yt = useRef<YTPlayer | null>(null);
  const origemAtual = useRef<Origem>(null);

  useEffect(() => {
    try {
      setMinhas(JSON.parse(localStorage.getItem(CHAVE) ?? "[]"));
    } catch {}
    if (window.innerWidth < 640) setMinimizado(true);
  }, []);

  const listaMusica: Fonte[] = [...PLAYLISTS_SPOTIFY, ...PLAYLISTS_YOUTUBE, ...minhas];
  const listaPodcast: Fonte[] = PODCASTS.filter((p) => p.url).map((p) => ({ nome: p.nome, url: p.url! }));
  const lista = modo === "musica" ? listaMusica : listaPodcast;
  const fonte = lista[idx] ?? null;

  // ---------- tocar uma fonte ----------
  const tocarFonte = useCallback((f: Fonte | null) => {
    if (!f) return;
    const o = lerOrigem(f.url);
    if (!o) return;
    origemAtual.current = o;
    setAtivado(true);
    setTitulo(f.nome);

    if (o.tipo === "spotify") {
      yt.current?.pauseVideo();
      if (spotify.current) {
        spotify.current.loadUri(o.uri);
        spotify.current.play();
        return;
      }
      window.onSpotifyIframeApiReady = (api) => {
        const alvo = document.createElement("div");
        caixaSpotify.current?.appendChild(alvo);
        const uri = origemAtual.current?.tipo === "spotify" ? origemAtual.current.uri : o.uri;
        api.createController(alvo, { uri, width: "100%", height: 152 }, (c) => {
          spotify.current = c;
          c.addListener("ready", () => c.play());
          c.addListener("playback_update", (e) => setTocando(!e.data?.isPaused));
        });
      };
      carregarScript("spotify-api", "https://open.spotify.com/embed/iframe-api/v1");
      return;
    }

    // YouTube
    spotify.current?.pause();
    const montarYT = () => {
      if (yt.current) {
        if (o.lista) yt.current.loadPlaylist({ list: o.lista, listType: "playlist" });
        else if (o.video) yt.current.loadVideoById(o.video);
        return;
      }
      const alvo = document.createElement("div");
      caixaYT.current?.appendChild(alvo);
      yt.current = new window.YT!.Player(alvo, {
        height: "152",
        width: "100%",
        videoId: o.video,
        playerVars: { autoplay: 1, playsinline: 1, ...(o.lista ? { listType: "playlist", list: o.lista } : {}) },
        events: {
          onReady: (e: { target: YTPlayer }) => e.target.playVideo(),
          onStateChange: (e: { data: number; target: YTPlayer }) => {
            setTocando(e.data === 1);
            const t = e.target.getVideoData?.().title;
            if (t) setTitulo(t);
          },
        },
      });
    };
    if (window.YT?.Player) montarYT();
    else {
      window.onYouTubeIframeAPIReady = montarYT;
      carregarScript("yt-api", "https://www.youtube.com/iframe_api");
    }
  }, []);

  // ---------- botões ----------
  const playPause = () => {
    if (!ativado) return tocarFonte(fonte);
    const o = origemAtual.current;
    if (o?.tipo === "spotify") spotify.current?.togglePlay();
    else if (o?.tipo === "youtube") (tocando ? yt.current?.pauseVideo() : yt.current?.playVideo());
  };

  const pular = (dir: 1 | -1) => {
    const o = origemAtual.current;
    if (ativado && o?.tipo === "youtube" && o.lista && yt.current) {
      return dir === 1 ? yt.current.nextVideo() : yt.current.previousVideo();
    }
    if (!lista.length) return;
    const novo = (idx + dir + lista.length) % lista.length;
    setIdx(novo);
    tocarFonte(lista[novo]);
  };

  const adicionar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lerOrigem(link)) return setErro("Esse link não é do Spotify nem do YouTube");
    const nova = { nome: `minha playlist ${minhas.length + 1}`, url: link.trim() };
    const l = [...minhas, nova];
    setMinhas(l);
    try {
      localStorage.setItem(CHAVE, JSON.stringify(l));
    } catch {}
    setLink("");
    setErro("");
    setModo("musica");
    setIdx(listaMusica.length);
    tocarFonte(nova);
  };

  if (minimizado) {
    return (
      <button className="mp3-mini" onClick={() => setMinimizado(false)} aria-label="Abrir o MP3">
        <span className={`mp3-mini-disco ${tocando ? "girando" : ""}`} />
      </button>
    );
  }

  return (
    <div className={`mp3 ${menu ? "com-menu" : ""}`}>
      {/* vídeo/embed: fica sempre montado pra música não parar */}
      <div className={`mp3-video ${tela ? "visivel" : ""}`}>
        <div ref={caixaSpotify} className={origemAtual.current?.tipo === "spotify" ? "" : "oculto"} />
        <div ref={caixaYT} className={origemAtual.current?.tipo === "youtube" ? "" : "oculto"} />
      </div>

      {menu && (
        <div className="mp3-menu">
          <div className="mp3-abas">
            <button className={modo === "musica" ? "ativo" : ""} onClick={() => { setModo("musica"); setIdx(0); }}>músicas</button>
            <button className={modo === "podcast" ? "ativo" : ""} onClick={() => { setModo("podcast"); setIdx(0); }}>podcasts</button>
          </div>
          <ul className="mp3-lista">
            {lista.length === 0 && <li className="vazio">nada aqui ainda</li>}
            {lista.map((f, i) => (
              <li key={f.url + i}>
                <button
                  className={i === idx && ativado ? "atual" : ""}
                  onClick={() => {
                    setIdx(i);
                    tocarFonte(f);
                  }}
                >
                  <span className="num">{String(i + 1).padStart(2, "0")}</span> {f.nome}
                </button>
              </li>
            ))}
          </ul>
          <form className="mp3-link" onSubmit={adicionar}>
            <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="cola um link do Spotify ou YouTube" />
            <button>+</button>
          </form>
          {erro && <p className="erro">{erro}</p>}
        </div>
      )}

      <div className="mp3-corpo">
        <button className="mp3-fechar" onClick={() => setMinimizado(true)} aria-label="Minimizar">
          <ChevronDown size={14} />
        </button>
        <div className="mp3-tela">
          <div className="mp3-tela-topo">
            <span>{modo === "musica" ? "♪ música" : "podcast"}</span>
            <span className="bateria" aria-hidden><i /></span>
          </div>
          <div className="mp3-titulo">
            <span className={(titulo || fonte?.nome || "").length > 18 ? "rolando" : ""}>
              {titulo || fonte?.nome || "monta sua playlist ✦"}
            </span>
          </div>
          <div className={`mp3-eq ${tocando ? "tocando" : ""}`} aria-hidden>
            {Array.from({ length: 12 }, (_, i) => <i key={i} style={{ animationDelay: `${(i * 137) % 600}ms` }} />)}
          </div>
          {!ativado && <p className="mp3-dica">aperta o play ▶</p>}
        </div>

        <div className="mp3-roda">
          <button className="r-cima" onClick={() => setMenu((m) => !m)} aria-label="Lista de músicas"><ListMusic size={15} /></button>
          <button className="r-esq" onClick={() => pular(-1)} aria-label="Voltar"><SkipBack size={15} /></button>
          <button className="r-dir" onClick={() => pular(1)} aria-label="Passar"><SkipForward size={15} /></button>
          <button className="r-baixo" onClick={playPause} aria-label={tocando ? "Pausar" : "Tocar"}>
            {tocando ? <Pause size={15} /> : <Play size={15} />}
          </button>
          <button className="r-centro" onClick={() => setTela((t) => !t)} aria-label="Mostrar a tela do player">
            <Tv size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
