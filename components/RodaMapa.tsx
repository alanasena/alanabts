import { SIMBOLOS, type Posicao } from "@/lib/astro";
import { ASPECTOS, NOME_ASPECTO } from "@/config/mapa-leituras";

// Roda do mapa astral (Ascendente à esquerda), com cores fortes por elemento e linhas de aspectos
const COR_ELEMENTO = ["#e0185f", "#5aa02c", "#f39200", "#0099d6"]; // fogo, terra, ar, água
const ROXO = "#8b3a96";

export default function RodaMapa({ planetas, asc, mc, cuspides }: { planetas: Posicao[]; asc: number; mc: number; cuspides: number[] }) {
  const C = 200;
  const ang = (lon: number) => ((180 + (lon - asc)) * Math.PI) / 180;
  const ponto = (lon: number, r: number) => [C + r * Math.cos(ang(lon)), C - r * Math.sin(ang(lon))];

  const ordenados = [...planetas].sort((a, b) => a.lon - b.lon);
  const raios: Record<string, number> = {};
  const NIVEIS = [130, 110, 90];
  ordenados.forEach((p, i) => {
    const ant = ordenados[i - 1];
    const perto = ant && Math.abs(p.lon - ant.lon) < 9;
    raios[p.id] = perto ? NIVEIS[(NIVEIS.indexOf(raios[ant.id]) + 1) % NIVEIS.length] : NIVEIS[0];
  });
  const lonDe = (id: string) => planetas.find((p) => p.id === id)!.lon;

  return (
    <svg viewBox="0 0 400 400" className="roda-mapa" role="img" aria-label="Roda do mapa astral">
      <circle cx={C} cy={C} r={196} fill="#f6eef6" />
      <circle cx={C} cy={C} r={186} fill="#fff" stroke={ROXO} strokeWidth="3" />
      <circle cx={C} cy={C} r={156} fill="none" stroke={ROXO} strokeWidth="3" />

      {/* divisões e símbolos dos signos */}
      {Array.from({ length: 12 }, (_, i) => {
        const [x1, y1] = ponto(i * 30, 156);
        const [x2, y2] = ponto(i * 30, 186);
        const [tx, ty] = ponto(i * 30 + 15, 171);
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={ROXO} strokeWidth="1.5" />
            <text x={tx} y={ty} textAnchor="middle" dominantBaseline="central" fontSize="19" fontWeight="700" fill={COR_ELEMENTO[i % 4]}>{SIMBOLOS[i]}</text>
          </g>
        );
      })}
      {/* tracinhos de grau */}
      {Array.from({ length: 72 }, (_, i) => {
        const [x1, y1] = ponto(i * 5, 156);
        const [x2, y2] = ponto(i * 5, i % 2 ? 151 : 148);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ROXO} strokeWidth="1" />;
      })}

      <circle cx={C} cy={C} r={70} fill="#f6eef6" />

      {/* casas */}
      {cuspides.map((c, i) => {
        const eixo = i === 0 || i === 3 || i === 6 || i === 9;
        const [x1, y1] = ponto(c, eixo ? 30 : 70);
        const [x2, y2] = ponto(c, eixo ? 196 : 156);
        const meio = c + (((cuspides[(i + 1) % 12] - c + 360) % 360) / 2);
        const [tx, ty] = ponto(meio, 80);
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={eixo ? "#333" : ROXO} strokeWidth={eixo ? 1.6 : 1.1} />
            <text x={tx} y={ty} fontSize="10" fontWeight="700" fill={ROXO} textAnchor="middle" dominantBaseline="central">{i + 1}</text>
          </g>
        );
      })}

      {/* aspectos */}
      {ASPECTOS.map((a) => {
        const [x1, y1] = ponto(lonDe(a.a), 64);
        const [x2, y2] = ponto(lonDe(a.b), 64);
        return <line key={a.a + a.b} x1={x1} y1={y1} x2={x2} y2={y2} stroke={NOME_ASPECTO[a.tipo].tenso ? "#ef4b5b" : "#2aa7e0"} strokeWidth="1.2" />;
      })}
      <circle cx={C} cy={C} r={64} fill="none" stroke={ROXO} strokeWidth="1.5" />
      <circle cx={C} cy={C} r={22} fill="#fff" stroke={ROXO} strokeWidth="1.5" />
      <text x={C} y={C + 1} textAnchor="middle" dominantBaseline="central" fontSize="16" fill={ROXO}>♏︎</text>

      {/* planetas */}
      {planetas.map((p) => {
        const [lx, ly] = ponto(p.lon, 156);
        const [lx2, ly2] = ponto(p.lon, 146);
        const [x, y] = ponto(p.lon, raios[p.id]);
        return (
          <g key={p.id}>
            <line x1={lx} y1={ly} x2={lx2} y2={ly2} stroke="#333" strokeWidth="1.5" />
            <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="18" fill="#2b2b2b">{p.simbolo}</text>
          </g>
        );
      })}

      {[["ASC", asc], ["MC", mc]].map(([nome, lon]) => {
        const [x, y] = ponto(lon as number, 192);
        return (
          <g key={nome as string}>
            <rect x={x - 13} y={y - 7} width="26" height="14" rx="7" fill={ROXO} />
            <text x={x} y={y + 0.5} fontSize="8.5" fontWeight="700" fill="#fff" textAnchor="middle" dominantBaseline="central">{nome}</text>
          </g>
        );
      })}
    </svg>
  );
}
