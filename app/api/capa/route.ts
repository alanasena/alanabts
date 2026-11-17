// Procura capas na loja da Apple (iTunes), que é aberta e não precisa de chave.
// /api/capa?q=envolver anitta&tipo=musica  -> { capas: [{ url, titulo, detalhe }] }
import { NextResponse } from "next/server";

const ENTIDADE: Record<string, string> = {
  musica: "song", filme: "movie", serie: "tvSeason", livro: "ebook", podcast: "podcast", video: "podcast",
};

type Resultado = { artworkUrl100?: string; trackName?: string; collectionName?: string; artistName?: string };

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const tipo = searchParams.get("tipo") ?? "musica";
  if (!q) return NextResponse.json({ capas: [] });

  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=${ENTIDADE[tipo] ?? "song"}&country=BR&limit=12`;
  try {
    const r = await fetch(url, { next: { revalidate: 86400 } });
    const dados = (await r.json()) as { results?: Resultado[] };
    const vistas = new Set<string>();
    const capas = (dados.results ?? [])
      .filter((x) => x.artworkUrl100)
      .map((x) => ({
        url: x.artworkUrl100!.replace(/\/\d+x\d+bb\./, "/600x600bb."), // capa grandona
        titulo: x.trackName ?? x.collectionName ?? "",
        detalhe: x.artistName ?? "",
      }))
      .filter((c) => (vistas.has(c.url) ? false : (vistas.add(c.url), true)))
      .slice(0, 8);
    return NextResponse.json({ capas });
  } catch {
    return NextResponse.json({ capas: [] }, { status: 200 });
  }
}
