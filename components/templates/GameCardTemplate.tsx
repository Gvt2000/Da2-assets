"use client";

import { Calendar, Clock, Sparkles, Users } from "lucide-react";
import type { FormatType, GameCardData, ResolutionType, ThemeType } from "@/lib/types";
import { getBaseCanvasSize, getCanvasSize, getResolutionScale } from "@/lib/types";
import { AutoFitText } from "../AutoFitText";
import { themeClasses } from "./templateStyles";

export function GameCardTemplate({
  data,
  format,
  theme,
  resolution,
}: {
  data: GameCardData;
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
  const stacked = vertical || instagram;

  return (
    <div style={{ width: size.width, height: size.height }} className={`asset-safe relative overflow-hidden ${t.bg}`}>
      <div style={{ width: baseSize.width, height: baseSize.height, transform: `scale(${scale})`, transformOrigin: "top left" }} className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(0,0,0,.34),transparent_48%,rgba(0,0,0,.22)),radial-gradient(circle_at_18%_16%,rgba(249,115,22,.32),transparent_30%),radial-gradient(circle_at_86%_22%,rgba(45,212,191,.22),transparent_28%)]" />
      <div className={`absolute inset-x-16 top-14 h-2 rounded-full ${t.topLine}`} />
      <div className={`relative grid h-full ${instagram ? "gap-8 p-12 pt-16" : "gap-14 p-20 pt-24"} ${stacked ? "grid-rows-[auto_1fr]" : "grid-cols-[1fr_820px]"}`}>
        <section className="flex min-h-0 flex-col justify-between">
          <div>
            <p className={`mb-7 inline-flex rounded-md px-6 py-3 text-3xl font-black uppercase ${t.accent}`}>Ficha técnica</p>
            <AutoFitText as="h1" maxSize={instagram ? 74 : vertical ? 96 : 126} minSize={34} lines={instagram ? 2 : 3} lineHeight={0.9} className="max-w-[1000px] text-balance font-black drop-shadow-[0_8px_18px_rgba(0,0,0,.35)]">
              {data.gameName || "Nombre del juego"}
            </AutoFitText>
            <AutoFitText as="p" maxSize={instagram ? 30 : 36} minSize={18} lines={1} lineHeight={1.15} className={`mt-6 font-bold ${t.muted}`}>
              {data.publisher || "Editorial"} · {data.year || "Año"}
            </AutoFitText>
          </div>

          <div className="space-y-5">
            <div className={`grid gap-5 ${stacked ? "grid-cols-3" : "grid-cols-3"}`}>
              <Info icon={Users} label="Jugadores" value={data.players || "2-4"} iconClass={t.icon} compact={instagram} />
              <Info icon={Clock} label="Duración" value={data.duration || "45 min"} iconClass={t.icon} />
              <Info icon={Calendar} label="Edad" value={data.age || "10+"} iconClass={t.icon} compact={instagram} />
            </div>
            <Info icon={Sparkles} label="Tipo / categorías" value={data.categories || "Familiar"} iconClass={t.icon} wide />
          </div>

          <div className={`rounded-lg border ${instagram ? "p-5" : "p-7"} ${t.panel}`}>
            <div className="mb-5 flex items-center justify-between">
              <span className="text-3xl font-black uppercase text-white/90">Dificultad</span>
              <span className="rounded-md bg-black/25 px-5 py-2 text-4xl font-black">{data.difficulty}/5</span>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <DifficultySegment key={index} value={Math.max(0, Math.min(1, data.difficulty - index))} emptyClass={t.line} fillClass={t.difficultyFill} />
              ))}
            </div>
          </div>
        </section>

        <section className={`flex min-h-0 flex-col ${instagram ? "gap-5" : "gap-8"}`}>
          <div className={`relative min-h-0 flex-1 overflow-hidden rounded-lg border-2 ${t.panel}`}>
            {data.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.coverImage} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full place-items-center bg-[linear-gradient(145deg,rgba(20,184,166,.22),rgba(249,115,22,.18))] p-12 text-center">
                <div>
                  <div className={`mx-auto mb-8 grid size-56 place-items-center rounded-lg border border-white/20 bg-black/24 text-9xl font-black ${t.placeholderMark}`}>M</div>
                  <p className={`text-5xl font-black ${t.muted}`}>Portada del juego</p>
                </div>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/55 to-transparent" />
          </div>
          <div className={`rounded-lg border ${instagram ? "p-6" : "p-8"} ${t.panel}`}>
            <p className={`text-3xl font-black uppercase ${t.muted}`}>¿Para quién es el juego?</p>
            <AutoFitText as="p" maxSize={instagram ? 36 : 48} minSize={20} lines={instagram ? 2 : 3} lineHeight={1.2} className="mt-3 font-black text-pretty">
              {data.verdict || "Un cierre memorable para la reseña."}
            </AutoFitText>
          </div>
        </section>
      </div>
      </div>
    </div>
  );
}

function DifficultySegment({ value, emptyClass, fillClass }: { value: number; emptyClass: string; fillClass: string }) {
  const fill = value >= 1 ? "100%" : value >= 0.5 ? "50%" : "0%";

  return (
    <div className={`h-9 overflow-hidden rounded-full ${emptyClass}`}>
      <div className={`h-full rounded-full ${fillClass}`} style={{ width: fill }} />
    </div>
  );
}

function Info({
  icon: Icon,
  label,
  value,
  iconClass,
  wide = false,
  compact = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  iconClass: string;
  wide?: boolean;
  compact?: boolean;
}) {
  return (
    <div className={`${compact ? wide ? "min-h-24" : "min-h-28" : wide ? "min-h-32" : "min-h-40"} rounded-lg border border-white/12 bg-black/28 ${compact ? "p-4" : "p-5"} shadow-[0_18px_44px_rgba(0,0,0,.24)]`}>
      <Icon className={`${compact ? "mb-2 size-8" : "mb-4 size-10"} ${iconClass}`} />
      <p className={`${compact ? "text-xl" : "text-2xl"} font-bold uppercase text-zinc-300/90`}>{label}</p>
      <AutoFitText as="p" maxSize={compact ? wide ? 24 : 22 : wide ? 30 : 26} minSize={14} lines={wide ? 2 : 3} lineHeight={1.16} className="mt-1 break-words font-black">
        {value}
      </AutoFitText>
    </div>
  );
}
