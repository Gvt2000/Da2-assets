import type { ThemeType } from "@/lib/types";

export function themeClasses(theme: ThemeType) {
  if (theme === "minimal") {
    return {
      bg: "bg-[#f6f3ef] text-[#17151d]",
      panel: "bg-white/88 border-black/10 shadow-[0_26px_70px_rgba(0,0,0,.12)]",
      muted: "text-zinc-600",
      accent: "bg-[#17151d] text-white",
      line: "bg-zinc-300",
      topLine: "bg-[#17151d]",
      icon: "text-[#17151d]",
      placeholderMark: "text-[#17151d]",
      difficultyFill: "bg-[#17151d]",
      scoreFill: "bg-[#17151d]",
      scoreTopLine: "bg-[#17151d]",
      scoreBorder: "border-[#17151d]/70",
      rankingNumber: "bg-[#17151d] text-white",
      prosHeader: "bg-[#17151d] text-white",
      consHeader: "bg-zinc-300 text-[#17151d]",
      prosBadge: "bg-white/18 text-white",
      consBadge: "bg-black/10 text-[#17151d]",
      versusA: "from-[#17151d] to-zinc-700 text-white",
      versusB: "from-zinc-300 to-white text-[#17151d]",
      versusCircle: "border-[#17151d] text-[#17151d]",
    };
  }

  if (theme === "colorful") {
    return {
      bg: "bg-[#10180f] text-white",
      panel: "bg-[#fff7ed]/12 border-[#facc15]/30 shadow-[0_32px_80px_rgba(0,0,0,.28)]",
      muted: "text-lime-50/78",
      accent: "bg-[#facc15] text-zinc-950",
      line: "bg-lime-200/20",
      topLine: "bg-gradient-to-r from-yellow-300 via-orange-400 to-emerald-300",
      icon: "text-lime-200",
      placeholderMark: "text-lime-100",
      difficultyFill: "bg-gradient-to-r from-yellow-300 to-orange-400",
      scoreFill: "bg-gradient-to-r from-teal-300 via-lime-300 to-orange-300",
      scoreTopLine: "bg-gradient-to-r from-teal-300 via-lime-300 to-orange-400",
      scoreBorder: "border-orange-300/80",
      rankingNumber: "bg-orange-400 text-zinc-950",
      prosHeader: "bg-emerald-400 text-zinc-950",
      consHeader: "bg-rose-400 text-zinc-950",
      prosBadge: "bg-emerald-300 text-zinc-950",
      consBadge: "bg-rose-300 text-zinc-950",
      versusA: "from-teal-300 to-cyan-200 text-zinc-950",
      versusB: "from-orange-300 to-amber-200 text-zinc-950",
      versusCircle: "border-orange-300 text-orange-200",
    };
  }

  if (theme === "no-solo-dados") {
    return {
      bg: "bg-[#424242] text-white",
      panel: "bg-[#D2B6D7]/18 border-[#5BA07D]/45 shadow-[0_34px_90px_rgba(0,0,0,.34)]",
      muted: "text-[#D2B6D7]/90",
      accent: "bg-[#CBD870] text-[#424242]",
      line: "bg-[#D2B6D7]/24",
      topLine: "bg-gradient-to-r from-[#83589E] via-[#5BA07D] to-[#CBD870]",
      icon: "text-[#CBD870]",
      placeholderMark: "text-[#CBD870]",
      difficultyFill: "bg-gradient-to-r from-[#83589E] via-[#5BA07D] to-[#CBD870]",
      scoreFill: "bg-gradient-to-r from-[#83589E] via-[#5BA07D] to-[#CBD870]",
      scoreTopLine: "bg-gradient-to-r from-[#83589E] via-[#5BA07D] to-[#CBD870]",
      scoreBorder: "border-[#CBD870]/90",
      rankingNumber: "bg-[#CBD870] text-[#424242]",
      prosHeader: "bg-[#5BA07D] text-white",
      consHeader: "bg-[#83589E] text-white",
      prosBadge: "bg-[#CBD870] text-[#424242]",
      consBadge: "bg-[#D2B6D7] text-[#424242]",
      versusA: "from-[#83589E] to-[#D2B6D7] text-white",
      versusB: "from-[#5BA07D] to-[#CBD870] text-[#424242]",
      versusCircle: "border-[#CBD870] text-[#CBD870]",
    };
  }

  return {
    bg: "bg-[#111014] text-white",
    panel: "bg-white/[0.09] border-white/15 shadow-[0_32px_90px_rgba(0,0,0,.32)]",
    muted: "text-zinc-200/82",
    accent: "bg-orange-400 text-zinc-950",
    line: "bg-white/14",
    topLine: "bg-gradient-to-r from-orange-400 via-amber-200 to-teal-300",
    icon: "text-teal-200",
    placeholderMark: "text-teal-100",
    difficultyFill: "bg-gradient-to-r from-orange-300 to-orange-500",
    scoreFill: "bg-gradient-to-r from-teal-300 via-lime-300 to-orange-300",
    scoreTopLine: "bg-gradient-to-r from-teal-300 via-lime-300 to-orange-400",
    scoreBorder: "border-orange-300/80",
    rankingNumber: "bg-orange-400 text-zinc-950",
    prosHeader: "bg-emerald-400 text-zinc-950",
    consHeader: "bg-rose-400 text-zinc-950",
    prosBadge: "bg-emerald-300 text-zinc-950",
    consBadge: "bg-rose-300 text-zinc-950",
    versusA: "from-teal-300 to-cyan-200 text-zinc-950",
    versusB: "from-orange-300 to-amber-200 text-zinc-950",
    versusCircle: "border-orange-300 text-orange-200",
  };
}

export function clampScore(value: number, max = 10) {
  return Math.max(0, Math.min(max, Number.isFinite(value) ? value : 0));
}
