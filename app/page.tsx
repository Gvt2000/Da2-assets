"use client";

import { useMemo, useRef, useState } from "react";
import { CheckCircle2, PanelsTopLeft, Play } from "lucide-react";
import { AnimatedExportButton } from "@/components/AnimatedExportButton";
import { EditorPanel } from "@/components/EditorPanel";
import { ExportButton } from "@/components/ExportButton";
import { PreviewPanel } from "@/components/PreviewPanel";
import { TemplateSelector } from "@/components/TemplateSelector";
import { createInitialProject, demoProjectFor } from "@/lib/demoData";
import { getProjectFileName } from "@/lib/filename";
import { hydrateProject } from "@/lib/hydrateProject";
import { loadProject, saveProject } from "@/lib/storage";
import { getCanvasSize, TEMPLATE_LABELS, type ProjectState, type TemplateType } from "@/lib/types";

export default function Home() {
  const [project, setProject] = useState<ProjectState>(() => hydrateProject(createInitialProject()));
  const [status, setStatus] = useState("Demo inicial cargada");
  const [animationNonce, setAnimationNonce] = useState(0);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const fileName = useMemo(() => getProjectFileName(project), [project]);
  const canvasSize = getCanvasSize(project.format, project.resolution);

  function replayScoreAnimation() {
    setAnimationNonce((value) => value + 1);
  }

  function handleTemplateChange(template: TemplateType) {
    setProject((current) => ({ ...current, template }));
    if (template === "score") replayScoreAnimation();
    setStatus(`Plantilla activa: ${TEMPLATE_LABELS[template]}`);
  }

  function handleSave() {
    saveProject(project);
    setStatus("Proyecto guardado en este navegador");
  }

  function handleLoad() {
    const saved = loadProject();
    if (saved) {
      const hydratedProject = hydrateProject(saved);
      setProject(hydratedProject);
      if (hydratedProject.template === "score") replayScoreAnimation();
      setStatus("Último proyecto cargado");
      return;
    }
    setStatus("No hay proyecto guardado todavía");
  }

  function handleDemo() {
    setProject(hydrateProject(demoProjectFor(project.template)));
    if (project.template === "score") replayScoreAnimation();
    setStatus(`Demo cargada para ${TEMPLATE_LABELS[project.template]}`);
  }

  return (
    <main className="min-h-screen px-4 py-6 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1800px]">
        <header className="mb-6 flex flex-col gap-5 rounded-lg border border-white/10 bg-white/[0.035] p-5 shadow-2xl lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-orange-300/25 bg-orange-400/10 px-3 py-2 text-sm font-bold text-orange-100">
              <PanelsTopLeft className="size-4" />
              MeepleMotion
            </div>
            <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl">MeepleMotion</h1>
            <p className="mt-2 max-w-2xl text-base font-medium text-zinc-300 sm:text-lg">Generador de assets para vídeos de juegos de mesa</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/10 bg-black/22 px-3 py-2 text-sm font-semibold text-zinc-300">
              <CheckCircle2 className="size-4 text-teal-200" />
              {status}
            </div>
            {project.template === "score" ? (
              <>
                <button
                  type="button"
                  onClick={replayScoreAnimation}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.075] px-4 py-3 text-sm font-bold text-zinc-100 transition hover:border-teal-300/50 hover:bg-white/[0.11]"
                >
                  <Play className="size-4" />
                  Previsualizar animación
                </button>
                <AnimatedExportButton
                  targetRef={previewRef}
                  fileName={fileName}
                  duration={project.data.score.animationDuration ?? 1.6}
                  animationMode={project.data.score.animationMode}
                  criteriaCount={project.data.score.criteria.length}
                />
              </>
            ) : null}
            <ExportButton targetRef={previewRef} fileName={fileName} />
          </div>
        </header>

        <section className="mb-6">
          <TemplateSelector value={project.template} onChange={handleTemplateChange} />
        </section>

        <section className="grid gap-6 xl:grid-cols-[430px_1fr]">
          <EditorPanel project={project} onChange={(nextProject) => setProject(hydrateProject(nextProject))} onSave={handleSave} onLoad={handleLoad} onDemo={handleDemo} />
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-white">Previsualización</h2>
                <p className="text-sm text-zinc-400">{fileName}</p>
              </div>
              <span className="rounded-md border border-white/10 bg-black/24 px-3 py-2 text-sm font-bold text-zinc-300">
                {canvasSize.width}x{canvasSize.height}
              </span>
            </div>
            <PreviewPanel ref={previewRef} project={project} animationNonce={animationNonce} />
          </div>
        </section>
      </div>
    </main>
  );
}
