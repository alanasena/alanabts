import { BLOQUEADAS, POR_TEMA, TEMAS, type Tema } from "@/config/noticias";

export type Noticia = {
  titulo: string;
  link: string;
  fonte: string;
  data?: string;
  imagem?: string;
};

export type BlocoNoticias = Tema & { noticias: Noticia[] };

const ENTIDADES: Record<string, string> = {
  "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&apos;": "'", "&nbsp;": " ",
};

function limpar(s = ""): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&[a-z#0-9]+;/gi, (e) => ENTIDADES[e] ?? e)
    .trim();
}

function tag(xml: string, nome: string): string | undefined {
  const m = xml.match(new RegExp(`<${nome}[^>]*>([\\s\\S]*?)</${nome}>`, "i"));
  return m?.[1];
}

export function lerRss(xml: string, fontePadrao: string): Noticia[] {
  const itens = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
  return itens.map((item) => {
    let titulo = limpar(tag(item, "title"));
    let fonte = limpar(tag(item, "source")) || fontePadrao;
    // Google Notícias coloca " - Nome do site" no fim do título
    if (fonte && titulo.endsWith(` - ${fonte}`)) titulo = titulo.slice(0, -(fonte.length + 3));
    const imagem =
      item.match(/<media:content[^>]*url="([^"]+)"/i)?.[1] ??
      item.match(/<enclosure[^>]*url="([^"]+)"/i)?.[1] ??
      item.match(/<img[^>]*src="([^"]+)"/i)?.[1] ??
      item.match(/&lt;img[^&]*src=&quot;([^&]+)&quot;/i)?.[1];
    return {
      titulo,
      link: limpar(tag(item, "link")),
      fonte,
      data: limpar(tag(item, "pubDate")) || undefined,
      imagem,
    };
  });
}

function bloqueada(n: Noticia): boolean {
  const t = ` ${n.titulo.toLowerCase()} `;
  return BLOQUEADAS.some((p) => t.includes(p.toLowerCase()));
}

async function buscarTema(tema: Tema): Promise<Noticia[]> {
  for (const url of tema.fontes) {
    try {
      const res = await fetch(url, {
        next: { revalidate: 1800 }, // atualiza a cada 30 min
        signal: AbortSignal.timeout(7000),
        headers: { "User-Agent": "Mozilla/5.0 (AlanaBTS)" },
      });
      if (!res.ok) continue;
      const xml = await res.text();
      const fonte = url.includes("g1.globo") ? "g1" : "Google Notícias";
      const vistas = new Set<string>();
      const lista = lerRss(xml, fonte)
        .filter((n) => n.titulo && n.link && !bloqueada(n))
        .filter((n) => (vistas.has(n.titulo) ? false : (vistas.add(n.titulo), true)))
        .sort((a, b) => (Date.parse(b.data ?? "") || 0) - (Date.parse(a.data ?? "") || 0))
        .slice(0, POR_TEMA);
      if (lista.length) return lista;
    } catch {
      // tenta a próxima fonte
    }
  }
  return [];
}

export async function buscarNoticias(): Promise<BlocoNoticias[]> {
  return Promise.all(TEMAS.map(async (t) => ({ ...t, noticias: await buscarTema(t) })));
}

export function haQuanto(data?: string): string {
  const t = Date.parse(data ?? "");
  if (!t) return "";
  const min = Math.round((Date.now() - t) / 60000);
  if (min < 60) return `há ${Math.max(min, 1)} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `há ${h}h`;
  return `há ${Math.round(h / 24)} dia(s)`;
}
