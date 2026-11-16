import { SIMBOLOS, type Posicao } from "@/lib/astro";

// Roda do mapa astral desenhada em SVG (Ascendente sempre à esquerda)
const CORES_ELEMENTO = ["#ffd3e6", "#fbe7c4", "#ffe6da", "#c9f2f6"]; // fogo, terra, ar, água

export default function RodaMapa({ planetas, asc, mc, cuspides }: { planetas: Posicao[]; asc: number; mc: number; cuspides: number[] }) {
  const C = 200;
  const ang = (lon: number) => ((180 + (lon - asc)) * Math.PI) / 180;
  const ponto = (lon: number, r: number) => [C + r * Math.cos(ang(lon)), C - r * Math.sin(ang(lon))];

  // espalha planetas que ficam muito perto um do outro
  const ordenados = [...planetas].sort((a, b) => a.lon - b.lon);
  const raios: Record<string, number> = {};
  ordenados.forEach((p, i) => {
    const ant = ordenados[i - 1];
    raios[p.id] = ant && Math.abs(p.lon - ant.lon) < 7 && raios[ant.id] === 118 ? 96 : 118;
  });

  const fatia = (i: number, r1: number, r2: number) => {
    const a = i * 30;
    const b = a + 30;
    const [x1, y1] = ponto(a, r2);
    const [x2, y2] = ponto(b, r2);
    const [x3, y3] = ponto(b, r1);
    const [x4, y4] = ponto(a, r1);
    return `M${x1} ${y1} A${r2} ${r2} 0 0 0 ${x2} ${y2} L${x3} ${y3} A${r1} ${r1} 0 0 1 ${x4} ${y4}Z`;
  };

  return (
    <svg viewBox="0 0 400 400" className="roda-mapa" role="img" aria-label="Roda do mapa astral">
      <circle cx={C} cy={C} r={190} fill="#fff" stroke="#2e2a4f" strokeWidth="2" />
      {Array.from({ length: 12 }, (_, i) => (
        <g key={i}>
          <path d={fatia(i, 158, 190)} fill={CORES_ELEMENTO[i % 4]} stroke="#2e2a4f" strokeWidth="1" />
          {(() => {
            const [x, y] = ponto(i * 30 + 15, 174);
            return <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="17" fill="#2e2a4f">{SIMBOLOS[i]}</text>;
          })()}
        </g>
      ))}
      <circle cx={C} cy={C} r={158} fill="none" stroke="#2e2a4f" strokeWidth="1.5" />
      <circle cx={C} cy={C} r={70} fill="#f8f5fa" stroke="#2e2a4f" strokeWidth="1.5" />

      {cuspides.map((c, i) => {
        const [x1, y1] = ponto(c, 70);
        const [x2, y2] = ponto(c, 158);
        const [tx, ty] = ponto(c + 4, 80);
        const eixo = i === 0 || i === 3 || i === 6 || i === 9;
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2e2a4f" strokeWidth={eixo ? 2 : 0.8} strokeDasharray={eixo ? "" : "3 3"} />
            <text x={tx} y={ty} fontSize="9" fill="#6b6890" textAnchor="middle" dominantBaseline="central">{i + 1}</text>
          </g>
        );
      })}

      {[["ASC", asc], ["MC", mc]].map(([nome, lon]) => {
        const [x, y] = ponto(lon as number, 146);
        return <text key={nome as string} x={x} y={y} fontSize="10" fontWeight="700" fill="#c93a77" textAnchor="middle" dominantBaseline="central">{nome}</text>;
      })}

      {planetas.map((p) => {
        const [lx, ly] = ponto(p.lon, 156);
        const [x, y] = ponto(p.lon, raios[p.id]);
        return (
          <g key={p.id}>
            <line x1={lx} y1={ly} x2={ponto(p.lon, raios[p.id] + 10)[0]} y2={ponto(p.lon, raios[p.id] + 10)[1]} stroke="#c93a77" strokeWidth="1" />
            <circle cx={x} cy={y} r="11" fill={p.id === "Sun" || p.id === "Moon" ? "#ff9cc6" : "#fff"} stroke="#2e2a4f" strokeWidth="1.2" />
            <text x={x} y={y + 0.5} textAnchor="middle" dominantBaseline="central" fontSize="13" fill="#2e2a4f">{p.simbolo}</text>
          </g>
        );
      })}

      <text x={C} y={C - 8} textAnchor="middle" fontSize="13" fontWeight="700" fill="#2e2a4f">alana</text>
      <text x={C} y={C + 10} textAnchor="middle" fontSize="9" fill="#6b6890">09.11.2004 · 17h40</text>
    </svg>
  );
}
