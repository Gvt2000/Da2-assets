"use client";

import type { FormatType, RankingData, ResolutionType, ThemeType } from "@/lib/types";
import { getBaseCanvasSize, getCanvasSize, getResolutionScale } from "@/lib/types";
import { AutoFitText } from "../AutoFitText";
import { themeClasses } from "./templateStyles";

type RankingTheme = ReturnType<typeof themeClasses>;
type RankingEntry = RankingData["items"][number];

export function RankingTemplate({ data, format, theme, resolution }: { data: RankingData; format: FormatType; theme: ThemeType; resolution: ResolutionType }) {
  const size = getCanvasSize(format, resolution);
  const baseSize = getBaseCanvasSize(format);
  const scale = getResolutionScale(resolution);
  const t = themeClasses(theme);
  const vertical = format === "vertical";
  const instagram = format === "instagram";
  const displayedItems = (data.items.length ? data.items : [{ position: 1, name: "Juego destacado", comment: "Comentario breve", coverImage: "" }]).slice(0, 10);
  const featuredItems = displayedItems.slice(0, 3);
  const compactItems = displayedItems.slice(3);

  return (
    <div style={{ width: size.width, height: size.height }} className={`asset-safe relative overflow-hidden ${t.bg}`}>
      <div style={{ width: baseSize.width, height: baseSize.height, transform: `scale(${scale})`, transformOrigin: "top left" }} className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,.32),transparent_45%,rgba(0,0,0,.22)),radial-gradient(circle_at_12%_18%,rgba(250,204,21,.30),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(34,197,94,.20),transparent_27%)]" />
        <div className={`absolute ${instagram ? "inset-x-10 top-10" : "inset-x-16 top-14"} h-2 rounded-full ${t.topLine}`} />
        <div className={`relative flex h-full flex-col ${instagram ? "p-10 pt-14" : vertical ? "p-16 pt-20" : "p-16 pt-20"}`}>
          <p className={`mb-4 w-fit rounded-md ${instagram ? "px-5 py-2 text-2xl" : "px-6 py-3 text-3xl"} font-black uppercase ${t.accent}`}>Ranking Top</p>
          <AutoFitText as="h1" maxSize={instagram ? 58 : vertical ? 82 : 86} minSize={28} lines={instagram || vertical ? 2 : 1} lineHeight={0.9} className="max-w-[1500px] text-balance font-black drop-shadow-[0_8px_18px_rgba(0,0,0,.35)]">
            {data.title || "Titulo del ranking"}
          </AutoFitText>

          <div className={`mt-5 grid min-h-0 flex-1 grid-rows-[minmax(0,1.12fr)_minmax(0,.88fr)] ${instagram ? "gap-4" : "gap-5"}`}>
            <div className="grid min-h-0 grid-cols-3 gap-4">
              {featuredItems.map((item, index) => (
                <FeaturedRankingItem key={`${item.position}-${item.name}-${index}`} item={item} index={index} theme={t} instagram={instagram} />
              ))}
            </div>
            <div className={`grid min-h-0 auto-rows-fr gap-3 ${vertical || instagram ? "grid-cols-1" : "grid-cols-2"}`}>
              {compactItems.map((item, index) => (
                <CompactRankingItem key={`${item.position}-${item.name}-${index + 3}`} item={item} index={index + 3} theme={t} instagram={instagram} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturedRankingItem({ item, index, theme, instagram }: { item: RankingEntry; index: number; theme: RankingTheme; instagram: boolean }) {
  return (
    <article className={`grid min-h-0 grid-rows-[minmax(0,1fr)_auto] overflow-hidden rounded-lg border ${theme.panel}`}>
      <div className="relative min-h-0 overflow-hidden bg-black/24">
        {item.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.coverImage} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className={`grid h-full place-items-center text-center ${instagram ? "text-3xl" : "text-4xl"} font-black text-white/55`}>Portada</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/12 to-transparent" />
        <div className={`absolute left-4 top-4 rounded-md px-4 py-2 ${instagram ? "text-3xl" : "text-4xl"} font-black ${theme.rankingNumber}`}>
          #{item.position || index + 1}
        </div>
      </div>
      <div className={`${instagram ? "p-4" : "p-5"} min-w-0`}>
        <AutoFitText as="h2" maxSize={instagram ? 30 : 40} minSize={16} lines={2} lineHeight={0.95} className="text-center font-black">
          {item.name || "Nombre del juego"}
        </AutoFitText>
        {item.comment ? (
          <AutoFitText as="p" maxSize={instagram ? 16 : 21} minSize={11} lines={2} lineHeight={1.12} className={`mt-2 text-center font-bold ${theme.muted}`}>
            {item.comment}
          </AutoFitText>
        ) : null}
      </div>
    </article>
  );
}

function CompactRankingItem({ item, index, theme, instagram }: { item: RankingEntry; index: number; theme: RankingTheme; instagram: boolean }) {
  return (
    <article className={`grid min-h-0 ${instagram ? "grid-cols-[70px_1fr]" : "grid-cols-[86px_1fr]"} items-center overflow-hidden rounded-lg border ${theme.panel}`}>
      <div className={`relative grid h-full min-h-0 place-items-center overflow-hidden ${instagram ? "text-3xl" : "text-4xl"} font-black ${theme.rankingNumber}`}>
        {item.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55 mix-blend-multiply" />
        ) : null}
        <span className="relative z-10 drop-shadow-[0_3px_10px_rgba(0,0,0,.6)]">#{item.position || index + 1}</span>
      </div>
      <div className={`${instagram ? "px-4 py-3" : "px-5 py-3"} min-w-0`}>
        <AutoFitText as="h2" maxSize={instagram ? item.comment ? 25 : 32 : item.comment ? 34 : 42} minSize={15} lines={item.comment ? 1 : 2} lineHeight={item.comment ? 1 : 0.95} className={`font-black ${item.comment ? "" : "text-center"}`}>
          {item.name || "Nombre del juego"}
        </AutoFitText>
        {item.comment ? (
          <AutoFitText as="p" maxSize={instagram ? 16 : 20} minSize={11} lines={1} lineHeight={1.1} className={`mt-1 font-bold ${theme.muted}`}>
            {item.comment}
          </AutoFitText>
        ) : null}
      </div>
    </article>
  );
}
