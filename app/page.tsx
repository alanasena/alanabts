import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Janela from "@/components/Janela";
import Relogio from "@/components/Relogio";
import Icone from "@/components/Icone";
import Faixa from "@/components/Faixa";
import EdicaoRevista from "@/components/EdicaoRevista";
import { MetasDoMes, ProximoPost } from "@/components/PainelInicio";
import { FraseDoDia, LuaDeHoje } from "@/components/HojeNoCeu";
import { Bichinho, Borboleta, Cd, CelularFlip, CoracaoCromado, CoracaoStrass, Cursor, EstrelaBrilhante, EstrelaOncinha } from "@/components/Adesivos";
import { ABAS, SITE } from "@/config/site";
import { buscarNoticias, haQuanto } from "@/lib/news";

export const revalidate = 1800;

const ATALHOS = ["/ideias", "/calendario", "/metas", "/noticias", "/astrologia", "/roletas", "/wishlist"];
const FAVORITOS = ["/wishlist", "/favoritos", "/album", "/consumo", "/bonequinha"];

export default async function Inicio() {
  const blocos = await buscarNoticias();
  const noticias = blocos.flatMap((b) => b.noticias.slice(0, 2).map((n) => ({ tema: b.nome, ...n })));
  const aba = (href: string) => ABAS.find((a) => a.href === href)!;

  return (
    <div className="pagina inicio">
      {/* ---------- topo ---------- */}
      <section className="inicio-topo">
        <div className="coluna-esq">
          <Janela titulo="atalhos" cor="azul" className="j-atalhos">
            <ul className="lista-atalhos">
              {ATALHOS.map((h) => (
                <li key={h}>
                  <Link href={h}>
                    <Icone nome={aba(h).icone} tamanho={16} />
                    <span>{aba(h).nome.toLowerCase()}</span>
                    <ChevronRight size={14} className="seta" />
                  </Link>
                </li>
              ))}
            </ul>
          </Janela>

          <div className="nota-bemvinda">
            <Relogio />
            <p className="nota-texto">obrigada por passar aqui! espero que você ache algo fofo hoje.</p>
            <p className="nota-assina">♡ xoxo, alana</p>
            <span className="adesivo-bichinho"><Bichinho tamanho={62} /></span>
          </div>
        </div>

        <div className="capa-centro">
          <span className="ad ad-borboleta"><Borboleta tamanho={64} /></span>
          <span className="ad ad-cd"><Cd tamanho={84} /></span>
          <span className="ad ad-cursor"><Cursor /></span>
          <span className="ad ad-estrela"><EstrelaBrilhante tamanho={40} /></span>

          <p className="capa-edicao"><EdicaoRevista /></p>
          <h1 className="capa-titulo">
            <span className="capa-alana">alana</span>
            <span className="capa-3d">behind the scenes</span>
          </h1>
          <p className="capa-sub">ideias, divas do pop, astrologia e muito glitter. só vibes boas por aqui.</p>
          <div className="capa-botoes">
            <Link href="/ideias" className="botao-gloss">ver as ideias →</Link>
            <Link href="/sobre" className="botao-contorno">sobre mim</Link>
          </div>
          <p className="capa-links">
            <Link href="/noticias">notícias</Link>
            <Link href="/astrologia">horóscopo</Link>
            <Link href="/roletas">roletas</Link>
          </p>
        </div>

        <div className="coluna-foto">
          <Janela titulo="alana.jpg" cor="azul" className="j-foto">
            <div className="foto-moldura">
              {SITE.foto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={SITE.foto} alt="Alana" />
              ) : (
                <span className="foto-texto">sua foto aqui ✦</span>
              )}
            </div>
            <span className="adesivo-flip"><CelularFlip tamanho={100} /></span>
            <span className="adesivo-estrela-onca"><EstrelaOncinha tamanho={56} rosa /></span>
          </Janela>
        </div>

        <div className="coluna-dir">
          <Janela titulo="nova mensagem!" cor="lilas" className="j-mensagem">
            <p className="msg-topo"><Icone nome="sobre" tamanho={14} /> você tem (1) nova mensagem</p>
            <FraseDoDia />
          </Janela>

          <Janela titulo="escorpião hoje" cor="rosa" className="j-horoscopo-mini">
            <LuaDeHoje />
            <Link href="/astrologia" className="link-simples">horóscopo completo →</Link>
          </Janela>

          <div className="bilhete-post">
            <strong>não esquece:</strong>
            <ul>
              <li>beber água</li>
              <li>postar no daily</li>
              <li>ser icônica</li>
              <li>ligar pra bff</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- faixa holográfica + próximo post ---------- */}
      <section className="linha-holo">
        <div className="faixa-holo">
          <span className="holo-ponta" />
          <Link href="/noticias" className="holo-item">
            <Icone nome="noticias" tamanho={30} traco={1.5} />
            <span><b>notícias quentes</b><small>política e divas do pop</small></span>
          </Link>
          <span className="holo-coracao"><CoracaoCromado tamanho={40} /></span>
          <Link href="/astrologia" className="holo-item">
            <Icone nome="astrologia" tamanho={30} traco={1.5} />
            <span><b>mapa astral</b><small>tudo sobre escorpião</small></span>
          </Link>
          <span className="holo-coracao"><CoracaoCromado tamanho={40} /></span>
          <Link href="/roletas" className="holo-item">
            <Icone nome="roletas" tamanho={30} traco={1.5} />
            <span><b>gira a roleta</b><small>filme e tema do dia</small></span>
          </Link>
          <span className="holo-ponta" />
        </div>
        <Janela titulo="próximo post" cor="rosa" className="j-proximo">
          <ProximoPost />
        </Janela>
      </section>

      {/* ---------- janelinhas ---------- */}
      <section className="grade-inicio">
        <Janela titulo="notícias do dia" cor="ciano" className="g-noticias">
          {noticias.length === 0 ? (
            <p className="nota-pequena">As notícias aparecem aqui quando o site estiver no ar.</p>
          ) : (
            <ul className="resumo-noticias">
              {noticias.map((n) => (
                <li key={n.link}>
                  <span className="tag-tema">{n.tema}</span>
                  <a href={n.link} target="_blank" rel="noreferrer">{n.titulo}</a>
                  {n.data && <small>{n.fonte} · {haQuanto(n.data)}</small>}
                </li>
              ))}
            </ul>
          )}
          <Link href="/noticias" className="link-simples">ver todas →</Link>
        </Janela>

        <Janela titulo="metas do mês" cor="lilas" className="g-metas">
          <MetasDoMes />
        </Janela>

        <Janela titulo="meus favs" cor="azul" className="g-favs">
          <ul className="lista-favs">
            {FAVORITOS.map((h) => (
              <li key={h}>
                <Link href={h}>
                  <Icone nome={aba(h).icone} tamanho={16} />
                  <span>{aba(h).nome.toLowerCase()}</span>
                  <span className="seta">›</span>
                </Link>
              </li>
            ))}
          </ul>
        </Janela>

        <Janela titulo="cantinho do blog" cor="lilas" className="g-blog">
          <ul className="lista-blog">
            <li><Link href="/blog">o que eu tô ouvindo essa semana</Link></li>
            <li><Link href="/blog">bastidores do meu primeiro reels</Link></li>
            <li><Link href="/blog">o quarto da casa da vó: antes</Link></li>
          </ul>
          <Link href="/blog" className="link-simples">ler mais no blog →</Link>
        </Janela>

        <section className="banner-ceu">
          <span className="banner-coracao"><CoracaoStrass tamanho={70} /></span>
          <span className="banner-borboleta"><Borboleta tamanho={50} /></span>
          <h2 className="texto-cromado">bem-vinda ao<br />meu mundo</h2>
          <p>eu não sigo tendência, eu crio a vibe.</p>
          <Link href="/ideias" className="botao-gloss">bora →</Link>
        </section>
      </section>

      <Faixa invertida />
      <p className="assinatura">siga <b>@{SITE.instagram}</b> ✦ xoxo, alana</p>
    </div>
  );
}
