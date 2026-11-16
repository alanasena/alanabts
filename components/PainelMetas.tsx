"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AREAS, type Meta, type Tarefa } from "@/lib/tipos";
import { MESES, hojeISO, dataBonita } from "@/lib/datas";
import Janela from "./Janela";

function mensagem(feitas: number, total: number) {
  if (!total) return "Nenhuma meta ainda. Bora escrever? ✍️";
  const p = feitas / total;
  if (p === 1) return "TODAS! Você é a diva do planejamento 👑";
  if (p >= 0.7) return "Quase lá, tá arrasando 💅";
  if (p >= 0.4) return "Metade do caminho, segue o baile ✨";
  return "Devagarinho também chega 🐢💖";
}

export default function PainelMetas() {
  const agora = new Date();
  const [ano, setAno] = useState(agora.getFullYear());
  const [mes, setMes] = useState(agora.getMonth() + 1);

  const andar = (n: number) => {
    const d = new Date(ano, mes - 1 + n, 1);
    setAno(d.getFullYear());
    setMes(d.getMonth() + 1);
  };

  return (
    <>
      <div className="cal-barra">
        <div className="cal-nav">
          <button className="bolinha" onClick={() => andar(-1)} aria-label="Mês anterior">◀</button>
          <button
            className="botao-preto"
            onClick={() => {
              setAno(agora.getFullYear());
              setMes(agora.getMonth() + 1);
            }}
          >
            este mês
          </button>
          <button className="bolinha" onClick={() => andar(1)} aria-label="Próximo mês">▶</button>
        </div>
        <h2 className="cal-titulo">{MESES[mes - 1]} {ano}</h2>
        <span />
      </div>

      <div className="metas-grade">
        <ListaMetas key={`m${ano}-${mes}`} periodo="mes" ano={ano} mes={mes} titulo={`metas de ${MESES[mes - 1]}`} cor="rosa" />
        <ListaMetas key={`a${ano}`} periodo="ano" ano={ano} titulo={`metas de ${ano}`} cor="oncinha" />
        <Tarefas />
        <ResumoMes key={`r${ano}-${mes}`} ano={ano} mes={mes} />
      </div>
    </>
  );
}

function ListaMetas({ periodo, ano, mes, titulo, cor }: { periodo: "mes" | "ano"; ano: number; mes?: number; titulo: string; cor: "rosa" | "oncinha" }) {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [nova, setNova] = useState("");
  const [area, setArea] = useState(AREAS[0]);

  const carregar = useCallback(async () => {
    let q = supabase().from("metas").select("*").eq("periodo", periodo).eq("ano", ano);
    if (periodo === "mes") q = q.eq("mes", mes!);
    const { data } = await q.order("criado_em");
    setMetas((data ?? []) as Meta[]);
  }, [periodo, ano, mes]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const adicionar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nova.trim()) return;
    const { data } = await supabase()
      .from("metas")
      .insert({ titulo: nova.trim(), area, periodo, ano, mes: periodo === "mes" ? mes : null })
      .select()
      .single();
    if (data) setMetas((l) => [...l, data as Meta]);
    setNova("");
  };

  const marcar = async (m: Meta) => {
    setMetas((l) => l.map((x) => (x.id === m.id ? { ...x, concluida: !x.concluida } : x)));
    await supabase()
      .from("metas")
      .update({ concluida: !m.concluida, concluida_em: !m.concluida ? new Date().toISOString() : null })
      .eq("id", m.id);
  };

  const apagar = async (id: string) => {
    if (!confirm("Apagar essa meta?")) return;
    setMetas((l) => l.filter((x) => x.id !== id));
    await supabase().from("metas").delete().eq("id", id);
  };

  const feitas = metas.filter((m) => m.concluida).length;
  const areas = AREAS.filter((a) => metas.some((m) => m.area === a));
  const semArea = metas.filter((m) => !m.area || !AREAS.includes(m.area));

  return (
    <Janela titulo={`${titulo}.exe`} icone={periodo === "mes" ? "⭐" : "👑"} cor={cor} fita>
      <div className="progresso">
        <div className="progresso-barra">
          <span style={{ width: `${metas.length ? (feitas / metas.length) * 100 : 0}%` }} />
        </div>
        <p className="progresso-texto">
          <b>cumpri {feitas} de {metas.length}</b> · {mensagem(feitas, metas.length)}
        </p>
      </div>

      {[...areas.map((a) => ({ a, lista: metas.filter((m) => m.area === a) })), ...(semArea.length ? [{ a: "Outras", lista: semArea }] : [])].map(
        ({ a, lista }) => (
          <div key={a} className="grupo-area">
            <h3>{a}</h3>
            <ul className="lista-check">
              {lista.map((m) => (
                <li key={m.id} className={m.concluida ? "feita" : ""}>
                  <label>
                    <input type="checkbox" checked={m.concluida} onChange={() => marcar(m)} />
                    <span>{m.titulo}</span>
                  </label>
                  <button className="apagar-mini" onClick={() => apagar(m.id)} aria-label="Apagar">×</button>
                </li>
              ))}
            </ul>
          </div>
        ),
      )}

      <form className="adicionar-linha" onSubmit={adicionar}>
        <input value={nova} onChange={(e) => setNova(e.target.value)} placeholder="nova meta..." />
        <select value={area} onChange={(e) => setArea(e.target.value)} aria-label="Área">
          {AREAS.map((a) => <option key={a}>{a}</option>)}
        </select>
        <button className="botao-gloss">+</button>
      </form>
    </Janela>
  );
}

function Tarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [nova, setNova] = useState("");
  const [data, setData] = useState(hojeISO());
  const [verFeitas, setVerFeitas] = useState(false);

  const carregar = useCallback(async () => {
    const { data } = await supabase().from("tarefas").select("*").order("data", { nullsFirst: false }).order("criado_em");
    setTarefas((data ?? []) as Tarefa[]);
  }, []);
  useEffect(() => {
    carregar();
  }, [carregar]);

  const adicionar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nova.trim()) return;
    const { data: t } = await supabase().from("tarefas").insert({ titulo: nova.trim(), data: data || null }).select().single();
    if (t) setTarefas((l) => [...l, t as Tarefa]);
    setNova("");
  };

  const marcar = async (t: Tarefa) => {
    setTarefas((l) => l.map((x) => (x.id === t.id ? { ...x, concluida: !x.concluida } : x)));
    await supabase().from("tarefas").update({ concluida: !t.concluida }).eq("id", t.id);
  };
  const apagar = async (id: string) => {
    setTarefas((l) => l.filter((x) => x.id !== id));
    await supabase().from("tarefas").delete().eq("id", id);
  };

  const hoje = hojeISO();
  const pendentes = tarefas.filter((t) => !t.concluida);
  const feitas = tarefas.filter((t) => t.concluida);

  return (
    <Janela titulo="tarefas_e_compromissos.exe" icone="📌" cor="zebra" fita>
      <ul className="lista-check">
        {pendentes.length === 0 && <li className="vazio">Nada pendente. Pode ir passar um gloss 💄</li>}
        {pendentes.map((t) => (
          <li key={t.id} className={t.data && t.data < hoje ? "atrasada" : ""}>
            <label>
              <input type="checkbox" checked={false} onChange={() => marcar(t)} />
              <span>
                {t.titulo}
                {t.data && <small> · {t.data === hoje ? "hoje" : dataBonita(t.data)}</small>}
              </span>
            </label>
            <button className="apagar-mini" onClick={() => apagar(t.id)} aria-label="Apagar">×</button>
          </li>
        ))}
      </ul>
      {feitas.length > 0 && (
        <button className="link-simples" onClick={() => setVerFeitas((v) => !v)}>
          {verFeitas ? "esconder" : "ver"} feitas ({feitas.length})
        </button>
      )}
      {verFeitas && (
        <ul className="lista-check">
          {feitas.map((t) => (
            <li key={t.id} className="feita">
              <label>
                <input type="checkbox" checked onChange={() => marcar(t)} />
                <span>{t.titulo}</span>
              </label>
              <button className="apagar-mini" onClick={() => apagar(t.id)} aria-label="Apagar">×</button>
            </li>
          ))}
        </ul>
      )}
      <form className="adicionar-linha" onSubmit={adicionar}>
        <input value={nova} onChange={(e) => setNova(e.target.value)} placeholder="nova tarefa..." />
        <input type="date" value={data} onChange={(e) => setData(e.target.value)} aria-label="Data" />
        <button className="botao-gloss">+</button>
      </form>
    </Janela>
  );
}

function ResumoMes({ ano, mes }: { ano: number; mes: number }) {
  const [texto, setTexto] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    supabase()
      .from("resumos_mes")
      .select("texto")
      .eq("ano", ano)
      .eq("mes", mes)
      .maybeSingle()
      .then(({ data }) => setTexto(data?.texto ?? ""));
  }, [ano, mes]);

  const salvar = async () => {
    setStatus("salvando...");
    const { error } = await supabase().from("resumos_mes").upsert({ ano, mes, texto }, { onConflict: "ano,mes" });
    setStatus(error ? "não salvou 🥲" : "salvo ✓");
  };

  return (
    <Janela titulo={`querido_diario_${MESES[mes - 1]}.txt`} icone="📓" cor="preto" fita>
      <p className="nota-pequena" style={{ marginTop: 0 }}>Como foi o mês? O que deu certo, o que ficou pro próximo...</p>
      <textarea className="diario" rows={7} value={texto} onChange={(e) => setTexto(e.target.value)} onBlur={salvar} placeholder="querido diário..." />
      <div className="modal-acoes">
        <span className="nota-pequena">{status}</span>
        <button className="botao-gloss" onClick={salvar}>salvar ✦</button>
      </div>
    </Janela>
  );
}
