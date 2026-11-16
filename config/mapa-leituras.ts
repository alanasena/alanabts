// Leituras rápidas do mapa da Alana (textos próprios, curtinhos, pra ler na hora)

// Casas iguais às do Personare (planeta bem perto da casa seguinte já conta pra ela)
export const CASA_DO_PLANETA: Record<string, number> = {
  Sun: 7, Moon: 5, Mercury: 7, Venus: 5, Mars: 6, Jupiter: 5, Saturn: 3, Uranus: 10, Neptune: 10, Pluto: 8,
};

export const LEITURA_PLANETAS: Record<string, string> = {
  Sun: "Sua essência é intensa e profunda. Na casa 7, você se descobre e brilha através das parcerias e relações.",
  Moon: "Você se sente bem com beleza, romance e diversão. Criar e se mostrar te alimenta por dentro.",
  Mercury: "Fala com sinceridade e entusiasmo. Aprende muito trocando ideia com outras pessoas.",
  Venus: "Romântica, elegante e com olho bom pra estética. Ama com leveza e charme.",
  Mars: "Age com diplomacia. No dia a dia, rende mais com organização e em boa companhia.",
  Jupiter: "Sorte na criatividade, no amor e em tudo que envolve beleza e arte.",
  Saturn: "Leva estudos e comunicação a sério. Com o tempo, o que você fala ganha muito peso.",
  Uranus: "Carreira fora da caixinha, misturando intuição, criatividade e tecnologia.",
  Neptune: "Sonha com uma carreira criativa que inspire muita gente. Internet combina com você.",
  Pluto: "Passa por transformações profundas na vida e sempre renasce mais forte.",
  Asc: "A primeira impressão que você passa é de calma, charme e bom gosto.",
  MC: "Sua carreira pede liberdade, inovação e algo que faça diferença pras pessoas.",
  DSC: "Atrai relações intensas e leais. Quer profundidade, nada superficial.",
  FC: "Seu lar precisa ser acolhedor, bonito e cheio de afeto.",
};

// Signo que começa cada casa (cúspide) → leitura
export const LEITURA_SIGNO_CASA: Record<number, string> = {
  1: "Você se apresenta com calma, charme e estilo.",
  2: "Ganha dinheiro com comunicação, ideias e várias fontes ao mesmo tempo.",
  3: "Fala com o coração. Família próxima e irmãos são importantes.",
  4: "Sua casa é seu palco: gosta de um lar bonito e caloroso.",
  5: "Cria com capricho e atenção aos detalhes.",
  6: "Sua rotina rende mais quando é bonita, organizada e em boa companhia.",
  7: "Parcerias intensas, leais e transformadoras.",
  8: "Encara as crises com otimismo e aprende muito com elas.",
  9: "Leva os estudos e as crenças a sério, com metas claras.",
  10: "Carreira original, ligada a tecnologia e inovação.",
  11: "Amizades sensíveis e o sonho de ajudar as pessoas.",
  12: "Nos bastidores, você tem coragem pra enfrentar seus medos sozinha.",
};

export const SIGNIFICADO_CASA: Record<number, string> = {
  1: "Identidade, aparência e o jeito de chegar.",
  2: "Dinheiro, valores e o que te dá segurança.",
  3: "Comunicação, estudos e irmãos.",
  4: "Casa, família e raízes.",
  5: "Criatividade, romance e diversão.",
  6: "Rotina, trabalho e saúde.",
  7: "Relacionamentos e parcerias.",
  8: "Transformação, intimidade e dinheiro compartilhado.",
  9: "Estudos, viagens e crenças.",
  10: "Carreira, metas e reputação.",
  11: "Amigos, grupos e sonhos.",
  12: "Espiritualidade, inconsciente e bastidores.",
};

export type Aspecto = { a: string; b: string; tipo: "conjuncao" | "sextil" | "quadratura" | "trigono" | "oposicao"; texto: string };

export const NOME_ASPECTO = {
  conjuncao: { nome: "Conjunção", simbolo: "☌", tenso: false },
  sextil: { nome: "Sextil", simbolo: "⚹", tenso: false },
  quadratura: { nome: "Quadratura", simbolo: "□", tenso: true },
  trigono: { nome: "Trígono", simbolo: "△", tenso: false },
  oposicao: { nome: "Oposição", simbolo: "☍", tenso: true },
};

export const ASPECTOS: Aspecto[] = [
  { a: "Sun", b: "Neptune", tipo: "quadratura", texto: "Às vezes você idealiza demais pessoas e situações. Confia, mas confere." },
  { a: "Moon", b: "Mercury", tipo: "sextil", texto: "Facilidade pra colocar o que sente em palavras." },
  { a: "Moon", b: "Venus", tipo: "conjuncao", texto: "Carinhosa e romântica: emoção e amor andam juntos." },
  { a: "Moon", b: "Jupiter", tipo: "conjuncao", texto: "Coração generoso, otimista e acolhedor." },
  { a: "Moon", b: "Neptune", tipo: "trigono", texto: "Intuição forte e muita sensibilidade artística." },
  { a: "Mercury", b: "Jupiter", tipo: "sextil", texto: "Mente curiosa, ótima pra aprender e ensinar." },
  { a: "Mercury", b: "Uranus", tipo: "quadratura", texto: "Ideias rápidas e originais. Às vezes fala antes de pensar." },
  { a: "Venus", b: "Jupiter", tipo: "conjuncao", texto: "Sorte no amor e charme de sobra." },
  { a: "Venus", b: "Neptune", tipo: "trigono", texto: "Romantismo de filme e talento pra arte e estética." },
  { a: "Mars", b: "Saturn", tipo: "quadratura", texto: "Às vezes sente que precisa se esforçar em dobro, e isso te deixa forte." },
  { a: "Mars", b: "Uranus", tipo: "trigono", texto: "Coragem pra fazer diferente e agir rápido." },
  { a: "Jupiter", b: "Neptune", tipo: "trigono", texto: "Fé, imaginação e vontade de ajudar." },
];
