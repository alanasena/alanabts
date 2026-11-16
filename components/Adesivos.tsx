// Adesivos desenhados do zero (SVG) na vibe 2000s: strass, oncinha, zebra, flip phone...

// id único por adesivo (senão um adesivo escondido "apaga" o desenho do outro)
const uid = () => Math.random().toString(36).slice(2, 8);

const oncinhaRosa = (id: string) => (
  <pattern id={id} width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
    <rect width="22" height="22" fill="#ff9fd0" />
    <path d="M3 4c3-2 6 0 5 3-1-1-3-2-5-1zM2 9c-1 3 1 5 3 5-1-1-2-3-1-5zM10 10c0 3-2 4-4 4 1-1 3-2 3-4z" fill="#1a0b14" />
    <path d="M14 14c3-2 6 0 5 3-1-1-3-2-5-1zM13 19c-1 2 1 4 3 4-1-1-2-2-1-4z" fill="#1a0b14" />
    <circle cx="6" cy="9" r="1.8" fill="#ff2e93" />
    <circle cx="17" cy="18" r="1.6" fill="#ff2e93" />
  </pattern>
);

const strass = (id: string, cor: string) => (
  <pattern id={id} width="9" height="9" patternUnits="userSpaceOnUse">
    <rect width="9" height="9" fill={cor} />
    <circle cx="4.5" cy="4.5" r="3.6" fill={`url(#${id}-g)`} />
  </pattern>
);
const strassGrad = (id: string, cor: string) => (
  <radialGradient id={`${id}-g`} cx="35%" cy="30%" r="70%">
    <stop offset="0" stopColor="#fff" />
    <stop offset=".45" stopColor={cor} />
    <stop offset="1" stopColor="#7a1450" />
  </radialGradient>
);

export function Estrela({ cor = "#ffd84f", tamanho = 48 }: { cor?: string; tamanho?: number }) {
  const u = uid();
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" aria-hidden>
      <defs>
        <radialGradient id={u} cx="35%" cy="30%" r="70%">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".35" stopColor={cor} />
          <stop offset="1" stopColor={cor} stopOpacity=".85" />
        </radialGradient>
      </defs>
      <path d="M50 4 L62 36 L96 38 L69 59 L79 93 L50 73 L21 93 L31 59 L4 38 L38 36 Z" fill={`url(#${u})`} stroke="#fff" strokeWidth="5" strokeLinejoin="round" />
    </svg>
  );
}

const ESTRELA = "M50 4 L62 36 L96 38 L69 59 L79 93 L50 73 L21 93 L31 59 L4 38 L38 36 Z";

export function EstrelaZebra({ tamanho = 70 }: { tamanho?: number }) {
  const u = uid();
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" aria-hidden>
      <defs>
        <clipPath id={u}><path d={ESTRELA} /></clipPath>
      </defs>
      <path d={ESTRELA} fill="#fff" stroke="#ff2e93" strokeWidth="9" strokeLinejoin="round" />
      <g clipPath={`url(#${u})`} fill="#1a0b14">
        <path d="M10 20 C30 26 40 18 60 26 L60 31 C40 24 30 32 10 26Z" />
        <path d="M0 40 C25 46 45 36 70 46 L70 52 C45 42 25 52 0 46Z" />
        <path d="M30 58 C50 64 65 56 100 64 L100 70 C65 62 50 70 30 64Z" />
        <path d="M15 76 C35 82 50 74 80 82 L80 88 C50 80 35 88 15 82Z" />
        <path d="M55 8 C62 20 70 30 90 36 L88 40 C68 34 58 24 52 12Z" />
      </g>
      <path d={ESTRELA} fill="none" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

export function EstrelaOncinha({ tamanho = 70 }: { tamanho?: number }) {
  const u = uid();
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" aria-hidden>
      <defs>{oncinhaRosa(u)}</defs>
      <path d={ESTRELA} fill={`url(#${u})`} stroke="#fff" strokeWidth="7" strokeLinejoin="round" />
    </svg>
  );
}

export function CoracaoStrass({ tamanho = 64, cor = "#ff4fb8" }: { tamanho?: number; cor?: string }) {
  const id = `st${uid()}`;
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" aria-hidden>
      <defs>
        {strassGrad(id, cor)}
        {strass(id, "#c21a78")}
      </defs>
      <path d="M50 90 C18 66 4 50 4 31 C4 16 16 6 30 6 C39 6 46 11 50 19 C54 11 61 6 70 6 C84 6 96 16 96 31 C96 50 82 66 50 90 Z" fill={`url(#${id})`} stroke="#fff" strokeWidth="5" />
    </svg>
  );
}

export function Coracao({ cor = "#ff4fb8", tamanho = 48 }: { cor?: string; tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" aria-hidden>
      <path d="M50 88 C20 66 6 50 6 32 C6 18 17 8 30 8 C39 8 46 13 50 21 C54 13 61 8 70 8 C83 8 94 18 94 32 C94 50 80 66 50 88 Z" fill={cor} stroke="#fff" strokeWidth="6" />
      <ellipse cx="30" cy="28" rx="10" ry="6" fill="#fff" opacity=".7" transform="rotate(-30 30 28)" />
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
          <stop offset=".3" stopColor="#ffc7ef" />
          <stop offset=".55" stopColor="#fff7d0" />
          <stop offset=".8" stopColor="#c8f3ff" />
          <stop offset="1" stopColor="#e2d4ff" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill={`url(#${u})`} stroke="#fff" strokeWidth="3" />
      <circle cx="50" cy="50" r="14" fill="#fff" opacity=".9" />
      <circle cx="50" cy="50" r="6" fill="#ffd1ea" />
      <text x="50" y="80" textAnchor="middle" fontSize="9" fontFamily="Pacifico, cursive" fill="#ff2e93">2000s hits</text>
    </svg>
  );
}

export function CelularFlip({ tamanho = 70 }: { tamanho?: number }) {
  const u = uid();
  return (
    <svg width={tamanho * 0.6} height={tamanho} viewBox="0 0 60 100" aria-hidden>
      <defs>
        <linearGradient id={u} x1="0" x2="1">
          <stop offset="0" stopColor="#ffb3d9" />
          <stop offset=".5" stopColor="#ffe3f1" />
          <stop offset="1" stopColor="#f07ab8" />
        </linearGradient>
      </defs>
      <rect x="4" y="2" width="52" height="48" rx="10" fill={`url(#${u})`} stroke="#fff" strokeWidth="3" />
      <rect x="12" y="9" width="36" height="32" rx="4" fill="#2a0c1c" />
      <path d="M30 32 C22 26 18 22 18 18 C18 15 21 13 24 13 C27 13 29 15 30 17 C31 15 33 13 36 13 C39 13 42 15 42 18 C42 22 38 26 30 32Z" fill="#ff4fb8" />
      <rect x="4" y="52" width="52" height="46" rx="10" fill={`url(#${u})`} stroke="#fff" strokeWidth="3" />
      {[0, 1, 2].map((l) =>
        [0, 1, 2].map((c) => <rect key={`${l}${c}`} x={13 + c * 13} y={62 + l * 10} width="9" height="6" rx="3" fill="#fff" opacity=".85" />),
      )}
    </svg>
  );
}

export function Tocador({ tamanho = 70 }: { tamanho?: number }) {
  return (
    <svg width={tamanho * 0.62} height={tamanho} viewBox="0 0 62 100" aria-hidden>
      <rect x="3" y="3" width="56" height="94" rx="10" fill="#ff8cc6" stroke="#fff" strokeWidth="3" />
      <rect x="10" y="10" width="42" height="32" rx="3" fill="#ffeef7" />
      <rect x="14" y="30" width="26" height="4" rx="2" fill="#ff2e93" />
      <text x="14" y="22" fontSize="7" fill="#7a1450" fontFamily="sans-serif">♪ tocando</text>
      <circle cx="31" cy="70" r="18" fill="#fff" />
      <circle cx="31" cy="70" r="7" fill="#ff8cc6" />
    </svg>
  );
}

export function Gloss({ tamanho = 70 }: { tamanho?: number }) {
  const u = uid();
  return (
    <svg width={tamanho * 0.4} height={tamanho} viewBox="0 0 40 100" aria-hidden>
      <defs>
        <linearGradient id={u} x1="0" x2="1">
          <stop offset="0" stopColor="#ff4fb8" />
          <stop offset=".4" stopColor="#ffb3dc" />
          <stop offset="1" stopColor="#e0157f" />
        </linearGradient>
      </defs>
      <path d="M8 6 h24 v60 h-24z" fill={`url(#${u})`} stroke="#fff" strokeWidth="3" />
      {Array.from({ length: 14 }, (_, i) => (
        <circle key={i} cx={12 + ((i * 7) % 16)} cy={12 + i * 4} r="1.2" fill="#fff" />
      ))}
      <rect x="6" y="66" width="28" height="30" rx="4" fill="#f4f4fa" stroke="#fff" strokeWidth="3" />
      <text x="20" y="40" textAnchor="middle" fontSize="7" fill="#fff" fontFamily="Pacifico, cursive" transform="rotate(-90 20 40)">lip gloss</text>
    </svg>
  );
}

export function Boca({ tamanho = 70 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho * 0.6} viewBox="0 0 100 60" aria-hidden>
      <path d="M4 30 C18 10 32 6 42 14 C46 10 54 10 58 14 C68 6 82 10 96 30 C82 34 70 32 50 32 C30 32 18 34 4 30Z" fill="#ff2e93" />
      <path d="M4 30 C20 34 32 34 50 34 C68 34 80 34 96 30 C84 52 66 56 50 56 C34 56 16 52 4 30Z" fill="#e0157f" />
      <path d="M20 22 C30 16 38 18 44 22" stroke="#ff9fd0" strokeWidth="2" fill="none" />
      <path d="M58 22 C64 18 72 16 80 22" stroke="#ff9fd0" strokeWidth="2" fill="none" />
      <ellipse cx="40" cy="44" rx="10" ry="3" fill="#fff" opacity=".5" />
    </svg>
  );
}

export function Oculos({ tamanho = 80 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho * 0.45} viewBox="0 0 100 45" aria-hidden>
      <path d="M6 10 h36 c2 18 -6 30 -18 30 c-12 0 -20 -12 -18 -30z" fill="#ff7fc0" opacity=".8" stroke="#ff2e93" strokeWidth="3" />
      <path d="M58 10 h36 c2 18 -6 30 -18 30 c-12 0 -20 -12 -18 -30z" fill="#ff7fc0" opacity=".8" stroke="#ff2e93" strokeWidth="3" />
      <path d="M42 14 c4 -4 12 -4 16 0" stroke="#ff2e93" strokeWidth="3" fill="none" />
      <path d="M12 16 l10 -2" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <path d="M64 16 l10 -2" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Bichinho({ tamanho = 64 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" aria-hidden>
      <ellipse cx="50" cy="54" rx="40" ry="42" fill="#ffb3d9" stroke="#fff" strokeWidth="4" />
      <rect x="28" y="30" width="44" height="34" rx="6" fill="#d6e9c8" stroke="#ff8cc6" strokeWidth="3" />
      <g fill="#2a2a2a">
        <rect x="42" y="38" width="4" height="4" /><rect x="54" y="38" width="4" height="4" />
        <rect x="40" y="46" width="20" height="4" /><rect x="44" y="50" width="12" height="4" />
      </g>
      {[38, 50, 62].map((x) => <circle key={x} cx={x} cy="76" r="5" fill="#ff2e93" />)}
    </svg>
  );
}

export function Bilhete({ texto, tamanho = 110, rot = -4 }: { texto: string; tamanho?: number; rot?: number }) {
  return (
    <div className="bilhete" style={{ width: tamanho, transform: `rotate(${rot}deg)` }}>
      {texto}
    </div>
  );
}

// Fundo: glitter rosa + adesivos espalhados
export default function FundoDecorado() {
  return (
    <div className="fundo" aria-hidden>
      <div className="fundo-glitter" />
      <div className="adesivo a1"><EstrelaZebra /></div>
      <div className="adesivo a2"><CoracaoStrass /></div>
      <div className="adesivo a3"><CelularFlip tamanho={90} /></div>
      <div className="adesivo a4"><Cd tamanho={80} /></div>
      <div className="adesivo a5"><Boca /></div>
      <div className="adesivo a6"><EstrelaOncinha tamanho={50} /></div>
      <div className="adesivo a7"><Brilho /></div>
      <div className="adesivo a8"><Gloss /></div>
      <div className="adesivo a9"><Oculos /></div>
      <div className="adesivo a10"><Brilho cor="#ffd84f" tamanho={22} /></div>
    </div>
  );
}
