import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Janela from "@/components/Janela";
import Relogio from "@/components/Relogio";
import Icone from "@/components/Icone";
import Faixa from "@/components/Faixa";
import MensagemNova from "@/components/MensagemNova";
import TocandoAgora from "@/components/TocandoAgora";
import { MetasDoMes, ProximoPost } from "@/components/PainelInicio";
import { LuaDeHoje } from "@/components/HojeNoCeu";
import {
  Bichinho, Bolsa, Bota, Borboleta, Cd, CelularFlip, Colar, CoracaoCromado, CoracaoStrass, Cursor,
  Envelope, EstrelaBrilhante, EstrelaLilas, Notebook,
} from "@/components/Adesivos";
import { ABAS, SITE } from "@/config/site";
import { buscarNoticias, haQuanto } from "@/lib/news";

export const revalidate = 1800;

const ATALHOS = ["/ideias", "/calendario", "/metas", "/noticias", "/astrologia", "/roletas", "/wishlist"];

// exemplos até você montar a sua playlist e a wishlist de verdade
const PLAYLIST_EXEMPLO = [
  ["Envolver", "Anitta"],
  ["Toxic", "Britney Spears"],
  ["Crazy in Love", "Beyoncé"],
  ["Umbrella", "Rihanna"],
  ["Hung Up", "Madonna"],
  ["Bad Romance", "Lady Gaga"],
  ["7 rings", "Ariana Grande"],
  ["Dirrty", "Christina Aguilera"],
];
const WISHLIST_EXEMPLO = [
  { nome: "bolsa de estrela", preco: "R$ 189", Desenho: Bolsa },
  { nome: "colar de estrela", preco: "R$ 79", Desenho: Colar },
  { nome: "bota plataforma", preco: "R$ 299", Desenho: Bota },
];

export default async function Inicio() {
  const blocos = await buscarNoticias();
  const noticias = blocos.flatMap((b) => b.noticias.slice(0, 2).map((n) => ({ tema: b.nome, ...n })));
  const aba = (href: string) => ABAS.find((a) => a.href === href)!;

  return (
    <div className="pagina inicio">
      {/* ================= LINHA 1 ================= */}
      <section className="inicio-topo">
        <div className="coluna-esq">
          <Janela titulo="atalhos" cor="azul">
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
            <span className="adesivo-bichinho"><Bichinho tamanho={70} /></span>
          </div>
        </div>

        <div className="capa-centro">
          <span className="ad ad-borboleta"><Borboleta tamanho={70} /></span>
          <span className="ad ad-estrela-a"><EstrelaBrilhante tamanho={28} cor="#ffffff" /></span>
          <span className="ad ad-cd"><Cd tamanho={96} /></span>
          <span className="ad ad-cursor"><Cursor /></span>
          <span className="ad ad-brilho1">✦</span>
          <span className="ad ad-brilho2">✧</span>
          <span className="ad ad-brilho3">✦</span>

          <h1 className="capa-titulo">
            <span className="capa-alana">alana</span>
            <span className="capa-3d">behind the scenes</span>
          </h1>
          <p className="capa-sub">ideias, divas do pop,<br />astrologia e muito glitter.</p>
          <div className="capa-botoes">
            <Link href="/ideias" className="botao-gloss">ver as ideias →</Link>
            <Link href="/sobre" className="botao-contorno">sobre mim</Link>
          </div>
          <p className="capa-links">
            <Link href="/noticias">notícias</Link>
            <Link href="/astrologia">horóscopo</Link>
            <Link href="/roletas">roletas</Link>
          </p>

          <div className="capa-cards">
            <Janela titulo="metas do mês" cor="lilas">
              <MetasDoMes />
            </Janela>
            <Janela titulo="escorpião hoje" cor="ciano">
              <LuaDeHoje />
              <Link href="/astrologia" className="link-simples">horóscopo completo →</Link>
            </Janela>
          </div>
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
          </Janela>
          <span className="adesivo-flip"><CelularFlip tamanho={118} /></span>
          <span className="adesivo-estrela-top"><EstrelaLilas tamanho={64} /></span>
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

        <div className="coluna-dir">
          <Janela titulo="nova mensagem!" cor="rosa">
            <MensagemNova />
          </Janela>

          <Janela titulo="tocando agora" cor="rosa">
            <TocandoAgora />
          </Janela>


            <Janela titulo="notícias do dia" cor="lilas" className="j-noticias-dir">
                      {noticias.length === 0 ? (
              <p className="nota-pequena">As notícias aparecem aqui quando o site estiver no ar.</p>
            ) : (
              <ul className="resumo-noticias">
                {noticias.slice(0, 3).map((n) => (
                  <li key={n.link}>
                    <a href={n.link} target="_blank" rel="noreferrer">› {n.titulo}</a>
                    <small>{n.tema}{n.data && ` · ${haQuanto(n.data)}`}</small>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/noticias" className="link-simples">ler todas as notícias →</Link>
          </Janela>
        </div>
      </section>

      {/* ================= LINHA 2 ================= */}
      <section className="linha-holo">
        <div className="faixa-holo">
          <span className="holo-ponta" />
          <Link href="/noticias" className="holo-item">
            <Icone nome="noticias" tamanho={34} traco={1.4} />
            <span><b>notícias quentes</b><small>política e divas do pop</small></span>
          </Link>
          <span className="holo-coracao"><CoracaoCromado tamanho={42} /></span>
          <Link href="/astrologia" className="holo-item">
            <Icone nome="astrologia" tamanho={34} traco={1.4} />
            <span><b>mapa astral</b><small>tudo sobre escorpião</small></span>
          </Link>
          <span className="holo-coracao"><CoracaoCromado tamanho={42} /></span>
          <Link href="/roletas" className="holo-item">
            <Icone nome="roletas" tamanho={34} traco={1.4} />
            <span><b>gira a roleta</b><small>filme e tema do dia</small></span>
          </Link>
          <span className="holo-ponta" />
        </div>

        <div className="caixa-clube">
          <span className="clube-envelope"><Envelope tamanho={58} /></span>
          <div>
            <p className="clube-titulo">entra pro clube! ♡</p>
            <p className="clube-texto">segue o daily pra ver os bastidores</p>
          </div>
          <a href={`https://instagram.com/${SITE.instagram}`} target="_blank" rel="noreferrer" className="botao-gloss pequeno">seguir!</a>
        </div>
      </section>

      {/* ================= LINHA 3 ================= */}
      <section className="grade-inicio">
        <Janela titulo="wishlist" cor="ciano">
          <div className="produtos">
            {WISHLIST_EXEMPLO.map(({ nome, preco, Desenho }) => (
              <div key={nome} className="produto">
                <div className="produto-foto"><Desenho tamanho={78} /></div>
                <p className="produto-nome">{nome}</p>
                <p className="produto-preco">{preco}</p>
                <Link href="/wishlist" className="botao-gloss mini">eu quero</Link>
              </div>
            ))}
          </div>
          <Link href="/wishlist" className="link-simples">» ver a wishlist toda</Link>
        </Janela>

        <Janela titulo="álbum de fotos" cor="lilas">
          <div className="polaroids">
            <figure className="polaroid p1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {SITE.foto ? <img src={SITE.foto} alt="" /> : <span />}
              <figcaption>eu ♡</figcaption>
            </figure>
            <figure className="polaroid p2"><span className="polaroid-vazio">família</span><figcaption>em breve</figcaption></figure>
            <figure className="polaroid p3"><span className="polaroid-vazio">amigas</span><figcaption>so cute!</figcaption></figure>
            <span className="polaroid-estrela"><EstrelaLilas tamanho={44} /></span>
          </div>
          <div className="album-rodape">
            <p>siga <b>@{SITE.instagram}</b><br />pra ver mais!</p>
            <Link href="/album" className="botao-lilas">ver álbum</Link>
          </div>
        </Janela>

        <Janela titulo="playlist" cor="azul">
          <ol className="playlist">
            {PLAYLIST_EXEMPLO.map(([musica, artista], i) => (
              <li key={musica} className={i === 1 ? "atual" : ""}>
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <span className="musica">{musica}</span>
                <span className="artista">{artista}</span>
              </li>
            ))}
          </ol>
          <p className="nota-pequena">(exemplo: sua playlist entra aqui)</p>
        </Janela>
      </section>

      {/* ================= LINHA 4 ================= */}
      <section className="grade-inicio linha4">
        <Janela titulo="cantinho do blog" cor="lilas" className="g-noticias">
          <span className="adesivo-notebook"><Notebook tamanho={84} /></span>
          <ul className="lista-blog">
            <li><Link href="/blog">o que eu tô ouvindo essa semana</Link></li>
            <li><Link href="/blog">bastidores do meu primeiro reels</Link></li>
            <li><Link href="/blog">o quarto da casa da vó: antes</Link></li>
          </ul>
          <p className="nota-pequena">(posts de exemplo, o blog chega em breve)</p>
          <Link href="/blog" className="link-simples">ler mais no blog →</Link>
        </Janela>

        <section className="banner-ceu">
          <span className="banner-envelope"><Envelope tamanho={60} /></span>
          <span className="banner-coracao"><CoracaoStrass tamanho={78} /></span>
          <span className="banner-borboleta"><Borboleta tamanho={52} /></span>
          <h2 className="texto-cromado">bem-vinda ao<br />meu mundo</h2>
          <p>eu não sigo tendência, eu crio a vibe.</p>
          <Link href="/ideias" className="botao-gloss">entrar →</Link>
        </section>

        <div className="coluna-painel">
          <Janela titulo="próximo post" cor="azul">
            <ProximoPost />
          </Janela>
          <span className="adesivo-coracao-cromo"><CoracaoCromado tamanho={64} /></span>
        </div>
      </section>

      <Faixa invertida />

      {/* ================= RODAPÉ ================= */}
      <footer className="rodape-site">
        <div className="rodape-marca">
          <span className="logo-alana">alana</span>
          <p>© 2004–{new Date().getFullYear()} alana bts<br />todos os direitos (e glitters) reservados.</p>
        </div>
        <div className="rodape-cols">
          <div>
            <b>conteúdo</b>
            <Link href="/ideias">ideias</Link><Link href="/calendario">calendário</Link><Link href="/blog">blog</Link>
          </div>
          <div>
            <b>eu</b>
            <Link href="/sobre">sobre mim</Link><Link href="/album">álbum</Link><Link href="/wishlist">wishlist</Link>
          </div>
          <div>
            <b>diversão</b>
            <Link href="/astrologia">astrologia</Link><Link href="/roletas">roletas</Link><Link href="/bonequinha">bonequinha</Link>
          </div>
        </div>
        <div className="rodape-amigas">
          <b>vamos ser amigas!</b>
          <a href={`https://instagram.com/${SITE.instagram}`} target="_blank" rel="noreferrer" className="bolinha-social">ig</a>
        </div>
        <div className="selo-xp">
          <span className="iniciar-logo" aria-hidden />
          <span>feito para<br /><b>alana XP</b></span>
        </div>
      </footer>
    </div>
  );
}
