// Janelinha estilo Windows XP
type Props = {
  titulo: string;
  icone?: string;
  cor?: "azul" | "rosa" | "verde" | "lilas" | "oncinha";
  className?: string;
  children: React.ReactNode;
};

export default function Janela({ titulo, icone = "✨", cor = "azul", className = "", children }: Props) {
  return (
    <section className={`janela janela-${cor} ${className}`}>
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
