"use client";

import type { FormatType, RankingData, ResolutionType, ThemeType } from "@/lib/types";
import { getBaseCanvasSize, getCanvasSize, getResolutionScale } from "@/lib/types";
import { AutoFitText } from "../AutoFitText";
import { themeClasses } from "./templateStyles";

export function RankingTemplate({ data, format, theme, resolution }: { data: RankingData; format: FormatType; theme: ThemeType; resolution: ResolutionType }) {
  const size = getCanvasSize(format, resolution);
  const baseSize = getBaseCanvasSize(format);
  const scale = getResolutionScale(resolution);
  const t = themeClasses(theme);
  const vertical = format === "vertical";
  const instagram = format === "instagram";
  const items = data.items.slice(0, 10);
  const layoutClass = instagram ? "grid-cols-1" : vertical ? "grid-cols-1" : "grid-cols-2";
  const titleLines = instagram ? 2 : vertical ? 2 : 1;

  return (
    <div style={{ width: size.width, height: size.height }} className={`asset-safe relative overflow-hidden ${t.bg}`}>
      <div style={{ width: baseSize.width, height: baseSize.height, transform: `scale(${scale})`, transformOrigin: "top left" }} className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,.32),transparent_45%,rgba(0,0,0,.22)),radial-gradient(circle_at_12%_18%,rgba(250,204,21,.30),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(34,197,94,.20),transparent_27%)]" />
      <div className={`absolute inset-x-16 top-14 h-2 rounded-full ${t.topLine}`} />
      <div className={`relative flex h-full flex-col ${instagram ? "p-12 pt-16" : "p-20 pt-24"}`}>
        <p className={`mb-5 w-fit rounded-md px-6 py-3 text-3xl font-black uppercase ${t.accent}`}>Ranking Top</p>
        <AutoFitText as="h1" maxSize={instagram ? 76 : vertical ? 96 : 104} minSize={34} lines={titleLines} lineHeight={0.9} className="max-w-[1500px] text-balance font-black drop-shadow-[0_8px_18px_rgba(0,0,0,.35)]">
          {data.title || "Título del ranking"}
        </AutoFitText>
        <div className={`mt-8 grid flex-1 auto-rows-fr gap-4 ${layoutClass}`}>
          {(items.length ? items : [{ position: 1, name: "Juego destacado", comment: "Comentario breve" }]).map((item, index) => (
            <article key={`${item.position}-${item.name}-${index}`} className={`grid grid-cols-[116px_1fr] items-center overflow-hidden rounded-lg border ${t.panel}`}>
              <div className={`relative grid h-full min-h-20 place-items-center overflow-hidden text-5xl font-black shadow-[10px_0_30px_rgba(0,0,0,.18)] ${t.rankingNumber}`}>
                {item.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35 mix-blend-multiply" />
                ) : null}
                <span className="relative z-10 drop-shadow-[0_3px_10px_rgba(0,0,0,.6)]">#{item.position || index + 1}</span>
              </div>
              <div className={`flex min-h-0 min-w-0 flex-col px-7 py-4 ${item.comment ? "justify-center" : "justify-center text-center"}`}>
                <AutoFitText as="h2" maxSize={item.comment ? 42 : 52} minSize={20} lines={item.comment ? 1 : 2} lineHeight={item.comment ? 1 : 0.95} className="font-black">
                  {item.name || "Nombre del juego"}
                </AutoFitText>
                {item.comment ? (
                  <AutoFitText as="p" maxSize={26} minSize={14} lines={2} lineHeight={1.15} className={`mt-2 font-bold ${t.muted}`}>
                    {item.comment}
                  </AutoFitText>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
