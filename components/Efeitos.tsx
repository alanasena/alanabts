"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type Ctx = {
  noite: boolean;
  alternarNoite: () => void;
  sons: boolean;
  alternarSons: () => void;
  tocarBlip: () => void;
  visual: string;
  trocarVisual: () => void;
};

const EfeitosCtx = createContext<Ctx | null>(null);
export const useEfeitos = () => useContext(EfeitosCtx)!;

function ler(chave: string, padrao: string) {
  try {
    return localStorage.getItem(chave) ?? padrao;
  } catch {
    return padrao;
  }
}
function salvar(chave: string, valor: string) {
  try {
    localStorage.setItem(chave, valor);
  } catch {}
}

const CORES_GLITTER = ["#ff4fb8", "#ffd84f", "#59e1ff", "#ffffff", "#c58bff", "#7dff9c"];

export default function Efeitos({ children }: { children: React.ReactNode }) {
  const [noite, setNoite] = useState(false);
  const [sons, setSons] = useState(true);
  const [visual, setVisual] = useState("");
  const audio = useRef<AudioContext | null>(null);
  const sonsRef = useRef(true);

  useEffect(() => {
    setNoite(ler("bts:tema", "dia") === "noite");
    setVisual(document.documentElement.dataset.visual ?? "foto");
    const s = ler("bts:sons", "sim") === "sim";
    setSons(s);
    sonsRef.current = s;
  }, []);

  useEffect(() => {
    document.documentElement.dataset.tema = noite ? "noite" : "dia";
  }, [noite]);

  const tocarBlip = useCallback(() => {
    if (!sonsRef.current) return;
    try {
      audio.current ??= new AudioContext();
      const ctx = audio.current;
      const t = ctx.currentTime;
      [1318, 1760].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, t + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.08, t + i * 0.05 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.05 + 0.12);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t + i * 0.05);
        osc.stop(t + i * 0.05 + 0.13);
      });
    } catch {}
  }, []);

  // som em todo clique de botão/link
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const alvo = (e.target as HTMLElement).closest("a, button, [role=button], summary");
      if (alvo) tocarBlip();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [tocarBlip]);

  // rastro de glitter (só com mouse) + explosão de brilho no toque
  useEffect(() => {
    const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (semMovimento) return;
    let ultimo = 0;
    let vivos = 0;

    const criar = (x: number, y: number, espalhar = 0) => {
      if (vivos > 70) return;
      const el = document.createElement("span");
      el.className = "glitter";
      const tamanho = 4 + Math.random() * 7;
      el.style.left = `${x + (Math.random() - 0.5) * (10 + espalhar)}px`;
      el.style.top = `${y + (Math.random() - 0.5) * (10 + espalhar)}px`;
      el.style.width = el.style.height = `${tamanho}px`;
      el.style.setProperty("--cor", CORES_GLITTER[Math.floor(Math.random() * CORES_GLITTER.length)]);
      el.style.setProperty("--dx", `${(Math.random() - 0.5) * 40}px`);
      if (Math.random() > 0.55) el.classList.add("estrela");
      document.body.appendChild(el);
      vivos++;
      el.addEventListener("animationend", () => {
        el.remove();
        vivos--;
      });
    };

    const mover = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const agora = performance.now();
      if (agora - ultimo < 28) return;
      ultimo = agora;
      criar(e.clientX, e.clientY);
    };
    const tocar = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      for (let i = 0; i < 10; i++) criar(e.clientX, e.clientY, 50);
    };
    window.addEventListener("pointermove", mover, { passive: true });
    window.addEventListener("pointerdown", tocar, { passive: true });
    return () => {
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerdown", tocar);
    };
  }, []);

  const trocarVisual = () => {
    const novo = visual === "oncinha" ? "foto" : "oncinha";
    document.documentElement.dataset.visual = novo;
    salvar("bts:visual", novo);
    setVisual(novo);
  };

  const alternarNoite = () =>
    setNoite((n) => {
      salvar("bts:tema", n ? "dia" : "noite");
      return !n;
    });
  const alternarSons = () =>
    setSons((s) => {
      salvar("bts:sons", s ? "nao" : "sim");
      sonsRef.current = !s;
      return !s;
    });

  return (
    <EfeitosCtx.Provider value={{ noite, alternarNoite, sons, alternarSons, tocarBlip, visual, trocarVisual }}>
      {children}
    </EfeitosCtx.Provider>
  );
}
