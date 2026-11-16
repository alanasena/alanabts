// Transforma links normais do Spotify/YouTube em algo que o player entende.

export type Embed =
  | { tipo: "spotify"; uri: string; src: string }
  | { tipo: "youtube"; src: string }
  | null;

export function paraEmbed(url: string): Embed {
  const u = url.trim();
  if (!u) return null;

  // Spotify: open.spotify.com/(intl-pt/)playlist/ID  ou spotify:playlist:ID
  const sp =
    u.match(/open\.spotify\.com\/(?:intl-[a-z-]+\/)?(?:embed\/)?(playlist|album|track|show|episode|artist)\/([A-Za-z0-9]+)/) ??
    u.match(/spotify:(playlist|album|track|show|episode|artist):([A-Za-z0-9]+)/);
  if (sp) {
    const [, kind, id] = sp;
    return {
      tipo: "spotify",
      uri: `spotify:${kind}:${id}`,
      src: `https://open.spotify.com/embed/${kind}/${id}?utm_source=generator&theme=0`,
    };
  }

  // YouTube: playlist, vídeo ou youtu.be
  const lista = u.match(/[?&]list=([A-Za-z0-9_-]+)/)?.[1];
  const video =
    u.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/)?.[1] ??
    u.match(/[?&]v=([A-Za-z0-9_-]{6,})/)?.[1] ??
    u.match(/youtube\.com\/(?:embed|shorts|live)\/([A-Za-z0-9_-]{6,})/)?.[1];
  if (lista && !video) {
    return { tipo: "youtube", src: `https://www.youtube.com/embed/videoseries?list=${lista}` };
  }
  if (video) {
    return {
      tipo: "youtube",
      src: `https://www.youtube.com/embed/${video}${lista ? `?list=${lista}` : ""}`,
    };
  }
  return null;
}

export function comAutoplay(src: string): string {
  return src + (src.includes("?") ? "&" : "?") + "autoplay=1";
}
