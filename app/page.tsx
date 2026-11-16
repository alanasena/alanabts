import Link from "next/link";
import Janela from "@/components/Janela";
import Relogio from "@/components/Relogio";
import EdicaoRevista from "@/components/EdicaoRevista";
import { MetasDoMes, ProximoPost } from "@/components/PainelInicio";
import { FraseDoDia, LuaDeHoje } from "@/components/HojeNoCeu";
import { Bilhete, Boca, CelularFlip, CoracaoStrass, Cd, EstrelaOncinha, EstrelaZebra, Gloss, Tocador } from "@/components/Adesivos";
import { ABAS, SITE } from "@/config/site";
import { buscarNoticias } from "@/lib/news";

export const revalidate = 1800;

export default async function Inicio() {
  const blocos = await buscarNoticias();
  const destaques = blocos.map((b) => ({ tema: b, n: b.noticias[0] })).filter((d) => d.n);
  const manchete = blocos.find((b) => b.id === "pop")?.noticias[0] ?? destaques[0]?.n;

  return (
    <div className="pagina vibe-revista-capa">
      {/* ---------- CAPA DE REVISTA ---------- */}
      <section className="capa">
        <div className="capa-topo">
          <EdicaoRevista />
        </div>

        <h1 className="capa-titulo">
          <span className="capa-alana">ALANA</span>
          <span className="capa-sub">behind the scenes</span>
        </h1>

        <div className="capa-miolo">
          <ul className="chamadas esquerda">
            <li>
              <Link href="/astrologia">
                <b>EXCLUSIVO!</b> O que os astros querem de Escorpião hoje
              </Link>
            </li>
            <li>
              <Link href="/wishlist">
                <b>WISHLIST</b> Tudo que ela quer (e vai ter)
              </Link>
            </li>
            <li>
              <Link href="/roletas">
                <b>ROLETA</b> Gire e descubra o filme da semana
              </Link>
            </li>
          </ul>

          <div className="capa-estrela">
            <div className="capa-colagem">
              <span className="c1"><CelularFlip tamanho={150} /></span>
              <span className="c2"><CoracaoStrass tamanho={120} /></span>
              <span className="c3"><Cd tamanho={120} /></span>
              <span className="c4"><Gloss tamanho={120} /></span>
              <span className="c5"><EstrelaZebra tamanho={80} /></span>
              <span className="c6"><Boca tamanho={110} /></span>
              <span className="c7"><Tocador tamanho={110} /></span>
            </div>
            <div className="selo-explosao">
              <span>100%</span>
              <strong>DIVA</strong>
            </div>
            <p className="capa-boneca-aviso">✦ em breve: a Alana bonequinha na capa ✦</p>
          </div>

          <ul className="chamadas direita">
            <li>
              <Link href="/noticias">
                <b>FOFOCA BOA</b> {manchete ? manchete.titulo : "As notícias quentes do dia (sem tigrinho!)"}
              </Link>
            </li>
            <li>
              <Link href="/bonequinha">
                <b>TESTE</b> Monte o look da Alana e baixe a foto
              </Link>
            </li>
            <li>
              <Link href="/blog">
                <b>DIÁRIO</b> Os bastidores que ninguém te conta
              </Link>
            </li>
          </ul>
        </div>

        <div className="capa-rodape">
          <span className="codigo-barras" aria-hidden />
          <span>siga @{SITE.instagram}</span>
          <span className="preco">R$ 9,99</span>
        </div>
      </section>

      <p className="marquee-y2k">
        <span>✦ bem-vindo(a) ao meu QG ✦ moda ✦ make ✦ cabelo ✦ cultura pop ✦ astrologia ✦ divas do pop ✦ siga @{SITE.instagram} ✦ ♡ ✦ xoxo ✦</span>
      </p>

      {/* ---------- ATALHOS ---------- */}
      <nav className="atalhos" aria-label="Atalhos">
        {ABAS.filter((a) => a.href !== "/").map((a) => (
          <Link key={a.href} href={a.href} className="atalho">
            <span className="atalho-img" aria-hidden>{a.icone}</span>
            <span className="atalho-nome">{a.nome}</span>
          </Link>
        ))}
      </nav>

      {/* ---------- MURAL ---------- */}
      <div className="mural">
        <Janela titulo="bem-vinda.exe" icone="💖" cor="rosa" fita className="j-relogio">
          <Relogio />
        </Janela>

        <Janela titulo="frase_do_dia.txt" icone="💋" cor="preto" fita className="j-frase">
          <FraseDoDia />
        </Janela>

        <Janela titulo="horoscopo_escorpiao.exe" icone="🦂" cor="oncinha" fita className="j-horoscopo">
          <LuaDeHoje />
          <p className="nota-pequena">
            ♏ O horóscopo completo do dia chega na etapa da astrologia. <Link href="/astrologia">ver aba →</Link>
          </p>
        </Janela>

        <Janela titulo="noticias_do_dia.exe" icone="📰" cor="zebra" fita className="j-noticias">
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
          <Link href="/noticias" className="botao-gloss">ver todas as notícias</Link>
        </Janela>

        <Janela titulo="proximo_post.exe" icone="📅" cor="prata" fita className="j-post">
          <ProximoPost />
        </Janela>

        <Janela titulo="metas_do_mes.exe" icone="⭐" cor="rosa" fita className="j-metas">
          <MetasDoMes />
        </Janela>

        <div className="mural-bilhetes" aria-hidden>
          <Bilhete texto="não pensa demais ♡" rot={-5} />
          <Bilhete texto="coisas boas levam tempo ✦" rot={4} />
          <span className="mural-estrela"><EstrelaOncinha tamanho={70} /></span>
        </div>
      </div>
    </div>
  );
}
