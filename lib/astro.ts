// Cálculos de astrologia (posições reais dos planetas com astronomy-engine)
import * as A from "astronomy-engine";

export const SIGNOS = [
  "Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem",
  "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes",
];
// \uFE0E força o símbolo "de texto" (senão vira emoji colorido em alguns aparelhos)
export const SIMBOLOS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"].map((s) => s + "\uFE0E");
export const ELEMENTO = ["fogo", "terra", "ar", "água", "fogo", "terra", "ar", "água", "fogo", "terra", "ar", "água"];

export const PLANETAS = [
  { id: "Sun", nome: "Sol", simbolo: "☉" },
  { id: "Moon", nome: "Lua", simbolo: "☽" },
  { id: "Mercury", nome: "Mercúrio", simbolo: "☿" },
  { id: "Venus", nome: "Vênus", simbolo: "♀" },
  { id: "Mars", nome: "Marte", simbolo: "♂" },
  { id: "Jupiter", nome: "Júpiter", simbolo: "♃" },
  { id: "Saturn", nome: "Saturno", simbolo: "♄" },
  { id: "Uranus", nome: "Urano", simbolo: "♅" },
  { id: "Neptune", nome: "Netuno", simbolo: "♆" },
  { id: "Pluto", nome: "Plutão", simbolo: "♇" },
] as const;

export type Posicao = { id: string; nome: string; simbolo: string; lon: number; signo: number; grau: number; retro: boolean; casa?: number };

const norm = (x: number) => ((x % 360) + 360) % 360;
const rad = (x: number) => (x * Math.PI) / 180;
const deg = (x: number) => (x * 180) / Math.PI;
const EPS = rad(23.4392);

function longitude(id: string, t: A.AstroTime): number {
  if (id === "Sun") return A.SunPosition(t).elon;
  if (id === "Moon") return A.EclipticGeoMoon(t).lon;
  return A.Ecliptic(A.GeoVector(id as A.Body, t, true)).elon;
}

export function posicoes(data: Date): Posicao[] {
  const t = A.MakeTime(data);
  const t2 = t.AddDays(0.5);
  return PLANETAS.map((p) => {
    const lon = norm(longitude(p.id, t));
    const andou = ((longitude(p.id, t2) - lon + 540) % 360) - 180;
    return { ...p, lon, signo: Math.floor(lon / 30), grau: lon % 30, retro: p.id !== "Sun" && p.id !== "Moon" && andou < 0 };
  });
}

// Ascendente, Meio do Céu e casas (Placidus)
export function casas(data: Date, lat: number, lonGeo: number) {
  const t = A.MakeTime(data);
  const ramc = norm(A.SiderealTime(t) * 15 + lonGeo);
  const phi = rad(lat);
  const r = rad(ramc);
  const mc = norm(deg(Math.atan2(Math.sin(r), Math.cos(r) * Math.cos(EPS))));
  const asc = norm(deg(Math.atan2(Math.cos(r), -(Math.sin(r) * Math.cos(EPS) + Math.tan(phi) * Math.sin(EPS)))));

  const lonDeRA = (ra: number) => norm(deg(Math.atan2(Math.sin(rad(ra)), Math.cos(rad(ra)) * Math.cos(EPS))));
  const placidus = (fracao: number, acima: boolean) => {
    let lam = norm(ramc + (acima ? 1 : 2) * 60 * fracao);
    for (let i = 0; i < 30; i++) {
      const dec = Math.asin(Math.sin(EPS) * Math.sin(rad(lam)));
      const sda = deg(Math.acos(Math.max(-1, Math.min(1, -Math.tan(phi) * Math.tan(dec)))));
      const ra = acima ? ramc + fracao * sda : ramc + 180 - fracao * (180 - sda);
      lam = lonDeRA(ra);
    }
    return lam;
  };
  const c11 = placidus(1 / 3, true);
  const c12 = placidus(2 / 3, true);
  const c2 = placidus(2 / 3, false);
  const c3 = placidus(1 / 3, false);
  const cuspides = [asc, c2, c3, norm(mc + 180), norm(c11 + 180), norm(c12 + 180), norm(asc + 180), norm(c2 + 180), norm(c3 + 180), mc, c11, c12];
  return { asc, mc, cuspides };
}

export function casaDe(lon: number, cuspides: number[]): number {
  for (let i = 0; i < 12; i++) {
    const a = cuspides[i];
    const b = cuspides[(i + 1) % 12];
    const tam = norm(b - a);
    if (norm(lon - a) < tam) return i + 1;
  }
  return 1;
}

export const formatarGrau = (lon: number) => {
  const g = norm(lon) % 30;
  return `${Math.floor(g)}°${String(Math.floor((g % 1) * 60)).padStart(2, "0")}'`;
};
export const signoDe = (lon: number) => Math.floor(norm(lon) / 30);
