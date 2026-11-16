import Janela, { type CorJanela } from "./Janela";

type Props = {
  titulo: string;
  icone: string;
  vibe: string;
  etapa: string;
  vaiTer: string[];
  privada?: boolean;
  cor?: CorJanela;
};

// Página provisória das abas que ainda vão ser feitas
export default function EmBreve({ titulo, icone, vibe, etapa, vaiTer, privada, cor = "rosa" }: Props) {
  return (
    <div className={`pagina vibe-${vibe}`}>
      <h1 className="titulo-pagina">
        <span className="emoji" aria-hidden>{icone}</span> {titulo}
        {privada && <span className="selo-privado">🔒 só a Alana</span>}
      </h1>
      <Janela titulo={`${titulo.toLowerCase().replace(/\s/g, "_")}.exe`} icone={icone} cor={cor}>
        <div className="em-construcao">
          <div className="faixa-obra">🚧 EM CONSTRUÇÃO 🚧 EM CONSTRUÇÃO 🚧 EM CONSTRUÇÃO 🚧</div>
          <p className="pixel">chega na {etapa}</p>
          <p>O que vai ter aqui:</p>
          <ul className="lista-brilho">
            {vaiTer.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </div>
      </Janela>
    </div>
  );
}
