import type { ProjectState, ScoreData, TemplateDataMap, TemplateType } from "./types";

export const defaultScoreData: ScoreData = {
  gameName: "Galaxias y Meeples",
  criteria: [
    { id: "fun", name: "Diversión", value: 9 },
    { id: "replayability", name: "Rejugabilidad", value: 8 },
    { id: "interaction", name: "Interacción", value: 7 },
    { id: "production", name: "Producción", value: 9 },
    { id: "teachability", name: "Facilidad de enseñar", value: 6 },
  ],
  finalScore: 8.5,
  finalLabel: "Compra segura",
  animationDuration: 1.6,
  animationMode: "sequential",
  layout: "full",
};

export const demoData: TemplateDataMap = {
  "game-card": {
    gameName: "Castillos de Cartón",
    publisher: "Mesa Clara",
    year: "2026",
    players: "2-4",
    duration: "45 min",
    age: "10+",
    difficulty: 3,
    categories: "Losetas, familiar, construcción",
    coverImage: "",
    verdict: "Familias y grupos que quieren construir combos sencillos sin una explicación larga.",
  },
  "pros-cons": {
    gameName: "Bosque de Losetas",
    coverImage: "",
    pros: ["Turnos rápidos", "Mesa muy bonita", "Escala bien a dos jugadores"],
    cons: ["Azar notable en el robo", "Puede quedarse corto para expertos"],
    verdict: "Un familiar amable que entra por los ojos y sale mucho a mesa.",
  },
  score: defaultScoreData,
  ranking: {
    title: "Top fillers para abrir la noche",
    items: [
      { position: 1, name: "Dados al Alba", comment: "Rápido, tenso y muy fácil de sacar." },
      { position: 2, name: "Mercado Lunar", comment: "Subastas pequeñas con mucha risa." },
      { position: 3, name: "Trenes de Bolsillo", comment: "Decisiones limpias en quince minutos." },
      { position: 4, name: "Isla Minuta", comment: "Perfecto para enseñar a cualquiera." },
      { position: 5, name: "Setas y Sombras", comment: "El punto justo de malicia." },
    ],
  },
  versus: {
    gameA: "Castillos de Cartón",
    gameB: "Bosque de Losetas",
    durationA: "45 min",
    durationB: "35 min",
    difficultyA: 3,
    difficultyB: 2,
    interactionA: 6,
    interactionB: 4,
    bestForA: "Grupos que quieren construir combos sencillos",
    bestForB: "Familias que priorizan fluidez y mesa bonita",
    winner: "Gana Castillos de Cartón por tener más recorrido.",
  },
};

export function createInitialProject(template: TemplateType = "game-card"): ProjectState {
  return {
    template,
    format: "horizontal",
    resolution: "hd",
    theme: "dark",
    data: structuredClone(demoData),
  };
}

export function demoProjectFor(template: TemplateType): ProjectState {
  return {
    template,
    format: "horizontal",
    resolution: "hd",
    theme: template === "ranking" ? "colorful" : "dark",
    data: structuredClone(demoData),
  };
}
