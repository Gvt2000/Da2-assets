import type { ProjectState } from "./types";

const STORAGE_KEY = "meeplemotion:last-project";

export function saveProject(project: ProjectState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
}

export function loadProject(): ProjectState | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as ProjectState;
  } catch {
    return null;
  }
}
