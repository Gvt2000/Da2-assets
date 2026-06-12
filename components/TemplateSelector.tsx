"use client";

import { FileBadge, ListChecks, Medal, Swords, Trophy } from "lucide-react";
import { TEMPLATE_LABELS, type TemplateType } from "@/lib/types";

const icons: Record<TemplateType, React.ComponentType<{ className?: string }>> = {
  "game-card": FileBadge,
  "pros-cons": ListChecks,
  score: Medal,
  ranking: Trophy,
  versus: Swords,
};

export function TemplateSelector({
  value,
  onChange,
}: {
  value: TemplateType;
  onChange: (template: TemplateType) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-5">
      {(Object.keys(TEMPLATE_LABELS) as TemplateType[]).map((template) => {
        const Icon = icons[template];
        const active = value === template;

        return (
          <button
            key={template}
            type="button"
            onClick={() => onChange(template)}
            className={`flex min-h-20 items-center gap-3 rounded-lg border px-3 text-left text-sm transition ${
              active
                ? "border-orange-300 bg-orange-400/15 text-white shadow-[0_0_0_1px_rgba(251,146,60,.25)]"
                : "border-white/10 bg-white/[0.04] text-zinc-300 hover:border-teal-300/50 hover:bg-white/[0.07]"
            }`}
          >
            <span className={`grid size-9 shrink-0 place-items-center rounded-md ${active ? "bg-orange-400 text-zinc-950" : "bg-white/8 text-teal-200"}`}>
              <Icon className="size-5" />
            </span>
            <span className="font-medium leading-tight">{TEMPLATE_LABELS[template]}</span>
          </button>
        );
      })}
    </div>
  );
}
