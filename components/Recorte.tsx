// Escreve uma palavra com letrinhas recortadas de revista.
// jogo "rosa" = letrinhas rosas, "cor" = letrinhas coloridas, "misto" = mistura as duas
const VARIANTES: Record<string, number> = {
  a: 3, b: 3, c: 3, d: 3, e: 3, f: 3, g: 3, h: 3, i: 3, j: 3, k: 2, l: 3, m: 3,
  n: 3, o: 3, p: 3, q: 3, r: 3, s: 3, t: 3, u: 3, v: 2, w: 3, x: 2, y: 3, z: 1,
};

type Jogo = "rosa" | "cor" | "misto";

export default function Recorte({ texto, altura = 56, semente = 0, jogo = "misto", className = "" }: { texto: string; altura?: number; semente?: number; jogo?: Jogo; className?: string }) {
  const limpo = texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const vistos: Record<string, number> = {};
  let i = 0;
  return (
    <span className={`recorte ${className}`} aria-label={texto} role="img" style={{ ["--alt" as string]: `${altura}px` }}>
      {limpo.split(" ").map((palavra, pi) => (
        <span key={pi} className="recorte-palavra">
          {[...palavra].map((ch) => {
            i++;
            const n = VARIANTES[ch];
            if (!n) return <span key={i} className="recorte-txt">{ch}</span>;
            const colorida = jogo === "cor" || (jogo === "misto" && (i + semente) % 2 === 0);
            vistos[ch] = (vistos[ch] ?? 0) + 1;
            const v = (vistos[ch] - 1 + semente + i) % n;
            const src = colorida ? `/revista/letras-cor/${ch}.webp` : `/revista/letras/${ch}${v}.webp`;
            const giro = (((i * 7 + semente * 3) % 9) - 4) * 1.6;
            const sobe = ((i * 5 + semente) % 5) - 2;
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt="" style={{ transform: `rotate(${giro}deg) translateY(${sobe}px)` }} />
            );
          })}
        </span>
      ))}
    </span>
  );
}
