import type { Metadata } from "next";
import Janela from "@/components/Janela";
import { buscarNoticias, haQuanto } from "@/lib/news";

export const revalidate = 1800;
export const metadata: Metadata = { title: "Notícias do dia" };

const CORES = ["azul", "verde", "lilas", "rosa", "azul"] as const;

export default async function Noticias() {
  const blocos = await buscarNoticias();

  return (
    <div className="pagina vibe-aero">
      <h1 className="titulo-pagina">📰 Notícias do dia</h1>
      <p className="subtitulo">Atualiza sozinha a cada 30 minutos. Sem tigrinho e sem subcelebridade. 💅</p>
      <div className="grade-noticias">
        {blocos.map((b, i) => (
          <Janela key={b.id} titulo={`${b.nome}`} icone={b.icone} cor={CORES[i % CORES.length]}>
            {b.noticias.length === 0 ? (
              <p className="nota-pequena">Não consegui buscar agora. Tenta de novo daqui a pouco 📡</p>
            ) : (
              <ul className="lista-noticias">
                {b.noticias.map((n) => (
                  <li key={n.link}>
                    <a href={n.link} target="_blank" rel="noreferrer">
                      {n.imagem && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={n.imagem} alt="" loading="lazy" />
                      )}
                      <span>
                        <strong>{n.titulo}</strong>
                        <small>
                          {n.fonte}
                          {n.data && ` · ${haQuanto(n.data)}`}
                        </small>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </Janela>
        ))}
      </div>
    </div>
  );
}
