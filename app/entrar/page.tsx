"use client";

import Link from "next/link";
import Janela from "@/components/Janela";
import { FormEntrar, useSessao } from "@/components/Sessao";

export default function Entrar() {
  const { usuaria, sair } = useSessao();
  return (
    <div className="pagina trancado">
      <h1 className="titulo-pagina">Entrar</h1>
      <Janela titulo="login.exe" icone="" cor="preto" fita>
        {usuaria ? (
          <div className="trancado-msg">
            <p>Oi, Alana! Você já tá logada</p>
            <p>
              <Link href="/ideias" className="botao-gloss">ir pras ideias</Link>{" "}
              <button className="botao-preto" onClick={sair}>sair</button>
            </p>
          </div>
        ) : (
          <FormEntrar />
        )}
      </Janela>
    </div>
  );
}
