export type TemplateType = "game-card" | "pros-cons" | "score" | "ranking" | "versus";

export type FormatType = "horizontal" | "vertical";

export type ResolutionType = "hd" | "4k";

export type ThemeType = "dark" | "colorful" | "minimal" | "no-solo-dados";

export type ScoreLayoutType = "full" | "lower-third";

export type ScoreAnimationMode = "together" | "sequential";

export type GameCardData = {
  gameName: string;
  publisher: string;
  year: string;
  players: string;
  duration: string;
  age: string;
  difficulty: number;
  categories: string;
  coverImage: string;
  verdict: string;
};

export type ProsConsData = {
  gameName: string;
  pros: string[];
  cons: string[];
  verdict: string;
};

export type ScoreCriterion = {
  id: string;
  name: string;
  value: number;
};

export type ScoreData = {
  gameName: string;
  criteria: ScoreCriterion[];
  finalScore: number;
  finalLabel: string;
  animationDuration: number;
  animationMode: ScoreAnimationMode;
  layout: ScoreLayoutType;
};

export type RankingItem = {
  position: number;
  name: string;
  comment: string;
};

export type RankingData = {
  title: string;
  items: RankingItem[];
};

export type VersusData = {
  gameA: string;
  gameB: string;
  durationA: string;
  durationB: string;
  difficultyA: number;
  difficultyB: number;
  interactionA: number;
  interactionB: number;
  bestForA: string;
  bestForB: string;
  winner: string;
};

export type TemplateDataMap = {
  "game-card": GameCardData;
  "pros-cons": ProsConsData;
  score: ScoreData;
  ranking: RankingData;
  versus: VersusData;
};

export type ProjectState = {
  template: TemplateType;
  format: FormatType;
  resolution: ResolutionType;
  theme: ThemeType;
  data: TemplateDataMap;
};

export const TEMPLATE_LABELS: Record<TemplateType, string> = {
  "game-card": "Ficha técnica",
  "pros-cons": "Pros y contras",
  score: "Puntuación final",
  ranking: "Ranking Top",
  versus: "Versus",
};

export const FORMAT_SIZES: Record<FormatType, { width: number; height: number; label: string }> = {
  horizontal: { width: 1920, height: 1080, label: "Horizontal 16:9" },
  vertical: { width: 1080, height: 1920, label: "Vertical 9:16" },
};

export const RESOLUTION_LABELS: Record<ResolutionType, string> = {
  hd: "1080p",
  "4k": "4K",
};

export function getCanvasSize(format: FormatType, resolution: ResolutionType) {
  const base = FORMAT_SIZES[format];
  const multiplier = getResolutionScale(resolution);

  return {
    width: base.width * multiplier,
    height: base.height * multiplier,
  };
}

export function getBaseCanvasSize(format: FormatType) {
  return FORMAT_SIZES[format];
}

export function getResolutionScale(resolution: ResolutionType) {
  return resolution === "4k" ? 2 : 1;
}
