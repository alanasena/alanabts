// Arabescos vetoriais estilo anos 2000 (vector flourish), desenhados do zero
type P = { largura?: number; cor?: string; destaque?: string; espelhar?: boolean; className?: string };

export default function Floreio({ largura = 160, cor = "#141010", destaque = "#f26aa6", espelhar, className = "" }: P) {
  return (
    <svg
      className={`floreio ${className}`}
      width={largura}
      height={largura * 0.5}
      viewBox="0 0 200 100"
      fill="none"
      aria-hidden
      style={espelhar ? { transform: "scaleX(-1)" } : undefined}
    >
      <g stroke={cor} strokeWidth="3.2" strokeLinecap="round">
        <path d="M6 70 C40 72 58 40 92 38 C120 36 132 58 118 66 C108 72 98 62 106 55 C110 52 116 54 115 58" />
        <path d="M60 52 C70 30 92 16 116 18 C140 20 150 40 138 46 C128 51 122 40 130 36" />
        <path d="M92 38 C110 50 140 76 170 72 C188 70 194 54 182 48 C172 44 166 54 174 58" />
        <path d="M30 70 C36 84 52 90 62 84 C70 79 64 70 57 74" />
        <path d="M146 30 C156 16 172 10 184 16" />
      </g>
      <g fill={destaque}>
        <path d="M150 88 l3 7 7 1 -5 5 1 7 -6-4 -6 4 1-7 -5-5 7-1z" transform="translate(-4 -14) scale(.9)" />
        <circle cx="190" cy="22" r="4" />
        <circle cx="20" cy="56" r="3" />
        <path d="M78 14 C78 10 84 10 84 14 C84 10 90 10 90 14 C90 19 84 22 84 24 C84 22 78 19 78 14Z" />
      </g>
      <g fill={cor}>
        <circle cx="160" cy="44" r="2.5" />
        <circle cx="44" cy="58" r="2" />
      </g>
    </svg>
  );
}
