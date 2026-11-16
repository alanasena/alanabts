import Link from "next/link";
import Janela from "@/components/Janela";
import Relogio from "@/components/Relogio";
import { FraseDoDia, LuaDeHoje } from "@/components/HojeNoCeu";
import { Estrela } from "@/components/Adesivos";
import { ABAS, SITE } from "@/config/site";
import { buscarNoticias } from "@/lib/news";

export const revalidate = 1800;

export default async function Inicio() {
  const blocos = await buscarNoticias();
  const destaques = blocos
    .map((b) => ({ tema: b, n: b.noticias[0] }))
    .filter((d) => d.n);

  return (
    <div className="pagina vibe-xp">
      <section className="boas-vindas">
        <div className="logo-grande">
          <span className="logo-alana">Alana</span>
          <span className="logo-bts">Behind the Scenes</span>
          <span className="logo-estrela"><Estrela tamanho={54} /></span>
        </div>
        <p className="marquee-y2k">
          <span>✦ bem-vindo(a) ao meu QG ✦ ideias ✦ conteúdo ✦ glitter ✦ astrologia ✦ divas do pop ✦ siga @{SITE.instagram} ✦</span>
        </p>
      </section>

      <div className="area-trabalho">
        <nav className="icones-desktop" aria-label="Atalhos">
          {ABAS.filter((a) => a.href !== "/").map((a) => (
            <Link key={a.href} href={a.href} className="icone-desktop">
              <span className="icone-img" aria-hidden>{a.icone}</span>
              <span className="icone-nome">{a.nome}</span>
            </Link>
          ))}
        </nav>

        <div className="grade-janelas">
          <Janela titulo="bem-vinda.exe" icone="💖" cor="rosa" className="j-relogio">
            <Relogio />
          </Janela>

          <Janela titulo="frase_do_dia.txt" icone="💬" cor="lilas" className="j-frase">
            <FraseDoDia />
          </Janela>

          <Janela titulo="horoscopo_escorpiao.exe" icone="🦂" cor="verde" className="j-horoscopo">
            <LuaDeHoje />
            <p className="nota-pequena">
              ♏ O horóscopo completo do dia chega na etapa da astrologia.{" "}
              <Link href="/astrologia">ver aba →</Link>
            </p>
          </Janela>

          <Janela titulo="noticias_do_dia.exe" icone="📰" cor="azul" className="j-noticias">
            {destaques.length === 0 ? (
              <p className="nota-pequena">As notícias aparecem aqui quando o site estiver no ar 📡</p>
            ) : (
              <ul className="resumo-noticias">
                {destaques.map(({ tema, n }) => (
                  <li key={tema.id}>
                    <span className="tag-tema">{tema.icone} {tema.nome}</span>
                    <a href={n!.link} target="_blank" rel="noreferrer">{n!.titulo}</a>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/noticias" className="botao-aqua">ver todas as notícias</Link>
          </Janela>

          <Janela titulo="proximo_post.exe" icone="📅" cor="rosa" className="j-post">
            <div className="em-breve-mini">
              <p className="pixel">🚧 etapa 2</p>
              <p>Aqui vai aparecer o próximo post do seu calendário e os contadores de dias.</p>
            </div>
          </Janela>

          <Janela titulo="metas_do_mes.exe" icone="⭐" cor="verde" className="j-metas">
            <div className="em-breve-mini">
              <p className="pixel">🚧 etapa 2</p>
              <p>Suas metas do mês com a barrinha de progresso. Só você vê.</p>
            </div>
          </Janela>

          <Janela titulo="bonequinha.exe" icone="👗" cor="rosa" className="j-boneca">
            <div className="em-breve-mini">
              <p className="pixel">🚧 em breve</p>
              <p>A Alana em versão bonequinha pra vestir e baixar a foto do look.</p>
              <Link href="/bonequinha" className="botao-aqua rosa">espiar</Link>
            </div>
          </Janela>
        </div>
      </div>
    </div>
  );
}
