// Temas das notícias. Cada tema tenta as fontes em ordem até uma funcionar.

const gnews = (q: string) =>
  `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
const gnewsTopico = (t: string) =>
  `https://news.google.com/rss/headlines/section/topic/${t}?hl=pt-BR&gl=BR&ceid=BR:pt-419`;

export type Tema = {
  id: string;
  nome: string;
  icone: string;
  fontes: string[];
};

export const TEMAS: Tema[] = [
  {
    id: "brasil",
    nome: "Brasil",
    icone: "",
    fontes: ["https://g1.globo.com/rss/g1/brasil/", gnewsTopico("NATION")],
  },
  {
    id: "politica",
    nome: "Política",
    icone: "",
    fontes: ["https://g1.globo.com/rss/g1/politica/", gnews("política Brasil when:1d")],
  },
  {
    id: "tecnologia",
    nome: "Tecnologia",
    icone: "",
    fontes: ["https://g1.globo.com/rss/g1/tecnologia/", gnewsTopico("TECHNOLOGY")],
  },
  {
    id: "pop",
    nome: "Divas do pop",
    icone: "",
    fontes: [
      gnews('Anitta OR "Lady Gaga" OR Madonna OR Rihanna OR Beyoncé OR "Ariana Grande" OR "Taylor Swift" when:2d'),
      "https://g1.globo.com/rss/g1/pop-arte/",
    ],
  },
  {
    id: "lgbt",
    nome: "Mundo LGBT+",
    icone: "",
    fontes: [gnews('"Corrida das Blogueiras" OR LGBT OR "drag queen" OR LGBTQIA+ when:3d')],
  },
];

// Notícia com qualquer uma dessas palavras é cortada. Pode adicionar mais.
export const BLOQUEADAS = [
  "tigrinho",
  "fortune tiger",
  "jogo do tigre",
  "bets",
  "bet ",
  "aposta",
  "virginia",
  "virgínia",
  "deolane",
];

export const POR_TEMA = 5;
