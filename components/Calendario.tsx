"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { TIPOS_EVENTO, type Evento, type Ideia } from "@/lib/tipos";
import { DIAS_SEMANA, MESES, hojeISO, inicioDaSemana, paraISO, somarDias, textoFaltam, dataBonita } from "@/lib/datas";
import Modal from "./Modal";

type Rascunho = Partial<Evento> & { data: string };
const icone = (t: string) => TIPOS_EVENTO.find((x) => x.id === t)?.icone ?? "✦";

export default function Calendario() {
  const [modo, setModo] = useState<"semana" | "mes">("semana");
  const [ref, setRef] = useState(() => new Date());
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [contadores, setContadores] = useState<Evento[]>([]);
  const [ideias, setIdeias] = useState<Pick<Ideia, "id" | "titulo" | "coluna">[]>([]);
  const [aberto, setAberto] = useState<Rascunho | null>(null);
  const [carregando, setCarregando] = useState(true);

  const dias = useMemo(() => {
    if (modo === "semana") {
      const ini = inicioDaSemana(ref);
      return Array.from({ length: 7 }, (_, i) => somarDias(ini, i));
    }
    const ini = inicioDaSemana(new Date(ref.getFullYear(), ref.getMonth(), 1));
    return Array.from({ length: 42 }, (_, i) => somarDias(ini, i));
  }, [modo, ref]);

  const carregar = useCallback(async () => {
    const sb = supabase();
    const [ev, ct, id] = await Promise.all([
      sb.from("eventos").select("*").gte("data", paraISO(dias[0])).lte("data", paraISO(dias[dias.length - 1])).order("hora", { nullsFirst: true }),
      sb.from("eventos").select("*").eq("contador", true).gte("data", hojeISO()).order("data"),
      sb.from("ideias").select("id,titulo,coluna").neq("coluna", "postado").order("criado_em", { ascending: false }),
    ]);
    setEventos((ev.data ?? []) as Evento[]);
    setContadores((ct.data ?? []) as Evento[]);
    setIdeias((id.data ?? []) as Pick<Ideia, "id" | "titulo" | "coluna">[]);
    setCarregando(false);
  }, [dias]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const andar = (n: number) =>
    setRef((r) => (modo === "semana" ? somarDias(r, 7 * n) : new Date(r.getFullYear(), r.getMonth() + n, 1)));

  const titulo =
    modo === "semana"
      ? `${dias[0].getDate()} ${MESES[dias[0].getMonth()].slice(0, 3)} – ${dias[6].getDate()} ${MESES[dias[6].getMonth()].slice(0, 3)} ${dias[6].getFullYear()}`
      : `${MESES[ref.getMonth()]} ${ref.getFullYear()}`;
  const hoje = hojeISO();

  return (
    <>
      {contadores.length > 0 && (
        <div className="contadores">
          {contadores.map((c) => (
            <button key={c.id} className="contador" onClick={() => setAberto(c)}>
              <span className="contador-num">{textoFaltam(c.data)}</span>
              <span>{c.titulo}</span>
            </button>
          ))}
        </div>
      )}

      <div className="cal-barra">
        <div className="cal-nav">
          <button className="bolinha" onClick={() => andar(-1)} aria-label="Anterior">◀</button>
          <button className="botao-preto" onClick={() => setRef(new Date())}>hoje</button>
          <button className="bolinha" onClick={() => andar(1)} aria-label="Próximo">▶</button>
        </div>
        <h2 className="cal-titulo">{titulo}</h2>
        <div className="alternar">
          <button className={modo === "semana" ? "ativo" : ""} onClick={() => setModo("semana")}>semana</button>
          <button className={modo === "mes" ? "ativo" : ""} onClick={() => setModo("mes")}>mês</button>
        </div>
      </div>

      {carregando ? (
        <p className="carregando-dados pixel">carregando calendário...</p>
      ) : (
        <div className={`cal-grade cal-${modo}`}>
          {modo === "mes" && DIAS_SEMANA.map((d) => <div key={d} className="cal-cabeca">{d}</div>)}
          {dias.map((d) => {
            const iso = paraISO(d);
            const doDia = eventos.filter((e) => e.data === iso);
            const fora = modo === "mes" && d.getMonth() !== ref.getMonth();
            return (
              <div
                key={iso}
                className={`cal-dia ${iso === hoje ? "hoje" : ""} ${fora ? "fora" : ""}`}
                onClick={() => setAberto({ data: iso, tipo: "post", titulo: "" })}
              >
                <div className="cal-dia-topo">
                  {modo === "semana" && <span className="cal-dia-nome">{DIAS_SEMANA[(d.getDay() + 6) % 7]}</span>}
                  <span className="cal-dia-num">{d.getDate()}</span>
                </div>
                <div className="cal-eventos">
                  {doDia.map((e) => (
                    <button
                      key={e.id}
                      className={`cal-evento tipo-${e.tipo}`}
                      onClick={(ev) => {
                        ev.stopPropagation();
                        setAberto(e);
                      }}
                    >
                      {e.hora && <b>{e.hora.slice(0, 5)}</b>} {e.titulo}
                      {e.contador && ""}
                    </button>
                  ))}
                </div>
                {modo === "semana" && <span className="cal-mais">+ adicionar</span>}
              </div>
            );
          })}
        </div>
      )}

      {aberto && (
        <EditarEvento
          evento={aberto}
          ideias={ideias}
          aoFechar={() => setAberto(null)}
          aoMudar={() => {
            setAberto(null);
            carregar();
          }}
        />
      )}
    </>
  );
}

function EditarEvento({
  evento,
  ideias,
  aoFechar,
  aoMudar,
}: {
  evento: Rascunho;
  ideias: Pick<Ideia, "id" | "titulo">[];
  aoFechar: () => void;
  aoMudar: () => void;
}) {
  const [f, setF] = useState<Rascunho>({ tipo: "post", contador: false, ...evento });
  const [aviso, setAviso] = useState("");
  const set = (k: keyof Rascunho, v: unknown) => setF((x) => ({ ...x, [k]: v }));

  const salvar = async () => {
    if (!f.titulo?.trim()) return setAviso("Coloca um título ✦");
    const dados = {
      titulo: f.titulo.trim(),
      data: f.data,
      hora: f.hora || null,
      tipo: f.tipo ?? "post",
      ideia_id: f.ideia_id || null,
      contador: !!f.contador,
      notas: f.notas || null,
    };
    const sb = supabase().from("eventos");
    const { error } = f.id ? await sb.update(dados).eq("id", f.id) : await sb.insert(dados);
    if (error) return setAviso("Não consegui salvar");
    aoMudar();
  };

  const excluir = async () => {
    if (!f.id || !confirm("Apagar do calendário?")) return;
    await supabase().from("eventos").delete().eq("id", f.id);
    aoMudar();
  };

  return (
    <Modal titulo={f.id ? "editar_dia.exe" : `${dataBonita(f.data)}.exe`} icone="" cor="zebra" aoFechar={aoFechar}>
      <div className="tipos">
        {TIPOS_EVENTO.map((t) => (
          <button key={t.id} className={f.tipo === t.id ? "ativo" : ""} onClick={() => set("tipo", t.id)}>
            {t.nome}
          </button>
        ))}
      </div>
      <div className="form-grade">
        {f.tipo === "post" && ideias.length > 0 && (
          <label className="largo">
            puxar do quadro de ideias
            <select
              value={f.ideia_id ?? ""}
              onChange={(e) => {
                const id = e.target.value;
                const ideia = ideias.find((i) => i.id === id);
                setF((x) => ({ ...x, ideia_id: id || null, titulo: x.titulo || ideia?.titulo || "" }));
              }}
            >
              <option value="">— nenhuma —</option>
              {ideias.map((i) => <option key={i.id} value={i.id}>{i.titulo}</option>)}
            </select>
          </label>
        )}
        <label className="largo">
          o que é?
          <input value={f.titulo ?? ""} onChange={(e) => set("titulo", e.target.value)} placeholder={f.tipo === "post" ? "ex: reels do look da semana" : "ex: consulta, aniversário, prova..."} />
        </label>
        <label>
          dia
          <input type="date" value={f.data} onChange={(e) => set("data", e.target.value)} />
        </label>
        <label>
          horário (opcional)
          <input type="time" value={f.hora?.slice(0, 5) ?? ""} onChange={(e) => set("hora", e.target.value)} />
        </label>
        <label className="largo">
          anotações
          <textarea rows={3} value={f.notas ?? ""} onChange={(e) => set("notas", e.target.value)} />
        </label>
        <label className="largo checkbox-glitter">
          <input type="checkbox" checked={!!f.contador} onChange={(e) => set("contador", e.target.checked)} />
          <span>ativar contador de dias até esse dia (aparece no início)</span>
        </label>
      </div>
      {aviso && <p className="aviso">{aviso}</p>}
      <div className="modal-acoes">
        {f.id && <button className="botao-perigo" onClick={excluir}>apagar</button>}
        <button className="botao-gloss" onClick={salvar}>salvar ✦</button>
      </div>
    </Modal>
  );
}
