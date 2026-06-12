"use client";

import { Clock, Gauge, MessageCircle } from "lucide-react";
import type { FormatType, ResolutionType, ThemeType, VersusData } from "@/lib/types";
import { getBaseCanvasSize, getCanvasSize, getResolutionScale } from "@/lib/types";
import { themeClasses } from "./templateStyles";

export function VersusTemplate({ data, format, theme, resolution }: { data: VersusData; format: FormatType; theme: ThemeType; resolution: ResolutionType }) {
  const size = getCanvasSize(format, resolution);
  const baseSize = getBaseCanvasSize(format);
  const scale = getResolutionScale(resolution);
  const t = themeClasses(theme);
  const vertical = format === "vertical";

  return (
    <div style={{ width: size.width, height: size.height }} className={`asset-safe relative overflow-hidden ${t.bg}`}>
      <div style={{ width: baseSize.width, height: baseSize.height, transform: `scale(${scale})`, transformOrigin: "top left" }} className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,184,166,.16),transparent_48%,rgba(249,115,22,.18)),radial-gradient(circle_at_18%_24%,rgba(45,212,191,.26),transparent_30%),radial-gradient(circle_at_82%_28%,rgba(249,115,22,.28),transparent_30%)]" />
      <div className="relative flex h-full flex-col p-16">
        <p className={`mx-auto mb-6 w-fit rounded-md px-6 py-3 text-3xl font-black uppercase ${t.accent}`}>Versus</p>
        <div className={`grid flex-1 items-stretch gap-7 ${vertical ? "grid-rows-[1fr_auto_1fr]" : "grid-cols-[1fr_150px_1fr]"}`}>
          <Side title={data.gameA || "Juego A"} accentClass={t.versusA} rows={[
            ["Duración", data.durationA || "45 min", Clock],
            ["Dificultad", `${data.difficultyA}/5`, Gauge],
            ["Interacción", `${data.interactionA}/10`, MessageCircle],
            ["Mejor para", data.bestForA || "Perfil ideal", null],
          ]} panel={t.panel} muted={t.muted} />
          <div className="grid place-items-center">
            <div className={`grid size-32 place-items-center rounded-full border-4 bg-black/36 text-6xl font-black shadow-[0_0_70px_rgba(249,115,22,.28)] ${t.versusCircle}`}>
              VS
            </div>
          </div>
          <Side title={data.gameB || "Juego B"} accentClass={t.versusB} rows={[
            ["Duración", data.durationB || "35 min", Clock],
            ["Dificultad", `${data.difficultyB}/5`, Gauge],
            ["Interacción", `${data.interactionB}/10`, MessageCircle],
            ["Mejor para", data.bestForB || "Perfil ideal", null],
          ]} panel={t.panel} muted={t.muted} />
        </div>
        <div className={`mt-6 rounded-lg border p-6 text-center ${t.panel}`}>
          <p className={`text-3xl font-black uppercase ${t.muted}`}>Ganador / conclusión</p>
          <p className="mt-2 text-5xl font-black leading-tight text-pretty">{data.winner || "Una conclusión clara para cerrar la comparativa."}</p>
        </div>
      </div>
      </div>
    </div>
  );
}

function Side({
  title,
  rows,
  accentClass,
  panel,
  muted,
}: {
  title: string;
  rows: Array<[string, string, React.ComponentType<{ className?: string }> | null]>;
  accentClass: string;
  panel: string;
  muted: string;
}) {
  return (
    <section className={`overflow-hidden rounded-lg border ${panel}`}>
      <div className={`bg-gradient-to-r ${accentClass} px-8 py-7`}>
        <h1 className="text-balance text-6xl font-black leading-[0.9]">{title}</h1>
      </div>
      <div className="space-y-4 p-6">
        {rows.map(([label, value, Icon]) => (
          <div key={label} className="rounded-md bg-black/22 p-5">
            <div className={`mb-2 flex items-center gap-3 text-2xl font-black uppercase ${muted}`}>
              {Icon ? <Icon className="size-8" /> : null}
              {label}
            </div>
            <p className="text-pretty text-[34px] font-black leading-tight">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
