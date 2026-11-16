"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
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
  const [telaIpod, setTelaIpod] = useState<"menu" | "lista" | "tocando">("menu");
  const [sel, setSel] = useState(0);
  const [tela, setTela] = useState(false);
  const [minimizado, setMinimizado] = useState(false);

  const caixaSpotify = useRef<HTMLDivElement>(null);
  const caixaYT = useRef<HTMLDivElement>(null);
  const spotify = useRef<SpotifyController | null>(null);
  const yt = useRef<YTPlayer | null>(null);
  const origemAtual = useRef<Origem>(null);

  useEffect(() => {
    try {
      setMinhas(JSON.parse(localStorage.getItem(CHAVE) ?? "[]"));
    } catch {}
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


  // avisa a janelinha "tocando agora" e obedece os botões dela
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("bts:mp3-estado", { detail: { titulo: titulo || fonte?.nome, tocando } }));
  }, [titulo, tocando, fonte]);
  const acoes = useRef({ playPause, pular, tocarFonte });
  acoes.current = { playPause, pular, tocarFonte };
  useEffect(() => {
    const ouvir = (e: Event) => {
      const a = (e as CustomEvent<string | { tocar: Fonte }>).detail;
      // outras páginas podem pedir pra tocar um link (ex: "tô ouvindo")
      if (typeof a === "object" && a?.tocar) {
        acoes.current.tocarFonte(a.tocar);
        setTelaIpod("tocando");
        return;
      }
      if (a === "play") acoes.current.playPause();
      if (a === "passar") acoes.current.pular(1);
      if (a === "voltar") acoes.current.pular(-1);
      if (a === "estado") window.dispatchEvent(new CustomEvent("bts:mp3-estado", { detail: { titulo: titulo || fonte?.nome, tocando } }));
    };
    window.addEventListener("bts:mp3", ouvir);
    return () => window.removeEventListener("bts:mp3", ouvir);
  });

  // ---------- navegação da telinha (estilo iPod) ----------
  const opcoesMenu = ["músicas", "podcasts", "tocando agora", tela ? "esconder vídeo" : "ver vídeo", "+ colar link"];
  const itensTela =
    telaIpod === "menu" ? opcoesMenu : telaIpod === "lista" ? (lista.length ? lista.map((f) => f.nome) : ["nada aqui ainda"]) : [];
  const mover = (dir: 1 | -1) => setSel((x) => (itensTela.length ? (x + dir + itensTela.length) % itensTela.length : 0));

  const escolher = (n: number) => {
    if (telaIpod === "menu") {
      const op = opcoesMenu[n];
      if (op === "músicas" || op === "podcasts") {
        setModo(op === "músicas" ? "musica" : "podcast");
        setTelaIpod("lista");
        setSel(0);
      } else if (op === "tocando agora") setTelaIpod("tocando");
      else if (op === "+ colar link") {
        const url = window.prompt("Cola o link de uma playlist, música ou podcast do Spotify ou YouTube:");
        if (!url) return;
        if (!lerOrigem(url)) return window.alert("Esse link não é do Spotify nem do YouTube");
        const nova = { nome: `minha playlist ${minhas.length + 1}`, url: url.trim() };
        const l = [...minhas, nova];
        setMinhas(l);
        try { localStorage.setItem(CHAVE, JSON.stringify(l)); } catch {}
        setModo("musica");
        setIdx(listaMusica.length);
        tocarFonte(nova);
        setTelaIpod("tocando");
      } else setTela((t) => !t);
      return;
    }
    if (telaIpod === "lista" && lista[n]) {
      setIdx(n);
      tocarFonte(lista[n]);
      setTelaIpod("tocando");
    }
  };

  const botaoMenu = () => {
    setTelaIpod((t) => (t === "lista" ? "menu" : t === "tocando" ? "menu" : "tocando"));
    setSel(0);
  };
  const botaoCentro = () => (telaIpod === "tocando" ? playPause() : escolher(sel));
  const botaoLado = (dir: 1 | -1) => (telaIpod === "tocando" ? pular(dir) : mover(dir));


  const nomeTocando = titulo || fonte?.nome || "monta sua playlist ✦";

  return (
    <div className={`ipod ${minimizado ? "minimizado" : ""}`}>
      {/* minimizado: só o iPod pequenininho, mas a música continua tocando */}
      <button className="mp3-mini" onClick={() => setMinimizado(false)} aria-label="Abrir o MP3">
        <img src="/ipod.webp" alt="" />
        {tocando && <span className="mini-tocando">♪</span>}
      </button>
      {/* vídeo/embed: fica sempre montado pra música não parar */}
      <div className={`mp3-video ${tela ? "visivel" : ""}`}>
        <div ref={caixaSpotify} className={origemAtual.current?.tipo === "spotify" ? "" : "oculto"} />
        <div ref={caixaYT} className={origemAtual.current?.tipo === "youtube" ? "" : "oculto"} />
      </div>

      <button className="ipod-fechar" onClick={() => setMinimizado(true)} aria-label="Minimizar">
        <ChevronDown size={14} />
      </button>
      <img className="ipod-foto" src="/ipod.webp" alt="MP3 da Alana" draggable={false} />

      <div className="ipod-tela">
        <div className="ipod-barra">
          <span>{tocando ? "▶" : "❚❚"}</span>
          <b>{telaIpod === "menu" ? "alana bts" : telaIpod === "lista" ? (modo === "musica" ? "músicas" : "podcasts") : "tocando agora"}</b>
          <span className="ipod-bateria"><i /></span>
        </div>

        {telaIpod === "tocando" ? (
          <div className="ipod-tocando">
            <p className="ipod-num">{lista.length ? `${idx + 1} de ${lista.length}` : "–"}</p>
            <p className="ipod-musica"><span className={nomeTocando.length > 16 ? "rolando" : ""}>{nomeTocando}</span></p>
            <p className="ipod-artista">{modo === "musica" ? "playlist da alana" : "podcast"}</p>
            <div className={`ipod-eq ${tocando ? "ativo" : ""}`} aria-hidden>
              {Array.from({ length: 14 }, (_, i) => <i key={i} style={{ animationDelay: `${(i * 137) % 600}ms` }} />)}
            </div>
            {!ativado && <p className="ipod-dica">aperta ▶❚❚ pra tocar</p>}
          </div>
        ) : (
          <ul className="ipod-lista">
            {itensTela.map((t, i) => (
              <li key={t + i}>
                <button className={i === sel ? "sel" : ""} onClick={() => { setSel(i); escolher(i); }}>
                  <span>{t}</span><span>›</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button className="ipod-btn b-menu" onClick={botaoMenu} aria-label="Menu" />
      <button className="ipod-btn b-voltar" onClick={() => botaoLado(-1)} aria-label="Voltar" />
      <button className="ipod-btn b-passar" onClick={() => botaoLado(1)} aria-label="Passar" />
      <button className="ipod-btn b-play" onClick={playPause} aria-label={tocando ? "Pausar" : "Tocar"} />
      <button className="ipod-btn b-centro" onClick={botaoCentro} aria-label="Selecionar" />
    </div>
  );
}
