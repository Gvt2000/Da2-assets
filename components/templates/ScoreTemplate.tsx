"use client";

import type { FormatType, ResolutionType, ScoreData, ThemeType } from "@/lib/types";
import { getBaseCanvasSize, getCanvasSize, getResolutionScale } from "@/lib/types";
import { AutoFitText } from "../AutoFitText";
import { clampScore, themeClasses } from "./templateStyles";

export function ScoreTemplate({
  data,
  format,
  theme,
  resolution,
}: {
  data: ScoreData;
  format: FormatType;
  theme: ThemeType;
  resolution: ResolutionType;
}) {
  const size = getCanvasSize(format, resolution);
  const baseSize = getBaseCanvasSize(format);
  const scale = getResolutionScale(resolution);
  const t = themeClasses(theme);
  const vertical = format === "vertical";
  const instagram = format === "instagram";
  const lowerThird = data.layout === "lower-third";
  const finalScore = clampScore(data.finalScore);
  const duration = Math.max(0.3, Math.min(8, data.animationDuration || 1.6));
  const criteria = data.criteria.length ? data.criteria.slice(0, lowerThird ? data.criteria.length : 8) : [{ id: "empty", name: "Criterio", value: 7 }];

  return (
    <div
      style={{ width: size.width, height: size.height, "--score-animation-duration": `${duration}s` } as React.CSSProperties}
      className={`asset-safe score-template relative overflow-hidden ${t.bg}`}
    >
      <div style={{ width: baseSize.width, height: baseSize.height, transform: `scale(${scale})`, transformOrigin: "top left" }} className="relative overflow-hidden">
        <style jsx global>{`
          .score-template .score-fill {
            transform: scaleX(0);
            transform-origin: left center;
            animation: score-fill var(--score-animation-duration, 1.6s) cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          .score-template .score-pop,
          .score-template .score-label {
            opacity: 0;
            transform: translateY(18px) scale(0.98);
            animation: score-pop 500ms ease-out forwards;
            animation-delay: calc(var(--score-animation-duration, 1.6s) + 140ms);
          }

          .score-template .score-label {
            animation-delay: calc(var(--score-animation-duration, 1.6s) + 260ms);
          }

          .asset-exporting .score-fill,
          .asset-recording .score-fill {
            animation: none;
          }

          .asset-exporting .score-fill {
            transform: scaleX(1);
          }

          .asset-recording .score-fill {
            transform: scaleX(var(--score-progress, 0));
          }

          .asset-exporting .score-pop,
          .asset-exporting .score-label,
          .asset-recording .score-pop,
          .asset-recording .score-label {
            animation: none;
            opacity: var(--score-reveal, 1);
            transform: translateY(calc((1 - var(--score-reveal, 1)) * 18px)) scale(calc(0.98 + (var(--score-reveal, 1) * 0.02)));
          }

          @keyframes score-fill {
            from {
              transform: scaleX(0);
            }

            to {
              transform: scaleX(1);
            }
          }

          @keyframes score-pop {
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}</style>
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,.3),transparent_42%,rgba(0,0,0,.25)),radial-gradient(circle_at_24%_18%,rgba(249,115,22,.30),transparent_30%),radial-gradient(circle_at_84%_80%,rgba(45,212,191,.20),transparent_32%)]" />
        {lowerThird ? (
          <LowerThirdScore data={data} criteria={criteria} finalScore={finalScore} theme={t} />
        ) : (
          <FullScore data={data} criteria={criteria} finalScore={finalScore} theme={t} vertical={vertical} instagram={instagram} />
        )}
      </div>
    </div>
  );
}

function FullScore({
  data,
  criteria,
  finalScore,
  theme,
  vertical,
  instagram,
}: {
  data: ScoreData;
  criteria: ScoreData["criteria"];
  finalScore: number;
  theme: ReturnType<typeof themeClasses>;
  vertical: boolean;
  instagram: boolean;
}) {
  return (
    <div className={`relative grid h-full ${instagram ? "gap-6 p-10" : "gap-10 p-16"} ${vertical || instagram ? "grid-rows-[auto_1fr]" : "grid-cols-[1.16fr_.84fr]"}`}>
      <section className="flex min-h-0 flex-col">
        <p className={`mb-5 w-fit rounded-md px-6 py-3 text-3xl font-black uppercase ${theme.accent}`}>Puntuación final</p>
        <AutoFitText as="h1" maxSize={instagram ? 70 : vertical ? 96 : 96} minSize={34} lines={instagram ? 2 : 3} lineHeight={0.9} className="max-w-[1040px] text-balance font-black drop-shadow-[0_8px_18px_rgba(0,0,0,.35)]">
          {data.gameName || "Nombre del juego"}
        </AutoFitText>
        <div className={`${instagram ? "mt-6 space-y-3" : "mt-8 space-y-4"} flex-1`}>
          {criteria.map((criterion, index) => (
            <ScoreBar key={criterion.id} delay={barDelay(data, index)} label={criterion.name} value={clampScore(criterion.value)} fillClass={theme.scoreFill} />
          ))}
        </div>
      </section>
      <aside className={`relative overflow-hidden rounded-lg border ${instagram ? "p-6" : "p-8"} ${theme.panel}`}>
        <div className={`absolute inset-x-0 top-0 h-5 ${theme.scoreTopLine}`} />
        <div className={`flex h-full ${instagram ? "flex-row items-center gap-8 pt-4" : "flex-col justify-between pt-8"}`}>
          <div>
            <p className={`text-4xl font-black uppercase ${theme.muted}`}>Nota final</p>
            <div className={`score-pop mt-6 grid aspect-square place-items-center rounded-full ${instagram ? "w-56 border-[10px]" : "border-[14px]"} bg-black/24 shadow-[inset_0_0_80px_rgba(249,115,22,.16)] ${theme.scoreBorder}`}>
              <p className={`${instagram ? "text-[96px]" : "text-[176px]"} font-black leading-none`}>{finalScore.toFixed(1)}</p>
            </div>
          </div>
          <div className={instagram ? "min-w-0 flex-1" : ""}>
            <p className={`mb-5 h-3 rounded-full ${theme.line}`} />
            <AutoFitText as="p" maxSize={instagram ? 44 : 60} minSize={22} lines={instagram ? 2 : 3} lineHeight={0.95} className="score-label font-black text-pretty">
              {data.finalLabel || "Etiqueta final"}
            </AutoFitText>
          </div>
        </div>
      </aside>
    </div>
  );
}

function LowerThirdScore({
  data,
  criteria,
  finalScore,
  theme,
}: {
  data: ScoreData;
  criteria: ScoreData["criteria"];
  finalScore: number;
  theme: ReturnType<typeof themeClasses>;
}) {
  const columnCount = Math.max(1, Math.ceil(criteria.length / 2));

  return (
    <div className="absolute inset-x-12 bottom-10 grid h-[320px] grid-cols-[430px_minmax(0,1fr)_260px] items-center gap-8 rounded-lg border border-white/15 bg-black/62 p-8 shadow-[0_-28px_90px_rgba(0,0,0,.42)] backdrop-blur-sm">
      <div className="min-w-0">
        <p className={`mb-3 w-fit rounded-md px-4 py-2 text-2xl font-black uppercase ${theme.accent}`}>Puntuación</p>
        <AutoFitText as="h1" maxSize={54} minSize={24} lines={2} lineHeight={0.92} className="font-black">
          {data.gameName || "Nombre del juego"}
        </AutoFitText>
        <AutoFitText as="p" maxSize={30} minSize={16} lines={2} lineHeight={1.2} className={`score-label mt-4 font-black ${theme.muted}`}>
          {data.finalLabel || "Etiqueta final"}
        </AutoFitText>
      </div>
      <div className="grid min-w-0 grid-rows-2 gap-4" style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}>
        {criteria.map((criterion, index) => (
          <CompactScoreBar key={criterion.id} delay={barDelay(data, index)} label={criterion.name} value={clampScore(criterion.value)} fillClass={theme.scoreFill} />
        ))}
      </div>
      <div className={`score-pop grid h-[220px] w-[220px] place-self-center place-items-center rounded-lg border-[10px] bg-black/24 ${theme.panel} ${theme.scoreBorder}`}>
        <div className="text-center">
          <p className={`text-2xl font-black uppercase ${theme.muted}`}>Nota</p>
          <p className="text-[78px] font-black leading-none">{finalScore.toFixed(1)}</p>
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ label, value, delay, fillClass }: { label: string; value: number; delay: number; fillClass: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-4">
      <div className="mb-3 flex items-end justify-between gap-8">
        <AutoFitText maxSize={30} minSize={16} lines={1} lineHeight={1} className="font-black">
          {label}
        </AutoFitText>
        <span className="rounded-md bg-white/12 px-4 py-2 text-4xl font-black leading-none">{value}/10</span>
      </div>
      <div className="h-8 overflow-hidden rounded-full bg-white/12">
        <div className={`score-fill h-full rounded-full shadow-[0_0_32px_rgba(250,204,21,.32)] ${fillClass}`} style={{ width: `${value * 10}%`, animationDelay: `${delay}s` }} />
      </div>
    </div>
  );
}

function CompactScoreBar({ label, value, delay, fillClass }: { label: string; value: number; delay: number; fillClass: string }) {
  return (
    <div className="min-w-0 rounded-md border border-white/10 bg-black/22 p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <AutoFitText maxSize={20} minSize={12} lines={1} lineHeight={1} className="font-black">
          {label}
        </AutoFitText>
        <span className="text-2xl font-black">{value}/10</span>
      </div>
      <div className="h-6 overflow-hidden rounded-full bg-white/12">
        <div className={`score-fill h-full rounded-full ${fillClass}`} style={{ width: `${value * 10}%`, animationDelay: `${delay}s` }} />
      </div>
    </div>
  );
}

function barDelay(data: ScoreData, index: number) {
  return data.animationMode === "sequential" ? index * Math.max(0.12, data.animationDuration / Math.max(1, data.criteria.length) * 0.45) : 0;
}
