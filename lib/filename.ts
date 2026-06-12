import { TEMPLATE_LABELS, type ProjectState } from "./types";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 70);
}

export function getProjectFileName(project: ProjectState) {
  let name: string;

  switch (project.template) {
    case "ranking":
      name = project.data.ranking.title;
      break;
    case "versus":
      name = `${project.data.versus.gameA} vs ${project.data.versus.gameB}`;
      break;
    case "game-card":
      name = project.data["game-card"].gameName;
      break;
    case "pros-cons":
      name = project.data["pros-cons"].gameName;
      break;
    case "score":
      name = project.data.score.gameName;
      break;
  }

  const template = slugify(TEMPLATE_LABELS[project.template]);

  return `${slugify(name) || "meeplemotion"}-${template}.png`;
}
