export type Ideia = {
  id: string;
  titulo: string;
  descricao: string | null;
  formato: string | null;
  tema: string | null;
  link_referencia: string | null;
  imagens: string[];
  coluna: string;
  ordem: number;
  criado_em: string;
};

export type Evento = {
  id: string;
  titulo: string;
  data: string;
  hora: string | null;
  tipo: "post" | "compromisso" | "evento";
  ideia_id: string | null;
  contador: boolean;
  notas: string | null;
};

export type Meta = {
  id: string;
  titulo: string;
  area: string | null;
  periodo: "mes" | "ano";
  ano: number;
  mes: number | null;
  concluida: boolean;
};

export type Tarefa = {
  id: string;
  titulo: string;
  data: string | null;
  concluida: boolean;
  criado_em: string;
};

export const COLUNAS = [
  { id: "ideia", nome: "Ideia", icone: "💡" },
  { id: "roteiro", nome: "Roteiro", icone: "📝" },
  { id: "gravando", nome: "Gravando", icone: "🎬" },
  { id: "editando", nome: "Editando", icone: "✂️" },
  { id: "postado", nome: "Postado", icone: "✅" },
];

export const FORMATOS = ["Reels", "Carrossel", "Foto", "Story", "Vídeo longo", "Outro"];

export const TEMAS_CONTEUDO = [
  "Look / roupa", "Maquiagem", "Cabelo", "Quarto / decoração", "Alimentação",
  "Treino", "Cultura pop", "Rotina", "Faculdade / carreira", "Outro",
];

export const AREAS = ["Estudo", "Carreira", "Conteúdo", "Saúde", "Treino", "Dinheiro", "Casa", "Pessoal"];

export const TIPOS_EVENTO = [
  { id: "post", nome: "Post", icone: "📸" },
  { id: "compromisso", nome: "Compromisso", icone: "📌" },
  { id: "evento", nome: "Evento", icone: "🎉" },
] as const;
