// Adesivos desenhados do zero (SVG): oncinha, strass, gloss, CD, flip phone, boca...

// id único por adesivo (senão um adesivo escondido "apaga" o desenho do outro)
const uid = () => Math.random().toString(36).slice(2, 8);

const ESTRELA = "M50 4 L62 36 L96 38 L69 59 L79 93 L50 73 L21 93 L31 59 L4 38 L38 36 Z";

export function EstrelaOncinha({ tamanho = 70, rosa = false }: { tamanho?: number; rosa?: boolean }) {
  const u = uid();
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" aria-hidden>
      <defs>
        <pattern id={u} width="60" height="60" patternUnits="userSpaceOnUse">
          <image href={rosa ? "/oncinha-rosa.webp" : "/oncinha.webp"} width="60" height="60" />
        </pattern>
      </defs>
      <path d={ESTRELA} fill={`url(#${u})`} stroke="#141010" strokeWidth="5" strokeLinejoin="round" />
    </svg>
  );
}

export function CoracaoStrass({ tamanho = 64, cor = "#f26aa6" }: { tamanho?: number; cor?: string }) {
  const id = `st${uid()}`;
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" aria-hidden>
      <defs>
        <radialGradient id={`${id}-g`} cx="35%" cy="30%" r="70%">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".45" stopColor={cor} />
          <stop offset="1" stopColor="#8a1f4f" />
        </radialGradient>
        <pattern id={id} width="9" height="9" patternUnits="userSpaceOnUse">
          <rect width="9" height="9" fill="#a8245e" />
          <circle cx="4.5" cy="4.5" r="3.6" fill={`url(#${id}-g)`} />
        </pattern>
      </defs>
      <path d="M50 90 C18 66 4 50 4 31 C4 16 16 6 30 6 C39 6 46 11 50 19 C54 11 61 6 70 6 C84 6 96 16 96 31 C96 50 82 66 50 90 Z" fill={`url(#${id})`} stroke="#141010" strokeWidth="4" />
    </svg>
  );
}

export function Brilho({ cor = "#fff", tamanho = 30 }: { cor?: string; tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" aria-hidden>
      <path d="M50 0 C54 36 64 46 100 50 C64 54 54 64 50 100 C46 64 36 54 0 50 C36 46 46 36 50 0 Z" fill={cor} />
    </svg>
  );
}

export function Cd({ tamanho = 60 }: { tamanho?: number }) {
  const u = uid();
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" aria-hidden>
      <defs>
        <linearGradient id={u} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3f3ff" />
          <stop offset=".3" stopColor="#ffc7e0" />
          <stop offset=".55" stopColor="#fff2d6" />
          <stop offset=".8" stopColor="#d2f1ff" />
          <stop offset="1" stopColor="#e6dcff" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill={`url(#${u})`} stroke="#141010" strokeWidth="3" />
      <circle cx="50" cy="50" r="14" fill="#fff" stroke="#141010" strokeWidth="2" />
      <circle cx="50" cy="50" r="5" fill="#141010" />
    </svg>
  );
}

export function Gloss({ tamanho = 70 }: { tamanho?: number }) {
  const u = uid();
  return (
    <svg width={tamanho * 0.4} height={tamanho} viewBox="0 0 40 100" aria-hidden>
      <defs>
        <linearGradient id={u} x1="0" x2="1">
          <stop offset="0" stopColor="#e2558f" />
          <stop offset=".4" stopColor="#ffc2da" />
          <stop offset="1" stopColor="#c93a77" />
        </linearGradient>
      </defs>
      <path d="M8 6 h24 v60 h-24z" fill={`url(#${u})`} stroke="#141010" strokeWidth="2.5" />
      {Array.from({ length: 14 }, (_, i) => (
        <circle key={i} cx={12 + ((i * 7) % 16)} cy={12 + i * 4} r="1.2" fill="#fff" />
      ))}
      <rect x="6" y="66" width="28" height="30" rx="4" fill="#141010" />
    </svg>
  );
}

export function Boca({ tamanho = 70 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho * 0.6} viewBox="0 0 100 60" aria-hidden>
      <path d="M4 30 C18 10 32 6 42 14 C46 10 54 10 58 14 C68 6 82 10 96 30 C82 34 70 32 50 32 C30 32 18 34 4 30Z" fill="#b3122e" />
      <path d="M4 30 C20 34 32 34 50 34 C68 34 80 34 96 30 C84 52 66 56 50 56 C34 56 16 52 4 30Z" fill="#8f0d24" />
      <ellipse cx="40" cy="44" rx="10" ry="3" fill="#fff" opacity=".45" />
    </svg>
  );
}

export function CelularFlip({ tamanho = 70 }: { tamanho?: number }) {
  return (
    <svg width={tamanho * 0.6} height={tamanho} viewBox="0 0 60 100" aria-hidden>
      <rect x="4" y="2" width="52" height="48" rx="10" fill="#f7b3cf" stroke="#141010" strokeWidth="2.5" />
      <rect x="12" y="9" width="36" height="32" rx="4" fill="#141010" />
      <path d="M30 32 C22 26 18 22 18 18 C18 15 21 13 24 13 C27 13 29 15 30 17 C31 15 33 13 36 13 C39 13 42 15 42 18 C42 22 38 26 30 32Z" fill="#f26aa6" />
      <rect x="4" y="52" width="52" height="46" rx="10" fill="#f7b3cf" stroke="#141010" strokeWidth="2.5" />
      {[0, 1, 2].map((l) =>
        [0, 1, 2].map((c) => <rect key={`${l}${c}`} x={13 + c * 13} y={62 + l * 10} width="9" height="6" rx="3" fill="#fff" />),
      )}
    </svg>
  );
}

// Fundo: alguns adesivos soltos nas bordas
export default function FundoDecorado() {
  return (
    <div className="fundo" aria-hidden>
      <div className="adesivo a1"><EstrelaOncinha rosa /></div>
      <div className="adesivo a2"><CoracaoStrass /></div>
      <div className="adesivo a3"><Borboleta /></div>
      <div className="adesivo a4"><Cd tamanho={70} /></div>
      <div className="adesivo a5"><Boca /></div>
      <div className="adesivo a6"><Brilho cor="#f26aa6" /></div>
      <div className="adesivo a7"><Gloss /></div>
      <div className="adesivo a8"><EstrelaBrilhante tamanho={40} /></div>
    </div>
  );
}

export function Borboleta({ tamanho = 56 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" aria-hidden>
      <g stroke="#3b1f33" strokeWidth="3" strokeLinejoin="round">
        <path d="M48 50 C30 18 4 16 8 38 C10 54 30 56 48 52 Z" fill="#ff9fca" />
        <path d="M52 50 C70 18 96 16 92 38 C90 54 70 56 52 52 Z" fill="#ff9fca" />
        <path d="M48 54 C32 60 18 80 30 86 C40 92 46 72 48 58 Z" fill="#f26aa6" />
        <path d="M52 54 C68 60 82 80 70 86 C60 92 54 72 52 58 Z" fill="#f26aa6" />
      </g>
      <g fill="#fff" opacity=".8"><circle cx="22" cy="34" r="4" /><circle cx="78" cy="34" r="4" /></g>
      <rect x="47" y="34" width="6" height="40" rx="3" fill="#3b1f33" />
      <path d="M50 36 C46 26 40 22 36 20 M50 36 C54 26 60 22 64 20" stroke="#3b1f33" strokeWidth="2.5" fill="none" />
    </svg>
  );
}

export function Bichinho({ tamanho = 64 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho * 1.15} viewBox="0 0 100 115" aria-hidden>
      <path d="M50 4 C64 4 66 16 62 22" stroke="#c9c9d6" strokeWidth="4" fill="none" />
      <ellipse cx="50" cy="66" rx="42" ry="46" fill="#f26aa6" stroke="#3b1f33" strokeWidth="3" />
      <ellipse cx="36" cy="40" rx="14" ry="7" fill="#fff" opacity=".45" transform="rotate(-25 36 40)" />
      <rect x="26" y="42" width="48" height="38" rx="7" fill="#d9ecd0" stroke="#3b1f33" strokeWidth="3" />
      <g fill="#3b1f33">
        <rect x="42" y="50" width="4" height="4" /><rect x="54" y="50" width="4" height="4" />
        <rect x="40" y="58" width="20" height="4" /><rect x="44" y="62" width="12" height="4" />
      </g>
      {[36, 50, 64].map((x) => <circle key={x} cx={x} cy="96" r="5.5" fill="#ffd6ea" stroke="#3b1f33" strokeWidth="2" />)}
    </svg>
  );
}

export function EstrelaBrilhante({ tamanho = 56, cor = "#f26aa6" }: { tamanho?: number; cor?: string }) {
  const u = uid();
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" aria-hidden>
      <defs>
        <linearGradient id={u} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".35" stopColor={cor} />
          <stop offset=".7" stopColor="#b2357a" />
          <stop offset="1" stopColor={cor} />
        </linearGradient>
      </defs>
      <path d="M50 6 L61 37 L94 38 L68 58 L78 90 L50 71 L22 90 L32 58 L6 38 L39 37 Z" fill={`url(#${u})`} stroke="#3b1f33" strokeWidth="3" strokeLinejoin="round" />
      <path d="M40 30 L46 18" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function CoracaoCromado({ tamanho = 60 }: { tamanho?: number }) {
  const u = uid();
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" aria-hidden>
      <defs>
        <linearGradient id={u} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".3" stopColor="#c9c3cf" />
          <stop offset=".5" stopColor="#ffffff" />
          <stop offset=".75" stopColor="#8f879a" />
          <stop offset="1" stopColor="#e8e4ec" />
        </linearGradient>
      </defs>
      <path d="M50 88 C20 66 6 50 6 32 C6 18 17 8 30 8 C39 8 46 13 50 21 C54 13 61 8 70 8 C83 8 94 18 94 32 C94 50 80 66 50 88 Z" fill="none" stroke={`url(#${u})`} strokeWidth="12" />
      <path d="M50 88 C20 66 6 50 6 32 C6 18 17 8 30 8 C39 8 46 13 50 21 C54 13 61 8 70 8 C83 8 94 18 94 32 C94 50 80 66 50 88 Z" fill="none" stroke="#3b1f33" strokeWidth="1.5" />
    </svg>
  );
}

export function Cursor({ tamanho = 34 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 40 40" aria-hidden>
      <path d="M6 4 L6 32 L13 25 L18 36 L23 34 L18 23 L28 23 Z" fill="#fff" stroke="#3b1f33" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

export function Bolsa({ tamanho = 90 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" aria-hidden>
      <path d="M30 40 C30 18 70 18 70 40" fill="none" stroke="#c93a77" strokeWidth="6" />
      <path d="M14 40 H86 L80 88 H20 Z" fill="#ff7cb6" stroke="#2e2a4f" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M20 46 H80" stroke="#fff" strokeWidth="3" opacity=".6" />
      <path d="M50 54 l4 9 10 1 -7 7 2 10 -9-5 -9 5 2-10 -7-7 10-1z" fill="#eef0f6" stroke="#2e2a4f" strokeWidth="1.5" />
    </svg>
  );
}

export function Colar({ tamanho = 90 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" aria-hidden>
      <path d="M14 10 C14 50 36 64 50 66 C64 64 86 50 86 10" fill="none" stroke="#a9aec2" strokeWidth="4" strokeDasharray="5 3" />
      <path d="M50 58 l6 12 13 2 -10 9 3 13 -12-7 -12 7 3-13 -10-9 13-2z" fill="#e8eaf2" stroke="#2e2a4f" strokeWidth="2" />
      <path d="M46 72 l3 -6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function Bota({ tamanho = 90 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" aria-hidden>
      <path d="M34 8 H58 V60 L84 66 C92 68 92 80 84 80 H34 Z" fill="#ffc2de" stroke="#2e2a4f" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="30" y="80" width="58" height="14" rx="4" fill="#fff" stroke="#2e2a4f" strokeWidth="2.5" />
      {[18, 30, 42].map((y) => <path key={y} d={`M38 ${y} H54`} stroke="#c93a77" strokeWidth="2.5" strokeLinecap="round" />)}
    </svg>
  );
}

export function Notebook({ tamanho = 90 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho * 0.8} viewBox="0 0 100 80" aria-hidden>
      <rect x="16" y="6" width="68" height="48" rx="5" fill="#ff9fca" stroke="#2e2a4f" strokeWidth="2.5" />
      <rect x="23" y="12" width="54" height="36" rx="2" fill="#fff3a6" stroke="#2e2a4f" strokeWidth="2" />
      <circle cx="50" cy="30" r="11" fill="#ffd84f" stroke="#2e2a4f" strokeWidth="2" />
      <circle cx="46" cy="27" r="1.6" fill="#2e2a4f" /><circle cx="54" cy="27" r="1.6" fill="#2e2a4f" />
      <path d="M44 33 C47 37 53 37 56 33" stroke="#2e2a4f" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M6 58 H94 L86 74 H14 Z" fill="#ffc2de" stroke="#2e2a4f" strokeWidth="2.5" strokeLinejoin="round" />
      {[0, 1, 2].map((l) => <path key={l} d={`M${22 + l * 3} ${62 + l * 4} H${78 - l * 3}`} stroke="#2e2a4f" strokeWidth="1.2" strokeDasharray="3 2" />)}
    </svg>
  );
}

export function Envelope({ tamanho = 60 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho * 0.75} viewBox="0 0 80 60" aria-hidden>
      <rect x="4" y="8" width="72" height="46" rx="4" fill="#fff" stroke="#2e2a4f" strokeWidth="2.5" />
      <path d="M4 12 L40 36 L76 12" fill="none" stroke="#2e2a4f" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M40 30 C34 24 30 22 30 18 C30 15 33 13 36 14 C38 15 39 16 40 18 C41 16 42 15 44 14 C47 13 50 15 50 18 C50 22 46 24 40 30Z" fill="#f26aa6" stroke="#2e2a4f" strokeWidth="1.5" />
    </svg>
  );
}

export function EstrelaLilas({ tamanho = 56 }: { tamanho?: number }) {
  return <EstrelaBrilhante tamanho={tamanho} cor="#a77bf0" />;
}

// ---------- adesivos H2O (praia tropical) ----------
export function Hibisco({ tamanho = 80, cor = "#ff4f9a" }: { tamanho?: number; cor?: string }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" aria-hidden>
      <g stroke="#7a1446" strokeWidth="2" strokeLinejoin="round">
        {[0, 72, 144, 216, 288].map((r) => (
          <path key={r} transform={`rotate(${r} 50 50)`} d="M50 50 C36 40 30 16 42 8 C48 4 56 4 60 10 C70 22 62 40 50 50Z" fill={cor} />
        ))}
      </g>
      <circle cx="50" cy="50" r="9" fill="#ffd1e6" stroke="#7a1446" strokeWidth="2" />
      <path d="M50 50 L72 26" stroke="#ffd84f" strokeWidth="3" strokeLinecap="round" />
      {[0, 1, 2, 3].map((i) => <circle key={i} cx={66 + i * 2} cy={30 - i * 2.5} r="2.2" fill="#ffd84f" stroke="#7a1446" strokeWidth=".8" />)}
    </svg>
  );
}

export function Concha({ tamanho = 70 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" aria-hidden>
      <path d="M50 88 L20 30 C30 10 70 10 80 30 Z" fill="#ffc9b5" stroke="#8a3a2a" strokeWidth="2.5" strokeLinejoin="round" />
      {[-24, -12, 0, 12, 24].map((x) => <path key={x} d={`M50 86 L${50 + x} 18`} stroke="#e8907a" strokeWidth="2" />)}
      <path d="M38 88 H62 L58 96 H42 Z" fill="#ffb59c" stroke="#8a3a2a" strokeWidth="2" />
      <ellipse cx="40" cy="30" rx="8" ry="4" fill="#fff" opacity=".6" />
    </svg>
  );
}

export function EstrelaDoMar({ tamanho = 64, cor = "#ff8a5c" }: { tamanho?: number; cor?: string }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" aria-hidden>
      <path d="M50 6 C55 30 60 34 92 38 C66 50 64 56 76 90 C54 70 46 70 24 90 C36 56 34 50 8 38 C40 34 45 30 50 6Z" fill={cor} stroke="#7a2e14" strokeWidth="2.5" strokeLinejoin="round" />
      {[[50, 30], [70, 44], [62, 66], [38, 66], [30, 44], [50, 50]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="2.6" fill="#ffe0c2" />)}
    </svg>
  );
}

export function Perolas({ tamanho = 110 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho * 0.5} viewBox="0 0 120 60" aria-hidden>
      {Array.from({ length: 11 }, (_, i) => {
        const x = 8 + i * 10.4;
        const y = 12 + Math.sin((i / 10) * Math.PI) * 34;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="6" fill="#fdf8f2" stroke="#b9a99a" strokeWidth="1" />
            <circle cx={x - 2} cy={y - 2} r="2" fill="#fff" />
          </g>
        );
      })}
    </svg>
  );
}

export function CaudaSereia({ tamanho = 90 }: { tamanho?: number }) {
  const u = uid();
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" aria-hidden>
      <defs>
        <linearGradient id={u} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffb547" />
          <stop offset=".5" stopColor="#ff8a1f" />
          <stop offset="1" stopColor="#ffd25c" />
        </linearGradient>
      </defs>
      <path d="M44 6 C56 6 60 30 58 54 C70 62 90 66 96 90 C80 84 66 84 56 78 C52 86 40 94 22 96 C30 82 40 72 44 60 C38 40 34 6 44 6Z" fill={`url(#${u})`} stroke="#8a4500" strokeWidth="2.5" strokeLinejoin="round" />
      {[18, 28, 38, 48].map((y) => <path key={y} d={`M${42} ${y} q4 4 8 0 q4 4 8 0`} stroke="#c25e00" strokeWidth="1.5" fill="none" />)}
    </svg>
  );
}

export function Prancha({ tamanho = 110, cor = "#ff7ab8" }: { tamanho?: number; cor?: string }) {
  return (
    <svg width={tamanho * 0.32} height={tamanho} viewBox="0 0 32 100" aria-hidden>
      <path d="M16 2 C28 20 28 80 16 98 C4 80 4 20 16 2Z" fill={cor} stroke="#2e2a4f" strokeWidth="2" />
      <path d="M16 6 V94" stroke="#fff" strokeWidth="3" />
      <path d="M8 40 C12 46 20 46 24 40" stroke="#4fd0e0" strokeWidth="3" fill="none" />
      <path d="M8 52 C12 58 20 58 24 52" stroke="#4fd0e0" strokeWidth="3" fill="none" />
    </svg>
  );
}

export function Ilha({ largura = 260 }: { largura?: number }) {
  return (
    <svg width={largura} height={largura * 0.35} viewBox="0 0 260 90" aria-hidden>
      <path d="M0 90 C30 70 50 60 80 58 L110 20 L126 30 L140 18 L170 56 C200 58 230 70 260 90Z" fill="#2c8a6e" />
      <path d="M110 20 L126 30 L140 18 L132 40 L118 38Z" fill="#1e6b54" />
      <path d="M0 90 C40 80 220 80 260 90Z" fill="#e9d3a6" />
    </svg>
  );
}
