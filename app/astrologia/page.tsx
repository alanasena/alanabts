import type { Metadata } from "next";
import Janela from "@/components/Janela";
import RodaMapa from "@/components/RodaMapa";
import Compatibilidade from "@/components/Compatibilidade";
import { CeuDeHoje, HoroscopoDoDia, PrevisaoMes } from "@/components/HoroscopoDoDia";
import { LuaDeHoje } from "@/components/HojeNoCeu";
import { casaDe, casas, formatarGrau, posicoes, SIGNOS, SIMBOLOS, signoDe } from "@/lib/astro";
import { BIG3, INTERPRETACOES, LINKS_ASTRO, NASCIMENTO, SOBRE_ESCORPIAO, VISUAL_H2O } from "@/config/astrologia";

export const metadata: Metadata = { title: "Astrologia" };

export default function Astrologia() {
  const { asc, mc, cuspides } = casas(NASCIMENTO.data, NASCIMENTO.lat, NASCIMENTO.lon);
  const planetas = posicoes(NASCIMENTO.data).map((p) => ({ ...p, casa: casaDe(p.lon, cuspides) }));
  const sol = planetas[0];
  const lua = planetas[1];

  return (
    <div className={`pagina astro h2o-${VISUAL_H2O}`}>
      <div className="mar" aria-hidden>
        {Array.from({ length: 14 }, (_, i) => (
          <span key={i} className="bolha-mar" style={{ left: `${(i * 37) % 100}%`, width: 8 + ((i * 7) % 20), height: 8 + ((i * 7) % 20), animationDelay: `${(i * 1.3) % 10}s`, animationDuration: `${10 + ((i * 3) % 8)}s` }} />
        ))}
      </div>

      {/* capa: lua cheia sobre o mar + colagem */}
      <section className="h2o-capa">
        <img className="h2o-capa-foto dia" src="/h2o/praia-coqueiros.webp" alt="" />
        <img className="h2o-capa-foto noite" src="/h2o/lua-mar.webp" alt="" />
        <div className="h2o-capa-brilho" />
        <img className="rc r-hib1" src="/h2o/hibisco-pink.webp" alt="" />
        <img className="rc r-hib2" src="/h2o/hibisco-azul.webp" alt="" />
        <img className="rc r-plu" src="/h2o/plumeria-rosa.webp" alt="" />
        <img className="rc r-concha" src="/h2o/concha-rosa.webp" alt="" />
        <img className="rc r-estrela" src="/h2o/estrela-coral.webp" alt="" />
        <img className="rc r-perolas" src="/h2o/perolas.webp" alt="" />
        <img className="rc r-concha2" src="/h2o/concha-branca.webp" alt="" />
        <img className="rc r-estrela2" src="/h2o/estrela-branca.webp" alt="" />
        <div className="h2o-capa-texto">
          <p className="h2o-sobre">♏︎ escorpião · lua em libra · ascendente em touro</p>
          <h1 className="titulo-pagina">astrologia</h1>
          <p className="h2o-sub">nascida sob a lua de Morada Nova, Ceará ✦ 09.11.2004</p>
        </div>
      </section>

      {/* Big 3 */}
      <section className="big3">
        {[
          { rot: "sol", s: sol.signo, txt: BIG3.sol, cor: "rosa" as const },
          { rot: "lua", s: lua.signo, txt: BIG3.lua, cor: "lilas" as const },
          { rot: "ascendente", s: signoDe(asc), txt: BIG3.asc, cor: "azul" as const },
        ].map((b) => (
          <Janela key={b.rot} titulo={`${b.rot}.exe`} cor={b.cor}>
            <p className="big3-rot">{b.rot}</p>
            <p className="big3-signo"><span>{SIMBOLOS[b.s]}</span> {SIGNOS[b.s].toLowerCase()}</p>
            <p className="big3-txt">{b.txt}</p>
          </Janela>
        ))}
      </section>

      {/* Horóscopo + lua */}
      <section className="astro-linha">
        <Janela titulo="horóscopo do dia" cor="rosa" className="j-horoscopo-dia">
          <HoroscopoDoDia />
        </Janela>
        <div className="astro-lateral">
          <Janela titulo="lua de hoje" cor="lilas">
            <LuaDeHoje />
          </Janela>
          <Janela titulo="previsão do mês" cor="ciano">
            <PrevisaoMes />
          </Janela>
          <img className="rc astro-borboleta" src="/h2o/hibisco-laranja.webp" alt="" />
        </div>
      </section>

      {/* moodboard */}
      <section className="h2o-mood" aria-hidden>
        {[["hibisco-agua", "mako island ✦"], ["por-do-sol-palmeiras", "pôr do sol"], ["vulcao", "a ilha"], ["estrelas-areia", "achados"], ["praia-flores", "paraíso"]].map(([f, t], i) => (
          <figure key={f} className={`polaroid-h2o p${i}`}>
            <img src={`/h2o/${f}.webp`} alt="" />
            <figcaption>{t}</figcaption>
          </figure>
        ))}
        <img className="rc mood-perola" src="/h2o/perola.webp" alt="" />
        <img className="rc mood-vidro" src="/h2o/vidro-mar.webp" alt="" />
      </section>

      {/* Mapa */}
      <section className="astro-mapa">
        <Janela titulo="mapa_astral_alana.jpg" cor="azul" className="j-roda">
          <RodaMapa planetas={planetas} asc={asc} mc={mc} cuspides={cuspides} />
          <img className="rc astro-estrela" src="/h2o/estrela-laranja.webp" alt="" />
        </Janela>
        <Janela titulo="seus planetas" cor="lilas" className="j-tabela">
          <table className="tabela-mapa">
            <tbody>
              {planetas.map((p) => (
                <tr key={p.id}>
                  <td className="simbolo">{p.simbolo}</td>
                  <td>{p.nome}</td>
                  <td>{SIMBOLOS[p.signo]} {SIGNOS[p.signo]}</td>
                  <td className="grau">{formatarGrau(p.lon)}{p.retro && " ℞"}</td>
                  <td className="casa">casa {p.casa}</td>
                </tr>
              ))}
              <tr><td className="simbolo">AC</td><td>Ascendente</td><td>{SIMBOLOS[signoDe(asc)]} {SIGNOS[signoDe(asc)]}</td><td className="grau">{formatarGrau(asc)}</td><td /></tr>
              <tr><td className="simbolo">MC</td><td>Meio do Céu</td><td>{SIMBOLOS[signoDe(mc)]} {SIGNOS[signoDe(mc)]}</td><td className="grau">{formatarGrau(mc)}</td><td /></tr>
            </tbody>
          </table>
          <p className="nota-pequena">casas no sistema Placidus · 9/11/2004 às 17h40 em {NASCIMENTO.local}</p>
        </Janela>
      </section>

      {/* Interpretações */}
      <Janela titulo="o que cada parte do seu mapa diz" cor="rosa" className="j-interpretacoes">
        <div className="interpretacoes">
          {[...planetas.map((p) => p.id), "Asc", "MC"].map((id) => {
            const i = INTERPRETACOES[id];
            const p = planetas.find((x) => x.id === id);
            return (
              <details key={id} className="interp" open={id === "Sun"}>
                <summary><span className="simbolo">{p?.simbolo ?? (id === "Asc" ? "AC" : "MC")}</span> {i.titulo}</summary>
                <p>{i.texto}</p>
              </details>
            );
          })}
        </div>
      </Janela>

      <div className="h2o-divisor" aria-hidden>
        <img src="/h2o/concha-listrada.webp" alt="" /><img src="/h2o/plumeria-branca.webp" alt="" /><img src="/h2o/estrela-creme.webp" alt="" /><img src="/h2o/hibisco-rosa.webp" alt="" /><img src="/h2o/lirio.webp" alt="" />
      </div>

      {/* Escorpião, compatibilidade, céu, links */}
      <section className="astro-final">
        <Janela titulo="tudo sobre escorpião" cor="lilas">
          <dl className="ficha">
            <dt>datas</dt><dd>{SOBRE_ESCORPIAO.datas}</dd>
            <dt>elemento</dt><dd>{SOBRE_ESCORPIAO.elemento}</dd>
            <dt>modalidade</dt><dd>{SOBRE_ESCORPIAO.modalidade}</dd>
            <dt>regentes</dt><dd>{SOBRE_ESCORPIAO.regentes}</dd>
            <dt>signo oposto</dt><dd>{SOBRE_ESCORPIAO.oposto}</dd>
            <dt>palavra-chave</dt><dd>{SOBRE_ESCORPIAO.palavra}</dd>
          </dl>
          <p className="rotulo-mini">qualidades</p>
          <p className="tags">{SOBRE_ESCORPIAO.qualidades.map((q) => <span key={q} className="tag">{q}</span>)}</p>
          <p className="rotulo-mini">desafios</p>
          <p className="tags">{SOBRE_ESCORPIAO.desafios.map((q) => <span key={q} className="tag tag-formato">{q}</span>)}</p>
          <ul className="lista-brilho">
            {SOBRE_ESCORPIAO.curiosidades.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </Janela>

        <Janela titulo="compatibilidade" cor="rosa">
          <Compatibilidade />
        </Janela>

        <div className="astro-lateral">
          <Janela titulo="céu de hoje" cor="azul">
            <CeuDeHoje />
          </Janela>
          <Janela titulo="ouvir e assistir" cor="ciano">
            <ul className="lista-favs">
              {LINKS_ASTRO.map((l) => (
                <li key={l.url}>
                  <a href={l.url} target="_blank" rel="noreferrer">
                    <span>{l.nome}</span>
                    <span className="seta">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </Janela>
        </div>
      </section>
    </div>
  );
}
