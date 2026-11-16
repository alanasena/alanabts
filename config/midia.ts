// Músicas e podcasts do player lá de baixo.
// Pra trocar: copie o link no Spotify/YouTube (Compartilhar > Copiar link) e cole aqui.
// Aceita link de playlist, álbum, música, podcast ou episódio.

export type Fonte = {
  nome: string;
  url: string; // link normal do Spotify ou do YouTube
};

export const PLAYLISTS_SPOTIFY: Fonte[] = [
  // 👇 troque pelo link da sua playlist favorita
  { nome: "Today's Top Hits", url: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M" },
];

export const PLAYLISTS_YOUTUBE: Fonte[] = [
  // 👇 cole aqui o link de uma playlist do YouTube, ex:
  // { nome: "Minha playlist", url: "https://www.youtube.com/playlist?list=XXXX" },
];

export type Podcast = {
  nome: string;
  de: string;
  sobre: string;
  tema: "notícias" | "cultura pop" | "desenvolvimento pessoal" | "astrologia" | "conversa";
  url?: string; // link do podcast no Spotify (quando tiver, toca aqui no site)
};

export const PODCASTS: Podcast[] = [
  { nome: "Café da Manhã", de: "Folha + Spotify", sobre: "O assunto mais importante do dia em uns 20 minutos. Sai todo dia útil cedinho.", tema: "notícias" },
  { nome: "O Assunto", de: "g1", sobre: "Um tema do dia explicado com calma, com entrevistas.", tema: "notícias" },
  { nome: "Boletim Folha", de: "Folha", sobre: "As notícias em uns 5 minutos. Pra quando tá corrida.", tema: "notícias" },
  { nome: "Mamilos", de: "B9", sobre: "Debate de temas polêmicos da semana, com escuta e respeito.", tema: "conversa" },
  { nome: "Bom Dia, Obvious", de: "Obvious", sobre: "Conversas sobre autoconhecimento, relações e vida adulta.", tema: "desenvolvimento pessoal" },
  { nome: "Quem Pod, Pod", de: "Giovanna Ewbank e Fernanda Paes Leme", sobre: "Papo leve com famosos, fofoca boa e risada.", tema: "cultura pop" },
  { nome: "Calcinha Larga", de: "Tati Bernardi, Camila Fremder e Helen Ramos", sobre: "Três amigas falando de tudo, com muito humor.", tema: "conversa" },
  { nome: "Não Inviabilize", de: "Déia Freitas", sobre: "Histórias reais de ouvintes, contadas de um jeito viciante.", tema: "conversa" },
];
