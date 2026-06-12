"use client";

import { Clapperboard, Sparkles } from "lucide-react";
import type { ComingSoonData, FormatType, ResolutionType, ThemeType } from "@/lib/types";
import { getBaseCanvasSize, getCanvasSize, getResolutionScale } from "@/lib/types";
import { AutoFitText } from "../AutoFitText";
import { themeClasses } from "./templateStyles";

export function ComingSoonTemplate({
  data,
  format,
  theme,
  resolution,
}: {
  data: ComingSoonData;
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

  return (
    <div style={{ width: size.width, height: size.height }} className={`asset-safe relative overflow-hidden ${t.bg}`}>
      <div style={{ width: baseSize.width, height: baseSize.height, transform: `scale(${scale})`, transformOrigin: "top left" }} className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(0,0,0,.28),transparent_48%,rgba(0,0,0,.34)),radial-gradient(circle_at_15%_18%,rgba(249,115,22,.30),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(45,212,191,.22),transparent_28%)]" />
        <div className={`absolute inset-x-14 top-12 h-2 rounded-full ${t.topLine}`} />
        {vertical ? (
          <VerticalLayout data={data} theme={t} instagram={instagram} />
        ) : (
          <HorizontalLayout data={data} theme={t} />
        )}
      </div>
    </div>
  );
}

function HorizontalLayout({ data, theme }: { data: ComingSoonData; theme: ReturnType<typeof themeClasses> }) {
  return (
    <div className="relative grid h-full grid-cols-[760px_1fr] gap-16 p-20 pt-24">
      <section className="flex min-h-0 flex-col justify-between">
        <div>
          <p className={`mb-8 inline-flex rounded-md px-6 py-3 text-3xl font-black uppercase ${theme.accent}`}>Próximamente</p>
          <AutoFitText as="h1" maxSize={148} minSize={48} lines={3} lineHeight={0.88} className="text-balance font-black uppercase drop-shadow-[0_10px_22px_rgba(0,0,0,.36)]">
            {data.gameName || "Nombre del juego"}
          </AutoFitText>
        </div>

        <div className={`rounded-lg border p-8 ${theme.panel}`}>
          <div className="mb-5 flex items-center gap-4">
            <span className={`grid size-16 shrink-0 place-items-center rounded-md ${theme.accent}`}>
              <Clapperboard className="size-9" />
            </span>
            <p className={`text-2xl font-black uppercase ${theme.muted}`}>En los próximos vídeos</p>
          </div>
          <AutoFitText as="p" maxSize={62} minSize={24} lines={2} lineHeight={0.98} className="font-black uppercase">
            {data.videoType || "Tipo de vídeo"}
          </AutoFitText>
        </div>
      </section>

      <CoverPanel data={data} theme={theme} />
    </div>
  );
}

function VerticalLayout({ data, theme, instagram }: { data: ComingSoonData; theme: ReturnType<typeof themeClasses>; instagram: boolean }) {
  return (
    <div className={`relative flex h-full flex-col ${instagram ? "gap-8 p-12 pt-16" : "gap-12 p-16 pt-24"}`}>
      <div className="flex items-center justify-between gap-8">
        <p className={`shrink-0 rounded-md ${instagram ? "px-5 py-2 text-2xl" : "px-6 py-3 text-3xl"} font-black uppercase ${theme.accent}`}>Próximamente</p>
        <div className={`h-2 flex-1 rounded-full ${theme.topLine}`} />
      </div>

      <div className={`${instagram ? "min-h-[470px]" : "min-h-[820px]"} min-w-0 flex-1`}>
        <CoverPanel data={data} theme={theme} compact={instagram} />
      </div>

      <section className={`shrink-0 rounded-lg border ${instagram ? "p-7" : "p-9"} ${theme.panel}`}>
        <div className={`mb-5 flex items-center gap-4 ${instagram ? "justify-center" : ""}`}>
          <span className={`grid ${instagram ? "size-14" : "size-16"} shrink-0 place-items-center rounded-md ${theme.accent}`}>
            <Sparkles className={instagram ? "size-8" : "size-9"} />
          </span>
          <AutoFitText as="p" maxSize={instagram ? 28 : 34} minSize={18} lines={1} lineHeight={1} className={`font-black uppercase ${theme.muted}`}>
            En los próximos vídeos
          </AutoFitText>
        </div>
        <AutoFitText as="h1" maxSize={instagram ? 76 : 104} minSize={34} lines={2} lineHeight={0.9} className="text-center font-black uppercase">
          {data.gameName || "Nombre del juego"}
        </AutoFitText>
        <div className={`mx-auto mt-5 max-w-full rounded-md px-5 py-3 ${theme.accent}`}>
          <AutoFitText as="p" maxSize={instagram ? 44 : 58} minSize={22} lines={1} lineHeight={1} className="text-center font-black uppercase">
            {data.videoType || "Tipo de vídeo"}
          </AutoFitText>
        </div>
      </section>
    </div>
  );
}

function CoverPanel({
  data,
  theme,
  compact = false,
}: {
  data: ComingSoonData;
  theme: ReturnType<typeof themeClasses>;
  compact?: boolean;
}) {
  return (
    <section className={`relative h-full min-h-0 overflow-hidden rounded-lg border-2 ${theme.panel}`}>
      {data.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={data.coverImage} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="grid h-full place-items-center bg-[linear-gradient(145deg,rgba(20,184,166,.24),rgba(249,115,22,.18))] p-12 text-center">
          <div>
            <div className={`mx-auto mb-8 grid ${compact ? "size-44" : "size-56"} place-items-center rounded-lg border border-white/20 bg-black/24 ${compact ? "text-8xl" : "text-9xl"} font-black ${theme.placeholderMark}`}>?</div>
            <p className={`${compact ? "text-4xl" : "text-5xl"} font-black ${theme.muted}`}>Imagen del juego</p>
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.02),rgba(0,0,0,.28)),linear-gradient(90deg,rgba(0,0,0,.34),transparent_34%,rgba(0,0,0,.16))]" />
      <div className={`absolute bottom-7 left-7 rounded-md px-5 py-3 text-2xl font-black uppercase ${theme.accent}`}>Next</div>
    </section>
  );
}
