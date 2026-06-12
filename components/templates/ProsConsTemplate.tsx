"use client";

import { Minus, Plus } from "lucide-react";
import type { FormatType, ProsConsData, ResolutionType, ThemeType } from "@/lib/types";
import { getBaseCanvasSize, getCanvasSize, getResolutionScale } from "@/lib/types";
import { AutoFitText } from "../AutoFitText";
import { themeClasses } from "./templateStyles";

export function ProsConsTemplate({ data, format, theme, resolution }: { data: ProsConsData; format: FormatType; theme: ThemeType; resolution: ResolutionType }) {
  const size = getCanvasSize(format, resolution);
  const baseSize = getBaseCanvasSize(format);
  const scale = getResolutionScale(resolution);
  const t = themeClasses(theme);
  const vertical = format === "vertical";
  const instagram = format === "instagram";

  return (
    <div style={{ width: size.width, height: size.height }} className={`asset-safe relative overflow-hidden ${t.bg}`}>
      <div style={{ width: baseSize.width, height: baseSize.height, transform: `scale(${scale})`, transformOrigin: "top left" }} className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,185,129,.12),transparent_48%,rgba(244,63,94,.12)),radial-gradient(circle_at_20%_12%,rgba(34,197,94,.28),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(248,113,113,.24),transparent_28%)]" />
      <div className={`relative flex h-full flex-col ${instagram ? "p-12" : "p-20"}`}>
        <div className={`mb-8 grid gap-8 ${instagram ? "grid-cols-[1fr_330px] items-stretch" : "grid-cols-[1fr_420px] items-end"}`}>
          <div className="min-w-0">
            <p className={`mb-6 w-fit rounded-md px-6 py-3 text-3xl font-black uppercase ${t.accent}`}>Pros y contras</p>
            <AutoFitText as="h1" maxSize={instagram ? 74 : vertical ? 92 : 108} minSize={34} lines={instagram ? 3 : 2} lineHeight={0.9} className="max-w-[1320px] text-balance font-black drop-shadow-[0_8px_18px_rgba(0,0,0,.35)]">
              {data.gameName || "Nombre del juego"}
            </AutoFitText>
          </div>
          <CoverPanel image={data.coverImage} placeholder="Portada" panel={t.panel} markClass={t.placeholderMark} />
        </div>
        <div className={`grid flex-1 gap-6 ${vertical || instagram ? "grid-rows-2" : "grid-cols-2"}`}>
          <Column title="Lo mejor" items={data.pros} icon={Plus} tone="good" panel={t.panel} muted={t.muted} headerClass={t.prosHeader} badgeClass={t.prosBadge} compact={instagram} />
          <Column title="Lo peor" items={data.cons} icon={Minus} tone="bad" panel={t.panel} muted={t.muted} headerClass={t.consHeader} badgeClass={t.consBadge} compact={instagram} />
        </div>
        <div className={`mt-6 rounded-lg border ${instagram ? "p-6" : "p-8"} ${t.panel}`}>
          <p className={`text-3xl font-black uppercase ${t.muted}`}>Veredicto</p>
          <AutoFitText as="p" maxSize={instagram ? 38 : 48} minSize={20} lines={instagram ? 2 : 3} lineHeight={1.18} className="mt-2 font-black text-pretty">
            {data.verdict || "Una conclusión breve y contundente."}
          </AutoFitText>
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
  compact = false,
}: {
  title: string;
  items: string[];
  icon: React.ComponentType<{ className?: string }>;
  tone: "good" | "bad";
  panel: string;
  muted: string;
  headerClass: string;
  badgeClass: string;
  compact?: boolean;
}) {
  return (
    <section className={`overflow-hidden rounded-lg border ${panel}`}>
      <div className={`flex items-center gap-5 ${compact ? "px-6 py-5" : "px-8 py-7"} ${headerClass}`}>
        <span className={`grid ${compact ? "size-13" : "size-16"} place-items-center rounded-md bg-black/16`}>
          <Icon className={compact ? "size-8" : "size-10"} />
        </span>
        <h2 className={`${compact ? "text-5xl" : "text-6xl"} font-black`}>{title}</h2>
      </div>
      <div className={`${compact ? "space-y-3 p-5" : "space-y-5 p-8"}`}>
        {(items.length ? items : ["Añade un punto clave"]).slice(0, 5).map((item, index) => (
          <div key={`${item}-${index}`} className={`grid items-center rounded-md bg-black/20 ${compact ? "grid-cols-[56px_1fr] gap-4 p-4" : "grid-cols-[72px_1fr] gap-5 p-5"}`}>
            <span className={`grid place-items-center rounded-md font-black ${compact ? "size-12 text-2xl" : "size-16 text-3xl"} ${badgeClass}`}>
              {index + 1}
            </span>
            <AutoFitText maxSize={compact ? 30 : 36} minSize={16} lines={2} lineHeight={1.15} className="font-black text-pretty">
              {item}
            </AutoFitText>
          </div>
        ))}
        <p className={`pt-1 text-2xl font-bold uppercase ${muted}`}>{tone === "good" ? "Fortalezas claras" : "Puntos a vigilar"}</p>
      </div>
    </section>
  );
}

function CoverPanel({ image, placeholder, panel, markClass }: { image: string; placeholder: string; panel: string; markClass: string }) {
  return (
    <div className={`relative min-h-0 overflow-hidden rounded-lg border ${panel}`}>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="grid h-full min-h-52 place-items-center bg-black/24 p-6 text-center">
          <div>
            <div className={`mx-auto mb-4 grid size-24 place-items-center rounded-md border border-white/20 bg-black/24 text-5xl font-black ${markClass}`}>M</div>
            <p className="text-2xl font-black text-white/75">{placeholder}</p>
          </div>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
    </div>
  );
}
