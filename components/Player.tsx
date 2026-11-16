"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PLAYLISTS_SPOTIFY, PLAYLISTS_YOUTUBE, PODCASTS, type Fonte } from "@/config/midia";
import { comAutoplay, paraEmbed, type Embed } from "@/lib/embed";

type Aba = "spotify" | "youtube" | "podcasts";
type Atual = { nome: string; embed: NonNullable<Embed> };

type SpotifyController = {
  loadUri: (uri: string) => void;
  play: () => void;
  pause: () => void;
  addListener: (ev: string, cb: (e: unknown) => void) => void;
};
declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: {
      createController: (
        el: HTMLElement,
        opts: { uri: string; width?: string | number; height?: number },
        cb: (c: SpotifyController) => void,
      ) => void;
    }) => void;
  }
}

const CHAVE = "bts:minhas-fontes";

export default function Player() {
  const [aba, setAba] = useState<Aba>("spotify");
  const [aberto, setAberto] = useState(false);
  const [ativado, setAtivado] = useState(false);
  const [atual, setAtual] = useState<Atual | null>(null);
  const [minhas, setMinhas] = useState<Fonte[]>([]);
  const [link, setLink] = useState("");
  const [erroLink, setErroLink] = useState("");
  const [apiFalhou, setApiFalhou] = useState(false);

  const caixaSpotify = useRef<HTMLDivElement>(null);
  const controller = useRef<SpotifyController | null>(null);
  const pendente = useRef<string | null>(null);

  useEffect(() => {
    try {
      setMinhas(JSON.parse(localStorage.getItem(CHAVE) ?? "[]"));
    } catch {}
  }, []);

  const salvarMinhas = (lista: Fonte[]) => {
    setMinhas(lista);
    try {
      localStorage.setItem(CHAVE, JSON.stringify(lista));
    } catch {}
  };

  // Carrega a API do Spotify só depois do clique (deixa o site mais leve)
  const carregarSpotify = useCallback((uri: string) => {
    if (controller.current) {
      controller.current.loadUri(uri);
      controller.current.play();
      return;
    }
    pendente.current = uri;
    if (document.getElementById("spotify-api")) return;
    window.onSpotifyIframeApiReady = (api) => {
      const alvo = document.createElement("div");
      caixaSpotify.current?.appendChild(alvo);
      api.createController(alvo, { uri: pendente.current ?? uri, width: "100%", height: 152 }, (c) => {
        controller.current = c;
        c.addListener("ready", () => c.play());
      });
    };
    const s = document.createElement("script");
    s.id = "spotify-api";
    s.src = "https://open.spotify.com/embed/iframe-api/v1";
    s.async = true;
    s.onerror = () => setApiFalhou(true);
    document.body.appendChild(s);
    setTimeout(() => {
      if (!controller.current) setApiFalhou(true);
    }, 6000);
  }, []);

  const tocar = useCallback(
    (nome: string, url: string) => {
      const embed = paraEmbed(url);
      if (!embed) return;
      setAtivado(true);
      setAberto(true);
      setAtual({ nome, embed });
      if (embed.tipo === "spotify") carregarSpotify(embed.uri);
      else controller.current?.pause();
    },
    [carregarSpotify],
  );

  const ativarSom = () => {
    const primeira =
      aba === "youtube" && PLAYLISTS_YOUTUBE[0]
        ? PLAYLISTS_YOUTUBE[0]
        : [...PLAYLISTS_SPOTIFY, ...minhas][0] ?? PLAYLISTS_YOUTUBE[0];
    if (primeira) tocar(primeira.nome, primeira.url);
    else setAberto(true);
  };

  const adicionarLink = (e: React.FormEvent) => {
    e.preventDefault();
    const embed = paraEmbed(link);
    if (!embed) {
      setErroLink("Esse link não é do Spotify nem do YouTube 🥲");
      return;
    }
    const nome = embed.tipo === "spotify" ? `Spotify ✦ ${minhas.length + 1}` : `YouTube ✦ ${minhas.length + 1}`;
    salvarMinhas([...minhas, { nome, url: link.trim() }]);
    setLink("");
    setErroLink("");
    tocar(nome, link);
  };

  const listaAba: Fonte[] =
    aba === "spotify"
      ? [...PLAYLISTS_SPOTIFY, ...minhas.filter((m) => paraEmbed(m.url)?.tipo === "spotify")]
      : aba === "youtube"
        ? [...PLAYLISTS_YOUTUBE, ...minhas.filter((m) => paraEmbed(m.url)?.tipo === "youtube")]
        : [];

  const tocandoSpotify = atual?.embed.tipo === "spotify";

  return (
    <div className={`player ${aberto ? "aberto" : ""}`}>
      {!ativado && (
        <button className="ativar-som" onClick={ativarSom}>
          <span className="pulso" aria-hidden /> 🔊 clique pra ativar o som
        </button>
      )}

      <div className="player-painel" aria-hidden={!aberto}>
        <div className="player-tela">
          {/* Spotify fica sempre montado depois de ativado: assim a música não para */}
          <div
            ref={caixaSpotify}
            className="spotify-caixa"
            style={{ display: tocandoSpotify && !apiFalhou ? "block" : "none" }}
          />
          {tocandoSpotify && apiFalhou && (
            <iframe
              title="Spotify"
              src={atual!.embed.src}
              height={152}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          )}
          {atual?.embed.tipo === "youtube" && (
            <iframe
              key={atual.embed.src}
              title="YouTube"
              src={comAutoplay(atual.embed.src)}
              height={152}
              allow="autoplay; encrypted-media; picture-in-picture"
            />
          )}
          {!atual && (
            <div className="player-vazio">
              Escolhe uma playlist ou podcast aqui do lado 💿
            </div>
          )}
        </div>

        <div className="player-lista">
          {aba !== "podcasts" ? (
            <>
              {listaAba.length === 0 && (
                <p className="dica">Nenhuma playlist do {aba === "youtube" ? "YouTube" : "Spotify"} ainda. Cola um link aqui embaixo 👇</p>
              )}
              {listaAba.map((f) => (
                <button key={f.url} className="faixa" onClick={() => tocar(f.nome, f.url)}>
                  <span aria-hidden>{aba === "youtube" ? "▶️" : "💿"}</span> {f.nome}
                </button>
              ))}
            </>
          ) : (
            PODCASTS.map((p) =>
              p.url ? (
                <button key={p.nome} className="faixa" onClick={() => tocar(p.nome, p.url!)}>
                  <span aria-hidden>🎙️</span> {p.nome} <small>{p.tema}</small>
                </button>
              ) : (
                <a
                  key={p.nome}
                  className="faixa"
                  href={`https://open.spotify.com/search/${encodeURIComponent(p.nome)}/podcastAndEpisodes`}
                  target="_blank"
                  rel="noreferrer"
                  title="Abre no Spotify. Copia o link do podcast e cola aqui embaixo pra ouvir no site."
                >
                  <span aria-hidden>🎙️</span> {p.nome} <small>{p.tema} ↗</small>
                </a>
              ),
            )
          )}
          <form className="colar-link" onSubmit={adicionarLink}>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="cola um link do Spotify ou YouTube"
              aria-label="Link do Spotify ou YouTube"
            />
            <button type="submit">+</button>
          </form>
          {erroLink && <p className="erro">{erroLink}</p>}
        </div>
      </div>

      <div className="player-barra">
        <button className="player-disco" onClick={() => setAberto((a) => !a)} aria-label={aberto ? "Fechar player" : "Abrir player"}>
          <span className={`disco ${atual ? "girando" : ""}`} aria-hidden />
        </button>
        <div className="player-info" onClick={() => setAberto((a) => !a)}>
          <span className="tocando">{atual ? "♪ tocando agora" : "♪ player da Alana"}</span>
          <span className="faixa-nome">{atual?.nome ?? "escolhe uma música ✨"}</span>
        </div>
        <div className="player-abas" role="tablist">
          {(["spotify", "youtube", "podcasts"] as Aba[]).map((a) => (
            <button
              key={a}
              role="tab"
              aria-selected={aba === a}
              className={aba === a ? "ativa" : ""}
              onClick={() => {
                setAba(a);
                setAberto(true);
              }}
            >
              {a === "spotify" ? "Spotify" : a === "youtube" ? "YouTube" : "Podcasts"}
            </button>
          ))}
        </div>
        <button className="player-seta" onClick={() => setAberto((a) => !a)} aria-label="Abrir ou fechar">
          {aberto ? "▼" : "▲"}
        </button>
      </div>
    </div>
  );
}
