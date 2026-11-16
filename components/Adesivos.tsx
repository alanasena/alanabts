// Adesivos desenhados do zero (SVG), espalhados pelo fundo.

export function Estrela({ cor = "#ffd84f", tamanho = 48 }: { cor?: string; tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" aria-hidden>
      <defs>
        <radialGradient id={`e${cor.slice(1)}`} cx="35%" cy="30%" r="70%">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".35" stopColor={cor} />
          <stop offset="1" stopColor={cor} stopOpacity=".85" />
        </radialGradient>
      </defs>
      <path
        d="M50 4 L62 36 L96 38 L69 59 L79 93 L50 73 L21 93 L31 59 L4 38 L38 36 Z"
        fill={`url(#e${cor.slice(1)})`}
        stroke="#fff"
        strokeWidth="5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Coracao({ cor = "#ff4fb8", tamanho = 48 }: { cor?: string; tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" aria-hidden>
      <path
        d="M50 88 C20 66 6 50 6 32 C6 18 17 8 30 8 C39 8 46 13 50 21 C54 13 61 8 70 8 C83 8 94 18 94 32 C94 50 80 66 50 88 Z"
        fill={cor}
        stroke="#fff"
        strokeWidth="6"
      />
      <ellipse cx="30" cy="28" rx="10" ry="6" fill="#fff" opacity=".7" transform="rotate(-30 30 28)" />
    </svg>
  );
}

export function Borboleta({ tamanho = 56 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" aria-hidden>
      <g stroke="#fff" strokeWidth="4">
        <path d="M48 50 C30 20 6 18 8 38 C10 54 30 56 48 52 Z" fill="#59e1ff" />
        <path d="M52 50 C70 20 94 18 92 38 C90 54 70 56 52 52 Z" fill="#c58bff" />
        <path d="M48 54 C32 60 18 78 30 86 C40 92 46 72 48 58 Z" fill="#ff8fd1" />
        <path d="M52 54 C68 60 82 78 70 86 C60 92 54 72 52 58 Z" fill="#ff8fd1" />
      </g>
      <rect x="47" y="34" width="6" height="40" rx="3" fill="#5b3a8a" />
      <path d="M50 36 C46 26 40 22 36 20 M50 36 C54 26 60 22 64 20" stroke="#5b3a8a" strokeWidth="3" fill="none" />
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
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" aria-hidden>
      <defs>
        <linearGradient id="cdg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d9f3ff" />
          <stop offset=".3" stopColor="#ffc7ef" />
          <stop offset=".55" stopColor="#fff7b0" />
          <stop offset=".8" stopColor="#b6ffd8" />
          <stop offset="1" stopColor="#d2c4ff" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="url(#cdg)" stroke="#fff" strokeWidth="4" />
      <circle cx="50" cy="50" r="14" fill="#fff" opacity=".9" />
      <circle cx="50" cy="50" r="6" fill="#bde9ff" />
    </svg>
  );
}

export function Cereja({ tamanho = 50 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" aria-hidden>
      <path d="M30 62 C40 30 52 16 70 8 M68 62 C66 36 68 20 70 8" stroke="#3f9d3f" strokeWidth="5" fill="none" />
      <path d="M70 8 C82 6 92 14 90 22 C80 22 72 18 70 8 Z" fill="#59c95a" />
      <circle cx="30" cy="70" r="20" fill="#ff2f6d" stroke="#fff" strokeWidth="4" />
      <circle cx="68" cy="70" r="20" fill="#ff2f6d" stroke="#fff" strokeWidth="4" />
      <circle cx="24" cy="64" r="5" fill="#fff" opacity=".8" />
      <circle cx="62" cy="64" r="5" fill="#fff" opacity=".8" />
    </svg>
  );
}

// Fundo: adesivos fixos + bolhas subindo (Frutiger Aero)
export default function FundoDecorado() {
  const bolhas = Array.from({ length: 14 }, (_, i) => i);
  return (
    <div className="fundo" aria-hidden>
      <div className="fundo-sol" />
      <div className="fundo-colinas" />
      {bolhas.map((i) => (
        <span
          key={i}
          className="bolha"
          style={{
            left: `${(i * 37) % 100}%`,
            width: 18 + ((i * 13) % 50),
            height: 18 + ((i * 13) % 50),
            animationDelay: `${(i * 1.7) % 12}s`,
            animationDuration: `${12 + ((i * 3) % 10)}s`,
          }}
        />
      ))}
      <div className="adesivo a1"><Estrela /></div>
      <div className="adesivo a2"><Coracao /></div>
      <div className="adesivo a3"><Borboleta /></div>
      <div className="adesivo a4"><Cd /></div>
      <div className="adesivo a5"><Cereja /></div>
      <div className="adesivo a6"><Estrela cor="#ff8fd1" tamanho={36} /></div>
      <div className="adesivo a7"><Brilho /></div>
      <div className="adesivo a8"><Brilho cor="#ffd84f" tamanho={22} /></div>
    </div>
  );
}
