import { defaultScoreData } from "./demoData";
import type { ProjectState, ScoreCriterion } from "./types";

type LegacyScore = Partial<ProjectState["data"]["score"]> & {
  fun?: number;
  replayability?: number;
  interaction?: number;
  production?: number;
  teachability?: number;
};

export function hydrateProject(project: ProjectState): ProjectState {
  const legacyScore = project.data.score as LegacyScore;
  const criteria = Array.isArray(legacyScore.criteria) && legacyScore.criteria.length > 0
    ? legacyScore.criteria
    : legacyCriteriaFrom(legacyScore);

  return {
    ...project,
    resolution: project.resolution ?? "hd",
    data: {
      ...project.data,
      score: {
        ...defaultScoreData,
        ...project.data.score,
        criteria,
        animationDuration: project.data.score.animationDuration ?? defaultScoreData.animationDuration,
        animationMode: project.data.score.animationMode ?? defaultScoreData.animationMode,
        layout: project.data.score.layout ?? defaultScoreData.layout,
      },
    },
  };
}

function legacyCriteriaFrom(score: LegacyScore): ScoreCriterion[] {
  return [
    { id: "fun", name: "Diversión", value: score.fun ?? 9 },
    { id: "replayability", name: "Rejugabilidad", value: score.replayability ?? 8 },
    { id: "interaction", name: "Interacción", value: score.interaction ?? 7 },
    { id: "production", name: "Producción", value: score.production ?? 9 },
    { id: "teachability", name: "Facilidad de enseñar", value: score.teachability ?? 6 },
  ];
}
