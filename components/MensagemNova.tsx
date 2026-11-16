"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { FraseDoDia } from "./HojeNoCeu";

// "você tem (1) nova mensagem" — ao clicar em ok, aparece a frase do dia
export default function MensagemNova() {
  const [aberta, setAberta] = useState(false);
  if (aberta) return <FraseDoDia />;
  return (
    <div className="msg-nova">
      <Heart size={30} className="msg-coracao" fill="#ff8fc0" />
      <p>você tem<br />(1) nova mensagem</p>
      <button className="botao-ok" onClick={() => setAberta(true)}>ok</button>
    </div>
  );
}
