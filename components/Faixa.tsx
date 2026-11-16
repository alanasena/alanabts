// Faixa de avisos que corre lá em cima (e embaixo)
const AVISOS = [
  "bem-vinda ao QG da alana",
  "ideias novas toda semana",
  "siga @alanabts_",
  "divas do pop only",
  "zero tigrinho garantido",
  "feito com glitter e internet discada",
];

export default function Faixa({ invertida = false }: { invertida?: boolean }) {
  const texto = AVISOS.map((a) => `✦ ${a} `).join("");
  return (
    <div className={`faixa-avisos ${invertida ? "invertida" : ""}`} aria-hidden>
      <span className="faixa-ponta" />
      <div className="faixa-trilho">
        <span>{texto}{texto}</span>
      </div>
      <span className="faixa-ponta" />
    </div>
  );
}
