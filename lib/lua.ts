// Fase da Lua calculada pela data (sem internet).
const SINODICO = 29.530588853;
const LUA_NOVA_REF = Date.UTC(2000, 0, 6, 18, 14);

export function faseDaLua(data = new Date()) {
  const dias = (data.getTime() - LUA_NOVA_REF) / 86400000;
  const idade = ((dias % SINODICO) + SINODICO) % SINODICO;
  const fracao = idade / SINODICO;
  const iluminacao = Math.round(((1 - Math.cos(2 * Math.PI * fracao)) / 2) * 100);

  const fases = [
    { ate: 1.84, nome: "Lua Nova", emoji: "", dica: "Hora de plantar intenção nova. Anota as ideias." },
    { ate: 5.53, nome: "Lua Crescente", emoji: "", dica: "Energia subindo: bom pra começar projeto." },
    { ate: 9.22, nome: "Quarto Crescente", emoji: "", dica: "Dia de agir e tirar a ideia do papel." },
    { ate: 12.91, nome: "Crescente Gibosa", emoji: "", dica: "Ajusta os detalhes, refina o conteúdo." },
    { ate: 16.61, nome: "Lua Cheia", emoji: "", dica: "Tudo à flor da pele. Ótimo pra postar e brilhar." },
    { ate: 20.3, nome: "Minguante Gibosa", emoji: "", dica: "Agradece o que deu certo e compartilha." },
    { ate: 23.99, nome: "Quarto Minguante", emoji: "", dica: "Desapega do que não serve mais." },
    { ate: 27.68, nome: "Lua Minguante", emoji: "", dica: "Desacelera, descansa, faz skincare." },
    { ate: 99, nome: "Lua Nova", emoji: "", dica: "Hora de plantar intenção nova. Anota as ideias." },
  ];
  const fase = fases.find((f) => idade < f.ate)!;
  return { ...fase, iluminacao, fracao, idade: Math.round(idade) };
}
