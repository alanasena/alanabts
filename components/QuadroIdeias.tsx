"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase, subirFoto } from "@/lib/supabase";
import { COLUNAS, FORMATOS, TEMAS_CONTEUDO, type Ideia } from "@/lib/tipos";
import { hojeISO } from "@/lib/datas";
import Modal from "./Modal";

type Rascunho = Partial<Ideia> & { titulo: string };

export default function QuadroIdeias() {
  const [ideias, setIdeias] = useState<Ideia[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [aberta, setAberta] = useState<Rascunho | null>(null);
  const [arrastando, setArrastando] = useState<string | null>(null);
  const [sobre, setSobre] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("");
  const [rapida, setRapida] = useState("");

  const carregar = useCallback(async () => {
    const { data, error } = await supabase().from("ideias").select("*").order("ordem").order("criado_em", { ascending: false });
    if (error) setErro("Não consegui carregar as ideias 🥲");
    else setIdeias((data ?? []) as Ideia[]);
    setCarregando(false);
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const mover = async (id: string, coluna: string) => {
    const ordem = Date.now();
    setIdeias((l) => l.map((i) => (i.id === id ? { ...i, coluna, ordem } : i)));
    const { error } = await supabase().from("ideias").update({ coluna, ordem }).eq("id", id);
    if (error) carregar();
  };

  const criarRapida = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rapida.trim()) return;
    const { data, error } = await supabase()
      .from("ideias")
      .insert({ titulo: rapida.trim(), coluna: "ideia", ordem: -Date.now() })
      .select()
      .single();
    if (!error && data) setIdeias((l) => [data as Ideia, ...l]);
    setRapida("");
  };

  const visiveis = filtro ? ideias.filter((i) => i.tema === filtro) : ideias;

  if (carregando) return <p className="carregando-dados pixel">carregando ideias...</p>;

  return (
    <>
      <div className="barra-ferramentas">
        <form onSubmit={criarRapida} className="nova-rapida">
          <input value={rapida} onChange={(e) => setRapida(e.target.value)} placeholder="✦ anota uma ideia rapidinho..." />
          <button className="botao-gloss">+ ideia</button>
        </form>
        <button className="botao-preto" onClick={() => setAberta({ titulo: "", coluna: "ideia", imagens: [] })}>
          ✎ ideia completa
        </button>
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)} aria-label="Filtrar por tema">
          <option value="">todos os temas</option>
          {TEMAS_CONTEUDO.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      {erro && <p className="erro">{erro}</p>}

      <div className="quadro">
        {COLUNAS.map((col, ci) => {
          const cartoes = visiveis.filter((i) => i.coluna === col.id);
          return (
            <section
              key={col.id}
              className={`coluna coluna-${col.id} ${sobre === col.id ? "sobre" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setSobre(col.id);
              }}
              onDragLeave={() => setSobre(null)}
              onDrop={() => {
                if (arrastando) mover(arrastando, col.id);
                setArrastando(null);
                setSobre(null);
              }}
            >
              <h2 className="coluna-titulo">
                <span>{col.icone} {col.nome}</span>
                <span className="contagem">{cartoes.length}</span>
              </h2>
              <div className="coluna-cartoes">
                {cartoes.map((i) => (
                  <article
                    key={i.id}
                    className="cartao"
                    draggable
                    onDragStart={() => setArrastando(i.id)}
                    onDragEnd={() => setArrastando(null)}
                    onClick={() => setAberta(i)}
                  >
                    {i.imagens?.[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={i.imagens[0]} alt="" className="cartao-img" />
                    )}
                    <strong>{i.titulo}</strong>
                    <div className="cartao-tags">
                      {i.formato && <span className="tag tag-formato">{i.formato}</span>}
                      {i.tema && <span className="tag">{i.tema}</span>}
                    </div>
                    <div className="cartao-setas" onClick={(e) => e.stopPropagation()}>
                      <button disabled={ci === 0} onClick={() => mover(i.id, COLUNAS[ci - 1].id)} aria-label="Voltar coluna">◀</button>
                      <button disabled={ci === COLUNAS.length - 1} onClick={() => mover(i.id, COLUNAS[ci + 1].id)} aria-label="Avançar coluna">▶</button>
                    </div>
                  </article>
                ))}
                {cartoes.length === 0 && <p className="coluna-vazia">arrasta pra cá ✦</p>}
              </div>
            </section>
          );
        })}
      </div>

      {aberta && (
        <EditarIdeia
          ideia={aberta}
          aoFechar={() => setAberta(null)}
          aoSalvar={(salva) => {
            setIdeias((l) => (l.some((x) => x.id === salva.id) ? l.map((x) => (x.id === salva.id ? salva : x)) : [salva, ...l]));
            setAberta(null);
          }}
          aoExcluir={(id) => {
            setIdeias((l) => l.filter((x) => x.id !== id));
            setAberta(null);
          }}
        />
      )}
    </>
  );
}

function EditarIdeia({
  ideia,
  aoFechar,
  aoSalvar,
  aoExcluir,
}: {
  ideia: Rascunho;
  aoFechar: () => void;
  aoSalvar: (i: Ideia) => void;
  aoExcluir: (id: string) => void;
}) {
  const [f, setF] = useState<Rascunho>({ ...ideia, imagens: ideia.imagens ?? [] });
  const [salvando, setSalvando] = useState(false);
  const [subindo, setSubindo] = useState(false);
  const [dataPost, setDataPost] = useState(hojeISO());
  const [aviso, setAviso] = useState("");
  const set = (k: keyof Rascunho, v: unknown) => setF((x) => ({ ...x, [k]: v }));

  const salvar = async () => {
    if (!f.titulo.trim()) return setAviso("Dá um título pra ideia ✦");
    setSalvando(true);
    const dados = {
      titulo: f.titulo.trim(),
      descricao: f.descricao || null,
      formato: f.formato || null,
      tema: f.tema || null,
      link_referencia: f.link_referencia || null,
      imagens: f.imagens ?? [],
      coluna: f.coluna ?? "ideia",
    };
    const sb = supabase().from("ideias");
    const { data, error } = f.id
      ? await sb.update(dados).eq("id", f.id).select().single()
      : await sb.insert({ ...dados, ordem: -Date.now() }).select().single();
    setSalvando(false);
    if (error || !data) return setAviso("Não consegui salvar 🥲");
    aoSalvar(data as Ideia);
  };

  const excluir = async () => {
    if (!f.id || !confirm("Apagar essa ideia?")) return;
    await supabase().from("ideias").delete().eq("id", f.id);
    aoExcluir(f.id);
  };

  const agendar = async () => {
    if (!f.id) return setAviso("Salva a ideia primeiro, depois agenda 😉");
    const { error } = await supabase()
      .from("eventos")
      .insert({ titulo: f.titulo, data: dataPost, tipo: "post", ideia_id: f.id });
    setAviso(error ? "Não consegui agendar 🥲" : "Agendada no calendário! 📅");
  };

  const subir = async (arquivos: FileList | null) => {
    if (!arquivos?.length) return;
    setSubindo(true);
    try {
      const links = await Promise.all(Array.from(arquivos).map((a) => subirFoto(a, "ideias")));
      set("imagens", [...(f.imagens ?? []), ...links]);
    } catch {
      setAviso("Não consegui subir a imagem 🥲");
    }
    setSubindo(false);
  };

  return (
    <Modal titulo={f.id ? "editar_ideia.exe" : "nova_ideia.exe"} icone="💡" cor="rosa" aoFechar={aoFechar}>
      <div className="form-grade">
        <label className="largo">
          título
          <input value={f.titulo} onChange={(e) => set("titulo", e.target.value)} placeholder="ex: arrume-se comigo pra aula" autoFocus />
        </label>
        <label className="largo">
          descrição / roteiro
          <textarea rows={4} value={f.descricao ?? ""} onChange={(e) => set("descricao", e.target.value)} placeholder="como vai ser, falas, músicas..." />
        </label>
        <label>
          formato
          <select value={f.formato ?? ""} onChange={(e) => set("formato", e.target.value)}>
            <option value="">—</option>
            {FORMATOS.map((x) => <option key={x}>{x}</option>)}
          </select>
        </label>
        <label>
          tema
          <select value={f.tema ?? ""} onChange={(e) => set("tema", e.target.value)}>
            <option value="">—</option>
            {TEMAS_CONTEUDO.map((x) => <option key={x}>{x}</option>)}
          </select>
        </label>
        <label>
          etapa
          <select value={f.coluna ?? "ideia"} onChange={(e) => set("coluna", e.target.value)}>
            {COLUNAS.map((c) => <option key={c.id} value={c.id}>{c.icone} {c.nome}</option>)}
          </select>
        </label>
        <label>
          link de referência
          <input value={f.link_referencia ?? ""} onChange={(e) => set("link_referencia", e.target.value)} placeholder="https://..." />
        </label>

        <div className="largo">
          <span className="rotulo">imagens</span>
          <div className="miniaturas">
            {(f.imagens ?? []).map((url) => (
              <span key={url} className="miniatura">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" />
                <button onClick={() => set("imagens", (f.imagens ?? []).filter((u) => u !== url))} aria-label="Tirar imagem">×</button>
              </span>
            ))}
            <label className="subir-foto">
              {subindo ? "subindo..." : "+ foto"}
              <input type="file" accept="image/*" multiple hidden onChange={(e) => subir(e.target.files)} />
            </label>
          </div>
        </div>

        {f.link_referencia && (
          <a className="largo link-ref" href={f.link_referencia} target="_blank" rel="noreferrer">abrir referência ↗</a>
        )}

        {f.id && (
          <div className="largo agendar">
            <span className="rotulo">📅 jogar no calendário</span>
            <input type="date" value={dataPost} onChange={(e) => setDataPost(e.target.value)} />
            <button className="botao-preto" onClick={agendar}>agendar post</button>
          </div>
        )}
      </div>

      {aviso && <p className="aviso">{aviso}</p>}
      <div className="modal-acoes">
        {f.id && <button className="botao-perigo" onClick={excluir}>apagar</button>}
        <button className="botao-gloss" onClick={salvar} disabled={salvando}>{salvando ? "salvando..." : "salvar ✦"}</button>
      </div>
    </Modal>
  );
}
