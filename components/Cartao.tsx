// Cartão glam: moldura de oncinha + miolo creme + título de revista
import Floreio from "./Floreio";

type Props = {
  titulo: string;
  sobre?: string; // linha pequena em cima do título
  moldura?: "oncinha" | "rosa" | "preta";
  className?: string;
  children: React.ReactNode;
};

export default function Cartao({ titulo, sobre, moldura = "oncinha", className = "", children }: Props) {
  return (
    <section className={`cartao-glam moldura-${moldura} ${className}`}>
      <div className="cartao-miolo">
        <header className="cartao-topo">
          {sobre && <span className="cartao-sobre">{sobre}</span>}
          <h2 className="cartao-titulo">{titulo}</h2>
          <Floreio largura={86} className="cartao-floreio" />
        </header>
        {children}
      </div>
    </section>
  );
}
