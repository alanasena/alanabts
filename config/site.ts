// Configurações gerais do site. Mexa aqui pra mudar nomes, abas e ícones.

export const SITE = {
  nome: "Alana Behind the Scenes",
  curto: "Alana BTS",
  instagram: "alanabts_",
  signo: "Escorpião",
};

export type Aba = {
  href: string;
  nome: string;
  icone: string;
  privada?: boolean; // só você vê (com senha) — chega na etapa 2
};

export const ABAS: Aba[] = [
  { href: "/", nome: "Início", icone: "🏠" },
  { href: "/noticias", nome: "Notícias", icone: "📰" },
  { href: "/astrologia", nome: "Astrologia", icone: "🔮" },
  { href: "/sobre", nome: "Sobre mim", icone: "💋" },
  { href: "/blog", nome: "Blog", icone: "✍️" },
  { href: "/album", nome: "Álbum", icone: "📸" },
  { href: "/wishlist", nome: "Wishlist", icone: "🐆" },
  { href: "/consumo", nome: "Tô ouvindo & vendo", icone: "🎧" },
  { href: "/favoritos", nome: "Favoritos", icone: "📺" },
  { href: "/bonequinha", nome: "Bonequinha", icone: "👗" },
  { href: "/roletas", nome: "Roletas", icone: "🎡" },
  { href: "/ideias", nome: "Ideias", icone: "💡", privada: true },
  { href: "/calendario", nome: "Calendário", icone: "📅", privada: true },
  { href: "/metas", nome: "Metas", icone: "⭐", privada: true },
];
