// Temas das notícias. Cada tema tenta as fontes em ordem até uma funcionar.

const gnews = (q: string) =>
  `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;

export type Tema = {
  id: string;
  nome: string;
  icone: string;
  fontes: string[];
};

export const TEMAS: Tema[] = [
  {
    id: "principais",
    nome: "Principais do dia",
    icone: "",
    fontes: ["https://news.google.com/rss?hl=pt-BR&gl=BR&ceid=BR:pt-419", "https://g1.globo.com/rss/g1/"],
  },
  {
    id: "politica",
    nome: "Política",
    icone: "",
    fontes: ["https://g1.globo.com/rss/g1/politica/", gnews("política Brasil when:1d")],
  },
  {
    id: "pop",
    nome: "Divas do pop",
    icone: "",
    fontes: [
      gnews('Anitta OR "Lady Gaga" OR Madonna OR Rihanna OR Beyoncé OR "Ariana Grande" OR "Corrida das Blogueiras" when:2d'),
      "https://g1.globo.com/rss/g1/pop-arte/",
    ],
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
