"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ELEMENTO, PLANETAS, SIGNOS, SIMBOLOS, formatarGrau, signoDe } from "@/lib/astro";
import { ASPECTOS, CASA_DO_PLANETA, LEITURA_PLANETAS, LEITURA_SIGNO_CASA, NOME_ASPECTO, SIGNIFICADO_CASA } from "@/config/mapa-leituras";

type Item = { id: string; lon: number };
type Props = { planetas: Item[]; asc: number; mc: number; cuspides: number[] };
type Aba = "planetas" | "signos" | "aspectos" | "casas";

const COR_ELEMENTO: Record<string, string> = { fogo: "#e0185f", terra: "#5aa02c", ar: "#f39200", água: "#0099d6" };
const nomePlaneta = (id: string) => PLANETAS.find((p) => p.id === id)!;

function Signo({ s }: { s: number }) {
  return (
    <span className="tm-signo">
      <i style={{ background: COR_ELEMENTO[ELEMENTO[s]] }}>{SIMBOLOS[s]}</i> {SIGNOS[s]}
    </span>
  );
}

// Linha que abre a explicação ao clicar
function Linha({ aberta, onClick, children, texto }: { aberta: boolean; onClick: () => void; children: React.ReactNode; texto: string }) {
  return (
    <>
      <button className={`tm-linha ${aberta ? "aberta" : ""}`} onClick={onClick} aria-expanded={aberta}>
        {children}
        <ChevronDown size={15} className="tm-seta" />
      </button>
      {aberta && <p className="tm-leitura">{texto}</p>}
    </>
  );
}

export default function TabelasMapa({ planetas, asc, mc, cuspides }: Props) {
  const [aba, setAba] = useState<Aba>("planetas");
  const [aberta, setAberta] = useState<string | null>("Sun");
  const alternar = (id: string) => setAberta((a) => (a === id ? null : id));
  const lon = (id: string) => planetas.find((p) => p.id === id)!.lon;

  const pontos = [
    { id: "Asc", nome: "Ascendente", lon: asc, casa: 1 },
    { id: "MC", nome: "Meio do Céu", lon: mc, casa: 10 },
    { id: "DSC", nome: "Descendente", lon: (asc + 180) % 360, casa: 7 },
    { id: "FC", nome: "Fundo do Céu", lon: (mc + 180) % 360, casa: 4 },
  ];

  return (
    <div className="tabelas-mapa">
      <div className="tm-abas" role="tablist">
        {([["planetas", "planetas"], ["signos", "signos nas casas"], ["aspectos", "aspectos"], ["casas", "casas"]] as [Aba, string][]).map(([id, nome]) => (
          <button key={id} role="tab" aria-selected={aba === id} className={aba === id ? "ativa" : ""} onClick={() => { setAba(id); setAberta(null); }}>
            {nome}
          </button>
        ))}
      </div>
      <p className="tm-dica">toca em uma linha pra ler o que significa ✦</p>

      {aba === "planetas" && (
        <div className="tm-lista">
          <div className="tm-cab tm-4"><span>planeta</span><span>signo</span><span>casa</span><span>grau</span></div>
          {PLANETAS.map((p) => (
            <Linha key={p.id} aberta={aberta === p.id} onClick={() => alternar(p.id)} texto={LEITURA_PLANETAS[p.id]}>
              <span className="tm-4">
                <span className="tm-planeta"><i>{p.simbolo}</i> {p.nome}</span>
                <Signo s={signoDe(lon(p.id))} />
                <span>{CASA_DO_PLANETA[p.id]}</span>
                <span className="tm-grau">{formatarGrau(lon(p.id))}</span>
              </span>
            </Linha>
          ))}
          {pontos.map((p) => (
            <Linha key={p.id} aberta={aberta === p.id} onClick={() => alternar(p.id)} texto={LEITURA_PLANETAS[p.id]}>
              <span className="tm-4">
                <span className="tm-planeta">{p.nome}</span>
                <Signo s={signoDe(p.lon)} />
                <span>{p.casa}</span>
                <span className="tm-grau">{formatarGrau(p.lon)}</span>
              </span>
            </Linha>
          ))}
        </div>
      )}

      {aba === "signos" && (
        <div className="tm-lista">
          <div className="tm-cab tm-3"><span>signo</span><span>elemento</span><span>casa</span></div>
          {SIGNOS.map((_, s) => {
            const casa = cuspides.findIndex((c) => signoDe(c) === s) + 1;
            const id = `s${s}`;
            return (
              <Linha key={id} aberta={aberta === id} onClick={() => alternar(id)} texto={casa ? `${SIGNOS[s]} na casa ${casa}: ${LEITURA_SIGNO_CASA[casa]}` : ""}>
                <span className="tm-3">
                  <Signo s={s} />
                  <span style={{ color: COR_ELEMENTO[ELEMENTO[s]] }}>{ELEMENTO[s]}</span>
                  <span>{casa || "–"}</span>
                </span>
              </Linha>
            );
          })}
        </div>
      )}

      {aba === "aspectos" && (
        <div className="tm-lista">
          {ASPECTOS.map((a) => {
            const t = NOME_ASPECTO[a.tipo];
            const id = a.a + a.b;
            return (
              <Linha key={id} aberta={aberta === id} onClick={() => alternar(id)} texto={a.texto}>
                <span className="tm-aspecto">
                  <span className="tm-planeta"><i>{nomePlaneta(a.a).simbolo}</i> {nomePlaneta(a.a).nome}</span>
                  <span className={`tm-tipo ${t.tenso ? "tenso" : ""}`}><b>{t.simbolo}</b> {t.nome.toLowerCase()}</span>
                  <span className="tm-planeta"><i>{nomePlaneta(a.b).simbolo}</i> {nomePlaneta(a.b).nome}</span>
                </span>
              </Linha>
            );
          })}
          <p className="tm-legenda"><span className="azul">azul</span> = harmonia · <span className="vermelho">vermelho</span> = desafio</p>
        </div>
      )}

      {aba === "casas" && (
        <div className="tm-lista">
          <div className="tm-cab tm-4"><span>casa</span><span>planetas</span><span>signo</span><span>grau</span></div>
          {cuspides.map((c, i) => {
            const n = i + 1;
            const ali = PLANETAS.filter((p) => CASA_DO_PLANETA[p.id] === n).map((p) => p.nome);
            const id = `c${n}`;
            return (
              <Linha key={id} aberta={aberta === id} onClick={() => alternar(id)} texto={`${SIGNIFICADO_CASA[n]}${ali.length ? ` Aqui estão: ${ali.join(", ")}.` : ""}`}>
                <span className="tm-4">
                  <span className="tm-planeta"><i className="num">{n}</i> casa {String(n).padStart(2, "0")}</span>
                  <span className="tm-ali">{ali.length ? ali.join(", ") : "–"}</span>
                  <span>{SIGNOS[signoDe(c)]}</span>
                  <span className="tm-grau">{formatarGrau(c)}</span>
                </span>
              </Linha>
            );
          })}
        </div>
      )}
    </div>
  );
}
