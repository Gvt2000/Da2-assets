"use client";

import { Clock, Gauge, MessageCircle } from "lucide-react";
import type { FormatType, ResolutionType, ThemeType, VersusData } from "@/lib/types";
import { getBaseCanvasSize, getCanvasSize, getResolutionScale } from "@/lib/types";
import { AutoFitText } from "../AutoFitText";
import { themeClasses } from "./templateStyles";

export function VersusTemplate({ data, format, theme, resolution }: { data: VersusData; format: FormatType; theme: ThemeType; resolution: ResolutionType }) {
  const size = getCanvasSize(format, resolution);
  const baseSize = getBaseCanvasSize(format);
  const scale = getResolutionScale(resolution);
  const t = themeClasses(theme);
  const vertical = format === "vertical";
  const instagram = format === "instagram";
  const horizontal = format === "horizontal";
  const shellPadding = instagram ? "p-10" : vertical ? "p-14" : "p-12";
  const sideGrid = horizontal ? "grid-cols-[1fr_104px_1fr]" : "grid-rows-[1fr_auto_1fr]";

  return (
    <div style={{ width: size.width, height: size.height }} className={`asset-safe relative overflow-hidden ${t.bg}`}>
      <div style={{ width: baseSize.width, height: baseSize.height, transform: `scale(${scale})`, transformOrigin: "top left" }} className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,184,166,.16),transparent_48%,rgba(249,115,22,.18)),radial-gradient(circle_at_18%_24%,rgba(45,212,191,.26),transparent_30%),radial-gradient(circle_at_82%_28%,rgba(249,115,22,.28),transparent_30%)]" />
        <div className={`relative flex h-full flex-col ${shellPadding}`}>
          <p className={`mx-auto mb-4 w-fit rounded-md px-6 py-3 ${instagram ? "text-2xl" : "text-3xl"} font-black uppercase ${t.accent}`}>Versus</p>
          <div className={`grid min-h-0 flex-1 items-stretch gap-4 ${sideGrid}`}>
            <Side
              title={data.gameA || "Juego A"}
              accentClass={t.versusA}
              rows={[
                ["Duracion", data.durationA || "45 min", Clock],
                ["Dificultad", `${data.difficultyA}/5`, Gauge],
                ["Interaccion", `${data.interactionA}/10`, MessageCircle],
                ["Mejor para", data.bestForA || "Perfil ideal", null],
              ]}
              panel={t.panel}
              muted={t.muted}
              coverImage={data.coverImageA ?? ""}
              compact={instagram}
              horizontal={horizontal}
            />
            <div className="grid place-items-center">
              <div className={`grid ${instagram ? "size-20 text-4xl" : vertical ? "size-24 text-5xl" : "size-24 text-5xl"} place-items-center rounded-full border-4 bg-black/36 font-black shadow-[0_0_70px_rgba(249,115,22,.28)] ${t.versusCircle}`}>
                VS
              </div>
            </div>
            <Side
              title={data.gameB || "Juego B"}
              accentClass={t.versusB}
              rows={[
                ["Duracion", data.durationB || "35 min", Clock],
                ["Dificultad", `${data.difficultyB}/5`, Gauge],
                ["Interaccion", `${data.interactionB}/10`, MessageCircle],
                ["Mejor para", data.bestForB || "Perfil ideal", null],
              ]}
              panel={t.panel}
              muted={t.muted}
              coverImage={data.coverImageB ?? ""}
              compact={instagram}
              horizontal={horizontal}
            />
          </div>
          <div className={`mt-4 rounded-lg border ${instagram ? "p-4" : "p-5"} text-center ${t.panel}`}>
            <AutoFitText as="p" maxSize={instagram ? 22 : 26} minSize={14} lines={1} lineHeight={1.1} className={`font-black uppercase ${t.muted}`}>
              {data.conclusionLabel || "Ganador / conclusion"}
            </AutoFitText>
            <AutoFitText as="p" maxSize={instagram ? 32 : 38} minSize={18} lines={2} lineHeight={1.15} className="mt-2 font-black text-pretty">
              {data.winner || "Una conclusion clara para cerrar la comparativa."}
            </AutoFitText>
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
  coverImage,
  compact = false,
  horizontal = false,
}: {
  title: string;
  rows: Array<[string, string, React.ComponentType<{ className?: string }> | null]>;
  accentClass: string;
  panel: string;
  muted: string;
  coverImage: string;
  compact?: boolean;
  horizontal?: boolean;
}) {
  const splitBody = horizontal || compact;

  return (
    <section className={`grid min-h-0 grid-rows-[auto_1fr] overflow-hidden rounded-lg border ${panel}`}>
      <div className={`bg-gradient-to-r ${accentClass} ${compact ? "px-5 py-4" : "px-6 py-5"}`}>
        <AutoFitText as="h1" maxSize={compact ? 36 : horizontal ? 44 : 52} minSize={18} lines={2} lineHeight={0.9} className="text-balance font-black">
          {title}
        </AutoFitText>
      </div>
      <div className={`grid min-h-0 ${splitBody ? "grid-cols-[minmax(150px,34%)_1fr]" : "grid-rows-[minmax(220px,42%)_1fr]"} ${compact ? "gap-3 p-4" : "gap-4 p-5"}`}>
        <div className="relative min-h-0 overflow-hidden rounded-md bg-black/24">
          {coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverImage} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className={`${compact ? "text-2xl" : "text-3xl"} grid h-full place-items-center text-center font-black text-white/55`}>Portada</div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
        <div className={`grid min-h-0 ${splitBody ? "grid-cols-2" : "grid-cols-2"} gap-3`}>
          {rows.map(([label, value, Icon]) => (
            <div key={label} className={`min-w-0 rounded-md bg-black/22 ${compact ? "p-3" : "p-4"}`}>
              <div className={`mb-2 flex items-center gap-2 font-black uppercase ${compact ? "text-base" : "text-xl"} ${muted}`}>
                {Icon ? <Icon className={compact ? "size-5" : "size-6"} /> : null}
                {label}
              </div>
              <AutoFitText as="p" maxSize={compact ? 22 : horizontal ? 26 : 30} minSize={12} lines={2} lineHeight={1.12} className="text-pretty font-black">
                {value}
              </AutoFitText>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
