"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import type { ProjectState } from "@/lib/types";
import { getCanvasSize } from "@/lib/types";
import { GameCardTemplate } from "./templates/GameCardTemplate";
import { ProsConsTemplate } from "./templates/ProsConsTemplate";
import { RankingTemplate } from "./templates/RankingTemplate";
import { ScoreTemplate } from "./templates/ScoreTemplate";
import { VersusTemplate } from "./templates/VersusTemplate";

export const PreviewPanel = forwardRef<HTMLDivElement, { project: ProjectState; animationNonce?: number }>(function PreviewPanel(
  { project, animationNonce = 0 },
  ref,
) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.4);
  const size = getCanvasSize(project.format, project.resolution);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      setScale(Math.min(1, width / size.width));
    });

    observer.observe(wrap);
    return () => observer.disconnect();
  }, [size.width]);

  return (
    <div className="rounded-lg border border-white/10 bg-black/18 p-3 shadow-2xl">
      <div ref={wrapRef} className="overflow-hidden rounded-md">
        <div style={{ width: size.width * scale, height: size.height * scale }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
            <div ref={ref} style={{ width: size.width, height: size.height }}>
              {project.template === "game-card" ? <GameCardTemplate data={project.data["game-card"]} format={project.format} theme={project.theme} resolution={project.resolution} /> : null}
              {project.template === "pros-cons" ? <ProsConsTemplate data={project.data["pros-cons"]} format={project.format} theme={project.theme} resolution={project.resolution} /> : null}
              {project.template === "score" ? <ScoreTemplate key={animationNonce} data={project.data.score} format={project.format} theme={project.theme} resolution={project.resolution} /> : null}
              {project.template === "ranking" ? <RankingTemplate data={project.data.ranking} format={project.format} theme={project.theme} resolution={project.resolution} /> : null}
              {project.template === "versus" ? <VersusTemplate data={project.data.versus} format={project.format} theme={project.theme} resolution={project.resolution} /> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
