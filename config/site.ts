// Configurações gerais do site. Mexa aqui pra mudar nomes, abas e ícones.

export const SITE = {
  nome: "Alana Behind the Scenes",
  curto: "Alana BTS",
  instagram: "alanabts_",
  signo: "Escorpião",
  // fundo do site: "liso" (rosinha clarinho) ou "oncinha" (oncinha no fundo todo)
  fundo: "oncinha" as "liso" | "oncinha",
};

export type Aba = {
  href: string;
  nome: string;
  icone: string;
  privada?: boolean; // só você vê (com senha) — chega na etapa 2
};

export const ABAS: Aba[] = [
  { href: "/", nome: "Início", icone: "inicio" },
  { href: "/noticias", nome: "Notícias", icone: "noticias" },
  { href: "/astrologia", nome: "Astrologia", icone: "astrologia" },
  { href: "/sobre", nome: "Sobre mim", icone: "sobre" },
  { href: "/blog", nome: "Blog", icone: "blog" },
  { href: "/album", nome: "Álbum", icone: "album" },
  { href: "/wishlist", nome: "Wishlist", icone: "wishlist" },
  { href: "/consumo", nome: "Tô ouvindo & vendo", icone: "consumo" },
  { href: "/favoritos", nome: "Favoritos", icone: "favoritos" },
  { href: "/bonequinha", nome: "Bonequinha", icone: "bonequinha" },
  { href: "/roletas", nome: "Roletas", icone: "roletas" },
  { href: "/ideias", nome: "Ideias", icone: "ideias", privada: true },
  { href: "/calendario", nome: "Calendário", icone: "calendario", privada: true },
  { href: "/metas", nome: "Metas", icone: "metas", privada: true },
];
