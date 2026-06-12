"use client";

import { Film } from "lucide-react";
import { toPng } from "html-to-image";
import { useState, type RefObject } from "react";
import { GIFEncoder, applyPalette, quantize } from "gifenc";
import type { ScoreAnimationMode } from "@/lib/types";

const FPS = 24;
const END_HOLD_SECONDS = 0.8;

export function AnimatedExportButton({
  targetRef,
  fileName,
  duration,
  animationMode,
  criteriaCount,
}: {
  targetRef: RefObject<HTMLDivElement | null>;
  fileName: string;
  duration: number;
  animationMode: ScoreAnimationMode;
  criteriaCount: number;
}) {
  const [isExporting, setIsExporting] = useState<false | "webm" | "gif">(false);

  async function exportWebm() {
    const node = targetRef.current;
    if (!node || isExporting) return;

    setIsExporting("webm");
    const width = node.offsetWidth;
    const height = node.offsetHeight;
    const safeDuration = Math.max(0.3, Math.min(8, duration || 1.6));
    const totalDuration = safeDuration + END_HOLD_SECONDS;
    const frames = Math.ceil(totalDuration * FPS);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");

    if (!context) {
      setIsExporting(false);
      return;
    }

    const stream = canvas.captureStream(FPS);
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : "video/webm";
    const recorder = new MediaRecorder(stream, { mimeType });
    const chunks: BlobPart[] = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };

    node.classList.add("asset-recording");
    const stopped = new Promise<void>((resolve) => {
      recorder.onstop = () => resolve();
    });

    recorder.start();

    try {
      for (let frame = 0; frame <= frames; frame += 1) {
        const seconds = frame / FPS;
        const rawProgress = Math.min(1, seconds / safeDuration);
        const progress = easeOutCubic(rawProgress);
        const reveal = Math.max(0, Math.min(1, (seconds - safeDuration) / 0.35));

        applyScoreProgress(node, progress, animationMode, criteriaCount);
        node.style.setProperty("--score-reveal", reveal.toFixed(4));

        const dataUrl = await toPng(node, {
          cacheBust: true,
          pixelRatio: 1,
          backgroundColor: "#111014",
        });
        const image = await loadImage(dataUrl);
        context.clearRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);
        await wait(1000 / FPS);
      }
    } finally {
      recorder.stop();
      node.classList.remove("asset-recording");
      node.style.removeProperty("--score-progress");
      node.style.removeProperty("--score-reveal");
      clearInlineBarProgress(node);
    }

    await stopped;

    const blob = new Blob(chunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = fileName.replace(/\.png$/i, ".webm");
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    setIsExporting(false);
  }

  async function exportGif() {
    const node = targetRef.current;
    if (!node || isExporting) return;

    setIsExporting("gif");
    const width = node.offsetWidth;
    const height = node.offsetHeight;
    const safeDuration = Math.max(0.3, Math.min(8, duration || 1.6));
    const totalDuration = safeDuration + END_HOLD_SECONDS;
    const frames = Math.ceil(totalDuration * FPS);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { willReadFrequently: true });

    if (!context) {
      setIsExporting(false);
      return;
    }

    const gif = GIFEncoder();
    node.classList.add("asset-recording");

    try {
      for (let frame = 0; frame <= frames; frame += 1) {
        const seconds = frame / FPS;
        const rawProgress = Math.min(1, seconds / safeDuration);
        const progress = easeOutCubic(rawProgress);
        const reveal = Math.max(0, Math.min(1, (seconds - safeDuration) / 0.35));

        applyScoreProgress(node, progress, animationMode, criteriaCount);
        node.style.setProperty("--score-reveal", reveal.toFixed(4));

        const dataUrl = await toPng(node, {
          cacheBust: true,
          pixelRatio: 1,
          backgroundColor: "#111014",
        });
        const image = await loadImage(dataUrl);
        context.clearRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);
        const imageData = context.getImageData(0, 0, width, height);
        const palette = quantize(imageData.data, 128);
        const index = applyPalette(imageData.data, palette);
        gif.writeFrame(index, width, height, { palette, delay: Math.round(1000 / FPS) });
        await wait(0);
      }
    } finally {
      node.classList.remove("asset-recording");
      node.style.removeProperty("--score-progress");
      node.style.removeProperty("--score-reveal");
      clearInlineBarProgress(node);
    }

    gif.finish();
    const bytes = gif.bytes();
    const gifBuffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
    const blob = new Blob([gifBuffer], { type: "image/gif" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = fileName.replace(/\.png$/i, ".gif");
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    setIsExporting(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={exportWebm}
        disabled={Boolean(isExporting)}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-teal-200/30 bg-teal-300 px-4 py-3 text-sm font-bold text-zinc-950 transition hover:bg-teal-200 disabled:cursor-wait disabled:opacity-70"
      >
        <Film className="size-4" />
        {isExporting === "webm" ? "Exportando..." : "Exportar WebM"}
      </button>
      <button
        type="button"
        onClick={exportGif}
        disabled={Boolean(isExporting)}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-200/30 bg-amber-300 px-4 py-3 text-sm font-bold text-zinc-950 transition hover:bg-amber-200 disabled:cursor-wait disabled:opacity-70"
      >
        <Film className="size-4" />
        {isExporting === "gif" ? "Exportando..." : "Exportar GIF"}
      </button>
    </>
  );
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function applyScoreProgress(node: HTMLDivElement, progress: number, mode: ScoreAnimationMode, criteriaCount: number) {
  const bars = Array.from(node.querySelectorAll<HTMLElement>(".score-fill"));
  const count = Math.max(1, criteriaCount || bars.length);

  bars.forEach((bar, index) => {
    const barProgress =
      mode === "sequential"
        ? Math.max(0, Math.min(1, progress * count - index))
        : progress;
    bar.style.transform = `scaleX(${easeOutCubic(barProgress).toFixed(4)})`;
  });
}

function clearInlineBarProgress(node: HTMLDivElement) {
  node.querySelectorAll<HTMLElement>(".score-fill").forEach((bar) => {
    bar.style.removeProperty("transform");
  });
}
