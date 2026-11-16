import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Janela from "@/components/Janela";
import Relogio from "@/components/Relogio";
import Icone from "@/components/Icone";
import Faixa from "@/components/Faixa";
import EdicaoRevista from "@/components/EdicaoRevista";
import { MetasDoMes, ProximoPost } from "@/components/PainelInicio";
import { FraseDoDia, LuaDeHoje } from "@/components/HojeNoCeu";
import { Bichinho, Borboleta, Cd, CelularFlip, CoracaoCromado, Cursor, EstrelaBrilhante, EstrelaOncinha } from "@/components/Adesivos";
import { ABAS, SITE } from "@/config/site";
import { buscarNoticias } from "@/lib/news";

export const revalidate = 1800;

const ATALHOS = ["/ideias", "/calendario", "/metas", "/noticias", "/astrologia", "/roletas", "/wishlist"];
const FAVORITOS = ["/wishlist", "/favoritos", "/album", "/consumo", "/bonequinha"];

export default async function Inicio() {
  const blocos = await buscarNoticias();
  const destaques = blocos.map((b) => ({ tema: b, n: b.noticias[0] })).filter((d) => d.n);
  const aba = (href: string) => ABAS.find((a) => a.href === href)!;

  return (
    <div className="pagina inicio">
      {/* ---------- topo: atalhos | capa | janelinhas ---------- */}
      <section className="inicio-topo">
        <div className="coluna-esq">
          <Janela titulo="atalhos" className="j-atalhos">
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

          <Janela titulo="bem-vinda!" className="j-bemvinda">
            <Relogio />
            <span className="adesivo-bichinho"><Bichinho tamanho={58} /></span>
          </Janela>
        </div>

        <div className="capa-centro">
          <span className="ad ad-borboleta"><Borboleta tamanho={64} /></span>
          <span className="ad ad-cd"><Cd tamanho={76} /></span>
          <span className="ad ad-cursor"><Cursor /></span>
          <span className="ad ad-estrela"><EstrelaBrilhante tamanho={46} /></span>

          <p className="capa-edicao"><EdicaoRevista /></p>
          <h1 className="capa-titulo">
            <span className="capa-alana">alana</span>
            <span className="capa-3d">behind the scenes</span>
          </h1>
          <p className="capa-sub">ideias, divas do pop, astrologia e muito glitter. o QG oficial da alana desde 2004 (mentira, desde agora).</p>
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

        <div className="coluna-dir">
          <Janela titulo="alana.jpg" className="j-foto">
            <div className="foto-moldura">
              <span className="foto-texto">a bonequinha da alana chega aqui</span>
            </div>
            <span className="adesivo-flip"><CelularFlip tamanho={96} /></span>
            <span className="adesivo-estrela-onca"><EstrelaOncinha tamanho={52} rosa /></span>
          </Janela>

          <Janela titulo="nova mensagem!" className="j-mensagem">
            <p className="msg-topo"><Icone nome="sobre" tamanho={14} /> você tem (1) nova mensagem</p>
            <FraseDoDia />
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

      {/* ---------- faixa holográfica ---------- */}
      <section className="faixa-holo">
        <Link href="/astrologia" className="holo-item">
          <Icone nome="astrologia" tamanho={30} traco={1.5} />
          <span><b>escorpião hoje</b><small>lua, horóscopo e mapa</small></span>
        </Link>
        <span className="holo-coracao"><CoracaoCromado tamanho={46} /></span>
        <Link href="/noticias" className="holo-item">
          <Icone nome="noticias" tamanho={30} traco={1.5} />
          <span><b>notícias fresquinhas</b><small>atualiza a cada 30 min</small></span>
        </Link>
        <span className="holo-coracao"><CoracaoCromado tamanho={46} /></span>
        <Link href="/roletas" className="holo-item">
          <Icone nome="roletas" tamanho={30} traco={1.5} />
          <span><b>gira a roleta</b><small>filme e tema do dia</small></span>
        </Link>
      </section>

      {/* ---------- janelinhas ---------- */}
      <section className="grade-inicio">
        <Janela titulo="notícias do dia" cor="oncinha" className="g-noticias">
          {destaques.length === 0 ? (
            <p className="nota-pequena">As notícias aparecem aqui quando o site estiver no ar.</p>
          ) : (
            <ul className="resumo-noticias">
              {destaques.map(({ tema, n }) => (
                <li key={tema.id}>
                  <span className="tag-tema">{tema.nome}</span>
                  <a href={n!.link} target="_blank" rel="noreferrer">{n!.titulo}</a>
                </li>
              ))}
            </ul>
          )}
          <Link href="/noticias" className="link-simples">ver todas →</Link>
        </Janela>

        <Janela titulo="horóscopo de escorpião" className="g-horoscopo">
          <LuaDeHoje />
          <p className="nota-pequena">O horóscopo completo chega na etapa da astrologia. <Link href="/astrologia">ver aba →</Link></p>
        </Janela>

        <Janela titulo="próximo post" className="g-post">
          <ProximoPost />
        </Janela>

        <Janela titulo="metas do mês" cor="oncinha" className="g-metas">
          <MetasDoMes />
        </Janela>

        <Janela titulo="cantinho do blog" className="g-blog">
          <ul className="lista-blog">
            <li><Link href="/blog">o que eu tô ouvindo essa semana</Link></li>
            <li><Link href="/blog">bastidores do meu primeiro reels</Link></li>
            <li><Link href="/blog">o quarto da casa da vó: antes</Link></li>
          </ul>
          <p className="nota-pequena">(posts de exemplo, o blog chega em breve)</p>
        </Janela>

        <Janela titulo="meus favs" className="g-favs">
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
      </section>

      <Faixa invertida />
      <p className="assinatura">siga <b>@{SITE.instagram}</b> ✦ xoxo, alana</p>
    </div>
  );
}
