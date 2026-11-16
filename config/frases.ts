// Frases do dia: diva pop + astrologia + bobagem. Uma por dia, em ordem.
// Pode adicionar quantas quiser no final da lista.

export const FRASES: string[] = [
  "Entra no rolê hoje como se fosse a abertura do seu próprio show.",
  "Escorpiana não esquece: nem as ofensas, nem o delineado.",
  "Hoje a Lua tá do seu lado. Se não estiver, finge que tá.",
  "Mercúrio pode até retrogradar. Você não.",
  "Glitter não é exagero, é estratégia.",
  "Ignora a mensagem com a classe de quem tem agenda de turnê.",
  "A vida é um palco e o seu tem iluminação de premiação.",
  "Diva não corre atrás. Diva lança e espera o hype.",
  "Até a Lua tem fases. Pode surtar de manhã e brilhar de noite.",
  "Fofoca boa é a que você ainda vai viver.",
  "Não é drama, é narrativa.",
  "Hoje é dia de postar sem pedir opinião de ninguém.",
  "Usa o look que você tá guardando pra ocasião especial. A ocasião é hoje.",
  "Escorpião não entra no ambiente. Escorpião causa impacto.",
  "Sua energia hoje: lançamento de álbum surpresa à meia-noite.",
  "Se perguntarem, você tá ocupada sendo icônica.",
  "Plutão te deu intensidade. Usa sem moderação.",
  "Seja tipo gloss: brilha até em dia nublado.",
  "Ninguém precisa entender o plano. Só assistir o resultado.",
  "O universo tá em modo 'ela merece'.",
  "Um close certo vale mais que mil explicações.",
  "Dia oficial de fazer a egípcia pra quem te deve desculpas.",
  "Vênus mandou avisar: hidrata o cabelo e o coração.",
  "Tem dia de coreografia e tem dia de playback. Os dois contam.",
  "Seja a amiga que chega com o salgadinho e a fofoca.",
  "Lua em qualquer signo, salto sempre alto.",
  "Tá liberado ser intensa hoje. Amanhã também.",
  "Seu feed, suas regras, sua trilha sonora.",
  "Saturno cobra, mas os boletos da sua alma tão em dia.",
  "Usa o perfume caro numa terça qualquer.",
  "Recado do cosmos: menos print, mais vida.",
  "Hoje você é o sinal que alguém pediu pro universo.",
  "Coração blindado, delineado afiado.",
  "Toda era começa com uma decisão. A sua começa hoje.",
  "Te subestimaram? Ótimo, o plot twist fica mais bonito.",
  "Manda o áudio de 3 minutos e não pede desculpa.",
  "Aquariano te deixou no vácuo? Problema do aquariano.",
  "Hoje sua aura tá com filtro de clipe dos anos 2000.",
  "Quem tem ascendente bom não precisa de iluminação.",
  "Se for pra ter recaída, que seja de sorvete.",
  "Bom dia só pra quem já acordou pensando no próximo conteúdo.",
  "Chega chegando, mas com a playlist certa tocando.",
];

export function fraseDoDia(data = new Date()): string {
  const inicio = new Date(data.getFullYear(), 0, 0);
  const dia = Math.floor((data.getTime() - inicio.getTime()) / 86400000);
  return FRASES[(dia + data.getFullYear()) % FRASES.length];
}
