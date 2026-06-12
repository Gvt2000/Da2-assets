"use client";

import { Minus, Plus } from "lucide-react";
import type { FormatType, ProsConsData, ResolutionType, ThemeType } from "@/lib/types";
import { getBaseCanvasSize, getCanvasSize, getResolutionScale } from "@/lib/types";
import { themeClasses } from "./templateStyles";

export function ProsConsTemplate({ data, format, theme, resolution }: { data: ProsConsData; format: FormatType; theme: ThemeType; resolution: ResolutionType }) {
  const size = getCanvasSize(format, resolution);
  const baseSize = getBaseCanvasSize(format);
  const scale = getResolutionScale(resolution);
  const t = themeClasses(theme);
  const vertical = format === "vertical";

  return (
    <div style={{ width: size.width, height: size.height }} className={`asset-safe relative overflow-hidden ${t.bg}`}>
      <div style={{ width: baseSize.width, height: baseSize.height, transform: `scale(${scale})`, transformOrigin: "top left" }} className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,185,129,.12),transparent_48%,rgba(244,63,94,.12)),radial-gradient(circle_at_20%_12%,rgba(34,197,94,.28),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(248,113,113,.24),transparent_28%)]" />
      <div className="relative flex h-full flex-col p-20">
        <div className="mb-10 flex items-end justify-between gap-8">
          <div>
            <p className={`mb-6 w-fit rounded-md px-6 py-3 text-3xl font-black uppercase ${t.accent}`}>Pros y contras</p>
            <h1 className={`${vertical ? "text-8xl" : "text-[116px]"} max-w-[1320px] text-balance font-black leading-[0.9] drop-shadow-[0_8px_18px_rgba(0,0,0,.35)]`}>
              {data.gameName || "Nombre del juego"}
            </h1>
          </div>
        </div>
        <div className={`grid flex-1 gap-8 ${vertical ? "grid-rows-2" : "grid-cols-2"}`}>
          <Column title="Lo mejor" items={data.pros} icon={Plus} tone="good" panel={t.panel} muted={t.muted} headerClass={t.prosHeader} badgeClass={t.prosBadge} />
          <Column title="Lo peor" items={data.cons} icon={Minus} tone="bad" panel={t.panel} muted={t.muted} headerClass={t.consHeader} badgeClass={t.consBadge} />
        </div>
        <div className={`mt-8 rounded-lg border p-8 ${t.panel}`}>
          <p className={`text-3xl font-black uppercase ${t.muted}`}>Veredicto</p>
          <p className="mt-2 text-5xl font-black leading-tight text-pretty">{data.verdict || "Una conclusión breve y contundente."}</p>
        </div>
      </div>
      </div>
    </div>
  );
}

function Column({
  title,
  items,
  icon: Icon,
  tone,
  panel,
  muted,
  headerClass,
  badgeClass,
}: {
  title: string;
  items: string[];
  icon: React.ComponentType<{ className?: string }>;
  tone: "good" | "bad";
  panel: string;
  muted: string;
  headerClass: string;
  badgeClass: string;
}) {
  return (
    <section className={`overflow-hidden rounded-lg border ${panel}`}>
      <div className={`flex items-center gap-5 px-8 py-7 ${headerClass}`}>
        <span className="grid size-16 place-items-center rounded-md bg-black/16">
          <Icon className="size-10" />
        </span>
        <h2 className="text-6xl font-black">{title}</h2>
      </div>
      <div className="space-y-5 p-8">
        {(items.length ? items : ["Añade un punto clave"]).slice(0, 5).map((item, index) => (
          <div key={`${item}-${index}`} className="grid grid-cols-[72px_1fr] items-center gap-5 rounded-md bg-black/20 p-5">
            <span className={`grid size-16 place-items-center rounded-md text-3xl font-black ${badgeClass}`}>
              {index + 1}
            </span>
            <span className="text-4xl font-black leading-tight text-pretty">{item}</span>
          </div>
        ))}
        <p className={`pt-1 text-2xl font-bold uppercase ${muted}`}>{tone === "good" ? "Fortalezas claras" : "Puntos a vigilar"}</p>
      </div>
    </section>
  );
}
