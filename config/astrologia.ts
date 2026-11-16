// Tudo de astrologia do site. Os textos são escritos pra Alana.

export const NASCIMENTO = {
  // 9/11/2004 às 17h40 em Morada Nova (CE). Ceará não teve horário de verão em 2004 → UTC-3
  data: new Date(Date.UTC(2004, 10, 9, 20, 40)),
  local: "Morada Nova, Ceará",
  lat: -5.1067,
  lon: -38.3725,
};

// Visual da capa/fundo da astrologia:
// "areia" = fundo de areia + mar, capa de dia com coqueiros
// "praia" = fundo de água, capa de dia com a foto da praia (areia + mar)
export const VISUAL_H2O: "areia" | "praia" = "praia";

// ---------- SEU MAPA ----------
export const BIG3 = {
  sol: "Escorpião: intensa, observadora e leal até o fim. Você sente tudo em dobro e não aceita nada pela metade.",
  lua: "Libra: emocionalmente você precisa de harmonia, beleza e gente gostosa por perto. Briga te desgasta muito.",
  asc: "Touro: a primeira impressão que você passa é de calma, charme e estilo. Parece tranquila, mas é firme.",
};

export const INTERPRETACOES: Record<string, { titulo: string; texto: string }> = {
  Sun: {
    titulo: "Sol em Escorpião na casa 6",
    texto: "Sua essência é intensa e magnética. Na casa 6, você brilha na rotina, no trabalho e no cuidado com o corpo: quando se dedica a algo, vai até o fundo e faz melhor que todo mundo. Cuidado só pra não se cobrar demais.",
  },
  Moon: {
    titulo: "Lua em Libra na casa 5",
    texto: "Você se sente bem quando tem beleza, arte, romance e diversão. Casa 5 é a casa da criatividade e do brilho: criar conteúdo, se arrumar e mostrar suas coisas te alimenta emocionalmente.",
  },
  Mercury: {
    titulo: "Mercúrio em Sagitário na casa 7",
    texto: "Você pensa grande e fala com entusiasmo e sinceridade (às vezes até demais). Aprende muito trocando ideia com outras pessoas e gosta de parcerias que te tiram do lugar.",
  },
  Venus: {
    titulo: "Vênus em Libra na casa 5",
    texto: "Vênus em casa! No amor e no estilo você é romântica, elegante e tem olho bom pra estética. Casa 5 deixa tudo mais divertido: flertar, criar e se exibir um pouquinho faz parte.",
  },
  Mars: {
    titulo: "Marte em Libra na casa 6",
    texto: "Você age com diplomacia e prefere resolver as coisas com jeitinho. No dia a dia, rende muito quando trabalha em dupla ou em ambiente bonito e organizado. Último grau de Libra: decidir às vezes custa.",
  },
  Jupiter: {
    titulo: "Júpiter em Libra na casa 5",
    texto: "Sorte na criatividade, nos relacionamentos e em tudo que envolve beleza. Conteúdo, moda e arte são lugares onde as portas abrem mais fácil pra você.",
  },
  Saturn: {
    titulo: "Saturno retrógrado em Câncer na casa 3",
    texto: "Você leva a comunicação e os estudos a sério e às vezes demora pra confiar na própria voz. Com o tempo isso vira maturidade: o que você fala tem peso.",
  },
  Uranus: {
    titulo: "Urano retrógrado em Peixes na casa 10",
    texto: "Carreira fora da caixinha! Você tende a seguir caminhos profissionais diferentes e criativos, misturando intuição com tecnologia.",
  },
  Neptune: {
    titulo: "Netuno em Aquário na casa 9",
    texto: "Você sonha com ideias novas, viagens e conhecimento. Sua visão de mundo é aberta, coletiva e cheia de imaginação.",
  },
  Pluto: {
    titulo: "Plutão em Sagitário na casa 8",
    texto: "Transformações profundas vêm através de crenças, parcerias e intimidade. Você muda muito ao longo da vida e sai sempre mais forte.",
  },
  Asc: {
    titulo: "Ascendente em Touro",
    texto: "Seu jeito de chegar é calmo, charmoso e sensual. As pessoas te veem como alguém de bom gosto, que gosta de conforto e coisas bonitas. Curiosidade: Touro é o signo oposto do seu Sol, então você mistura intensidade por dentro com calma por fora.",
  },
  MC: {
    titulo: "Meio do Céu em Aquário",
    texto: "Sua carreira pede liberdade, inovação e algo que faça diferença pras pessoas. Tecnologia e internet combinam muito com você (oi, engenharia de software e criação de conteúdo).",
  },
};

// ---------- HORÓSCOPO DO DIA ----------
// casa = onde a Lua de hoje cai contando a partir de Escorpião (1 = Lua em Escorpião)
export const HOROSCOPO_CASAS: { clima: string; amor: string; trabalho: string; bemestar: string }[] = [
  { clima: "A Lua tá no seu signo: dia de sentir tudo forte e de ser o centro das atenções.", amor: "Seu magnetismo tá no máximo. Usa a seu favor.", trabalho: "Ótimo pra começar algo que é a sua cara.", bemestar: "Cuida do humor: descansa se ficar sensível." },
  { clima: "Dia de pensar em dinheiro, conforto e no que te dá segurança.", amor: "Gestos práticos valem mais que palavras hoje.", trabalho: "Bom pra organizar as finanças e precificar seu trabalho.", bemestar: "Uma comidinha boa e um banho demorado resolvem." },
  { clima: "Cabeça a mil e vontade de conversar com todo mundo.", amor: "Manda aquela mensagem. Papo bom tá favorecido.", trabalho: "Ótimo pra escrever roteiro, legenda e responder mensagens.", bemestar: "Evita rolar o feed demais, a mente cansa." },
  { clima: "Clima mais caseiro e emotivo. Seu cantinho pede atenção.", amor: "Carinho, filme e conforto valem mais que sair.", trabalho: "Rende mais trabalhando de casa e no seu ritmo.", bemestar: "Arrumar o quarto vai te deixar leve." },
  { clima: "Dia de brilhar, criar e se divertir. Energia de protagonista.", amor: "Flerte e romance tão favorecidos. Se arruma!", trabalho: "Perfeito pra gravar conteúdo e mostrar sua criatividade.", bemestar: "Faz algo só porque é divertido." },
  { clima: "Dia de rotina, organização e cuidar do corpo.", amor: "Demonstra amor nos detalhes e na ajuda.", trabalho: "Ótimo pra tirar pendências da lista e planejar a semana.", bemestar: "Treino, água e sono em dia. Seu corpo agradece." },
  { clima: "O foco vai pros outros: parcerias, amizades e relacionamentos.", amor: "Conversa franca aproxima. Ouça também.", trabalho: "Bom pra collabs e pedir opinião de alguém.", bemestar: "Não esquece de você no meio de tanta gente." },
  { clima: "Dia intenso e profundo, bem a sua cara de escorpiana.", amor: "Conexões mais íntimas e verdadeiras. Nada de superficialidade.", trabalho: "Bom pra pesquisar a fundo e resolver o que tava travado.", bemestar: "Desapega do que pesa. Faxina emocional." },
  { clima: "Vontade de aprender, sair da rotina e sonhar alto.", amor: "Programa diferente anima o romance.", trabalho: "Ótimo pra estudar e planejar ideias grandes.", bemestar: "Uma caminhada ou um rolê novo recarrega." },
  { clima: "Dia de foco na carreira e nas metas.", amor: "Pode ficar mais séria. Explica que é foco, não frieza.", trabalho: "Excelente pra produzir, apresentar e ser vista.", bemestar: "Faz pausas: produtividade também cansa." },
  { clima: "Clima de amizades, grupos e internet.", amor: "Amigos podem aproximar alguém especial.", trabalho: "Ótimo pra postar, interagir e ter ideias novas.", bemestar: "Fala com as amigas, faz bem pra alma." },
  { clima: "Dia mais sensível e introspectivo. Escuta sua intuição.", amor: "Silêncio também é carinho. Respeita seu tempo.", trabalho: "Bom pra fechar ciclos e organizar bastidores.", bemestar: "Dorme cedo, faz skincare e desliga o celular." },
];

export const LUA_NO_SIGNO = [
  "Lua em Áries: todo mundo mais impaciente e corajoso.",
  "Lua em Touro: clima de conforto, comida boa e calma.",
  "Lua em Gêmeos: dia falante, curioso e cheio de mensagens.",
  "Lua em Câncer: emoções à flor da pele, saudade e aconchego.",
  "Lua em Leão: dia de brilhar e ser vista.",
  "Lua em Virgem: vontade de organizar e resolver tudo.",
  "Lua em Libra: clima de harmonia, beleza e romance.",
  "Lua em Escorpião: intensidade total, a sua energia.",
  "Lua em Sagitário: otimismo, risada e vontade de sair.",
  "Lua em Capricórnio: foco, disciplina e responsabilidade.",
  "Lua em Aquário: ideias diferentes e vontade de liberdade.",
  "Lua em Peixes: dia sonhador, sensível e intuitivo.",
];

export const RETROGRADOS: Record<string, string> = {
  Mercury: "Mercúrio retrógrado: revisa mensagens antes de mandar e faz backup das coisas.",
  Venus: "Vênus retrógrada: evita mudanças radicais no visual e reflete sobre o amor.",
  Mars: "Marte retrógrado: energia mais baixa. Termina o que começou antes de inventar coisa nova.",
};

export const ASPECTOS_LUA_SOL: Record<string, string> = {
  conjuncao: "A Lua de hoje está colada no seu Sol: dia de recomeço e muita energia.",
  sextil: "A Lua faz sextil com seu Sol: oportunidades fáceis, aproveita.",
  quadratura: "A Lua faz quadratura com seu Sol: pode bater um estresse. Respira.",
  trigono: "A Lua faz trígono com seu Sol: tudo flui. Dia ótimo!",
  oposicao: "A Lua tá oposta ao seu Sol: equilibre o que você quer com o que os outros pedem.",
};

export const CORES_SORTE = ["vinho", "rosa chiclete", "preto", "lilás", "prata", "vermelho", "azul bebê", "dourado", "branco", "rosa bebê"];

// ---------- PREVISÃO DO MÊS (onde o Sol está, contando de Escorpião) ----------
export const MES_CASAS = [
  "Mês do seu aniversário! Sol no seu signo traz energia, autoestima e um novo ciclo. Hora de se colocar em primeiro lugar.",
  "Foco em dinheiro e no que você valoriza. Bom mês pra organizar as finanças e investir em você.",
  "Mês de muita conversa, estudo e ideias. Ótimo pra escrever, aprender e produzir conteúdo.",
  "A atenção vai pra casa e pra família. Bom mês pra mexer no seu espaço (o quarto da casa da vó!).",
  "Mês de diversão, romance e criatividade. Mostra seu talento e aproveita a vida.",
  "Rotina, saúde e trabalho em destaque. Ótimo pra criar hábitos e organizar a agenda.",
  "Relacionamentos e parcerias no centro. Bom pra collabs e conversas importantes.",
  "Mês profundo: transformação, intimidade e desapego. Fecha o que precisa fechar.",
  "Vontade de aprender e expandir. Cursos, viagens e planos grandes estão favorecidos.",
  "Carreira em alta. Mostra seu trabalho e corre atrás das metas.",
  "Amigos, grupos e internet em destaque. Ótimo pra crescer nas redes.",
  "Mês de recolhimento e intuição. Descansa e se prepara pro seu novo ciclo que vem aí.",
];

// ---------- ESCORPIÃO ----------
export const SOBRE_ESCORPIAO = {
  datas: "23 de outubro a 21 de novembro",
  elemento: "Água",
  modalidade: "Fixo",
  regentes: "Plutão e Marte",
  oposto: "Touro (que é o seu ascendente!)",
  palavra: "Transformação",
  qualidades: ["intensa", "leal", "magnética", "estratégica", "corajosa", "intuitiva"],
  desafios: ["ciumenta", "desconfiada", "rancorosa", "8 ou 80"],
  curiosidades: [
    "É um dos signos mais misteriosos do zodíaco: mostra pouco, observa tudo.",
    "Símbolos: o escorpião, a águia e a fênix, que renasce das cinzas.",
    "Não esquece nada. Nem o bom, nem o ruim.",
    "Quando ama, é pra valer. Quando sai, é pra sempre.",
  ],
};

// ---------- COMPATIBILIDADE (Escorpião com...) ----------
export const COMPATIBILIDADE: { nota: number; texto: string }[] = [
  { nota: 55, texto: "Fogo e paixão, mas os dois querem mandar. Briga boa, reconciliação melhor." },
  { nota: 80, texto: "Opostos que se completam. Química forte e muita lealdade." },
  { nota: 45, texto: "Gêmeos é leve demais pra sua intensidade. Divertido, mas difícil de durar." },
  { nota: 95, texto: "Dois signos de água: se entendem só no olhar. Muito carinho e cuidado." },
  { nota: 60, texto: "Dois signos fixos e orgulhosos. Atração forte, mas ninguém cede." },
  { nota: 85, texto: "Virgem traz calma e cuidado, você traz profundidade. Parceria sólida." },
  { nota: 65, texto: "Libra encanta, mas foge de conflito. Você quer verdade. Dá certo com conversa." },
  { nota: 90, texto: "Dois escorpianos: intensidade ao quadrado. Ou é pra sempre, ou é guerra." },
  { nota: 50, texto: "Sagitário quer liberdade, você quer entrega. Precisa de muito acordo." },
  { nota: 88, texto: "Capricórnio é leal e ambicioso como você. Casal poderoso." },
  { nota: 40, texto: "Aquário é desapegado demais pra você. Bom de amizade, difícil no amor." },
  { nota: 93, texto: "Peixes te entende como ninguém. Romance de filme." },
];

// ---------- CONTEÚDOS ----------
export const LINKS_ASTRO = [
  { nome: "Podcasts de astrologia", url: "https://open.spotify.com/search/astrologia/podcasts", sobre: "busca no Spotify" },
  { nome: "Horóscopo de Escorpião no YouTube", url: "https://www.youtube.com/results?search_query=hor%C3%B3scopo+escorpi%C3%A3o+semana", sobre: "previsões semanais" },
  { nome: "Podcasts sobre signos", url: "https://open.spotify.com/search/signos%20escorpi%C3%A3o/podcasts", sobre: "busca no Spotify" },
];
