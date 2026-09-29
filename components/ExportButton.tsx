"use client";

import { Download } from "lucide-react";
import { toPng } from "html-to-image";
import type { RefObject } from "react";

export function ExportButton({
  targetRef,
  fileName,
  transparent = false,
}: {
  targetRef: RefObject<HTMLDivElement | null>;
  fileName: string;
  transparent?: boolean;
}) {
  async function exportPng() {
    const node = targetRef.current;
    if (!node) return;

    node.classList.add("asset-exporting");
    if (transparent) node.classList.add("asset-transparent");
    let dataUrl: string;
    try {
      dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 1,
        backgroundColor: transparent ? undefined : "#111014",
      });
    } finally {
      node.classList.remove("asset-exporting", "asset-transparent");
    }

    const link = document.createElement("a");
    link.download = fileName;
    link.href = dataUrl;
    link.click();
  }

  return (
    <button
      type="button"
      onClick={exportPng}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-400 px-4 py-3 text-sm font-bold text-zinc-950 transition hover:bg-orange-300"
    >
      <Download className="size-4" />
      Descargar PNG
    </button>
  );
}
