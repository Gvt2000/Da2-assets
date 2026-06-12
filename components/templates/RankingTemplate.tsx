"use client";

import type { FormatType, RankingData, ResolutionType, ThemeType } from "@/lib/types";
import { getBaseCanvasSize, getCanvasSize, getResolutionScale } from "@/lib/types";
import { themeClasses } from "./templateStyles";

export function RankingTemplate({ data, format, theme, resolution }: { data: RankingData; format: FormatType; theme: ThemeType; resolution: ResolutionType }) {
  const size = getCanvasSize(format, resolution);
  const baseSize = getBaseCanvasSize(format);
  const scale = getResolutionScale(resolution);
  const t = themeClasses(theme);
  const vertical = format === "vertical";
  const items = data.items.slice(0, 10);

  return (
    <div style={{ width: size.width, height: size.height }} className={`asset-safe relative overflow-hidden ${t.bg}`}>
      <div style={{ width: baseSize.width, height: baseSize.height, transform: `scale(${scale})`, transformOrigin: "top left" }} className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,.32),transparent_45%,rgba(0,0,0,.22)),radial-gradient(circle_at_12%_18%,rgba(250,204,21,.30),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(34,197,94,.20),transparent_27%)]" />
      <div className={`absolute inset-x-16 top-14 h-2 rounded-full ${t.topLine}`} />
      <div className="relative flex h-full flex-col p-20 pt-24">
        <p className={`mb-6 w-fit rounded-md px-6 py-3 text-3xl font-black uppercase ${t.accent}`}>Ranking Top</p>
        <h1 className={`${vertical ? "text-8xl" : "text-[112px]"} max-w-[1500px] text-balance font-black leading-[0.9] drop-shadow-[0_8px_18px_rgba(0,0,0,.35)]`}>
          {data.title || "Título del ranking"}
        </h1>
        <div className={`mt-12 grid flex-1 gap-5 ${vertical ? "grid-cols-1" : "grid-cols-2"}`}>
          {(items.length ? items : [{ position: 1, name: "Juego destacado", comment: "Comentario breve" }]).map((item, index) => (
            <article key={`${item.position}-${item.name}-${index}`} className={`grid grid-cols-[116px_1fr] items-center overflow-hidden rounded-lg border ${t.panel}`}>
              <div className={`grid h-full min-h-28 place-items-center text-5xl font-black shadow-[10px_0_30px_rgba(0,0,0,.18)] ${t.rankingNumber}`}>
                #{item.position || index + 1}
              </div>
              <div className="min-w-0 px-7 py-5">
                <h2 className="truncate text-5xl font-black leading-none">{item.name || "Nombre del juego"}</h2>
                <p className={`mt-3 line-clamp-2 text-3xl font-bold leading-tight ${t.muted}`}>{item.comment || "Comentario corto"}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
