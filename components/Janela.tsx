// Janelinha estilo Windows XP, versão 2000s rosa (com fitinha colando no mural)
export type CorJanela = "rosa" | "preto" | "oncinha" | "zebra" | "prata" | "azul" | "verde" | "lilas";

type Props = {
  titulo: string;
  icone?: string;
  cor?: CorJanela;
  fita?: boolean;
  className?: string;
  children: React.ReactNode;
};

export default function Janela({ titulo, icone = "✨", cor = "rosa", fita = false, className = "", children }: Props) {
  return (
    <section className={`janela janela-${cor} ${className}`}>
      {fita && <span className="fita" aria-hidden />}
      <div className="janela-titulo">
        <span className="janela-nome">
          <span aria-hidden>{icone}</span> {titulo}
        </span>
        <span className="janela-botoes" aria-hidden>
          <i className="min">_</i>
          <i className="max">□</i>
          <i className="fechar">×</i>
        </span>
      </div>
      <div className="janela-corpo">{children}</div>
    </section>
  );
}
