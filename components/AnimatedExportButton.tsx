"use client";

import { Film } from "lucide-react";
import { getFontEmbedCSS, toCanvas } from "html-to-image";
import { useState, type RefObject } from "react";
import { GIFEncoder, applyPalette, quantize } from "gifenc";
import { BufferTarget, CanvasSource, Mp4OutputFormat, Output, canEncodeVideo } from "mediabunny";

const VIDEO_FPS = 30;
// GIF delays are stored in hundredths of a second, so 25 fps (40 ms) is the closest exact rate.
const GIF_FPS = 25;
const END_HOLD_SECONDS = 0.8;
const KEYFRAME_INTERVAL_SECONDS = 2;
const OPAQUE_BACKGROUND = "#111014";

// Mirrors the CSS timeline in ScoreTemplate so the export moves exactly like the preview.
const BAR_EASING = cubicBezier(0.16, 1, 0.3, 1);
const POP_EASING = cubicBezier(0, 0, 0.58, 1);
const POP_DELAY = 0.14;
const LABEL_DELAY = 0.26;
const POP_DURATION = 0.5;

type Timeline = {
  duration: number;
  barDelays: number[];
  totalSeconds: number;
};

export function AnimatedExportButton({
  targetRef,
  fileName,
  duration,
  transparent,
}: {
  targetRef: RefObject<HTMLDivElement | null>;
  fileName: string;
  duration: number;
  transparent: boolean;
}) {
  const [isExporting, setIsExporting] = useState<false | "video" | "gif">(false);
  const [progress, setProgress] = useState(0);

  // MP4 (H.264) opens anywhere but has no alpha channel, so transparent overlays go out as ProRes 4444 .mov,
  // which Premiere Pro imports with transparency out of the box.
  async function exportVideo() {
    const node = targetRef.current;
    if (!node || isExporting) return;

    setIsExporting("video");
    setProgress(0);

    try {
      if (transparent) await exportProRes(node);
      else await exportMp4(node);
    } catch (error) {
      console.error(error);
      window.alert("No se pudo exportar el vídeo.");
    } finally {
      setIsExporting(false);
    }
  }

  async function exportMp4(node: HTMLDivElement) {
    const width = node.offsetWidth;
    const height = node.offsetHeight;
    // Roughly 0.2 bits per pixel per frame: crisp text and smooth gradients without huge files.
    const bitrate = Math.round(width * height * VIDEO_FPS * 0.2);

    if (typeof VideoEncoder === "undefined" || !(await canEncodeVideo("avc", { width, height, bitrate, frameRate: VIDEO_FPS }))) {
      window.alert("Este navegador no puede codificar vídeo MP4. Usa Chrome o Edge actualizados.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return;

    const output = new Output({ format: new Mp4OutputFormat({ fastStart: "in-memory" }), target: new BufferTarget() });
    const source = new CanvasSource(canvas, { codec: "avc", bitrate, keyFrameInterval: KEYFRAME_INTERVAL_SECONDS });
    output.addVideoTrack(source, { frameRate: VIDEO_FPS });
    await output.start();

    await renderFrames(node, VIDEO_FPS, duration, false, async (frameCanvas, frame, frames) => {
      context.drawImage(frameCanvas, 0, 0, width, height);
      // Explicit timestamps: playback speed no longer depends on how long each capture takes.
      await source.add(frame / VIDEO_FPS, 1 / VIDEO_FPS);
      setProgress(frame / frames);
    });

    await output.finalize();
    const buffer = output.target.buffer;
    if (!buffer) throw new Error("Empty MP4 output");

    download(new Blob([buffer], { type: "video/mp4" }), fileName.replace(/\.png$/i, ".mp4"));
  }

  async function exportProRes(node: HTMLDivElement) {
    const { FFmpeg } = await import("@ffmpeg/ffmpeg");
    const ffmpeg = new FFmpeg();
    // Worker and core are served from public/ffmpeg (copied there on npm install), see scripts/copy-ffmpeg-core.mjs.
    await ffmpeg.load({
      classWorkerURL: new URL("/ffmpeg/worker.js", window.location.origin).href,
      coreURL: new URL("/ffmpeg/ffmpeg-core.js", window.location.origin).href,
      wasmURL: new URL("/ffmpeg/ffmpeg-core.wasm", window.location.origin).href,
    });

    try {
      let frameCount = 0;

      // Capture takes the first 60% of the progress bar, ProRes encoding the rest.
      await renderFrames(node, VIDEO_FPS, duration, true, async (frameCanvas, frame, frames) => {
        const png = await canvasToPng(frameCanvas);
        await ffmpeg.writeFile(`frame_${String(frame).padStart(5, "0")}.png`, png);
        frameCount = frame + 1;
        setProgress((frame / frames) * 0.6);
      });

      ffmpeg.on("progress", ({ progress: encoded }) => setProgress(0.6 + Math.min(1, Math.max(0, encoded)) * 0.4));

      const exitCode = await ffmpeg.exec([
        "-framerate", String(VIDEO_FPS),
        "-i", "frame_%05d.png",
        "-frames:v", String(frameCount),
        "-c:v", "prores_ks",
        "-profile:v", "4444",
        "-pix_fmt", "yuva444p10le",
        "-alpha_bits", "16",
        "-vendor", "apl0",
        "-color_primaries", "bt709",
        "-color_trc", "bt709",
        "-colorspace", "bt709",
        "output.mov",
      ]);
      if (exitCode !== 0) throw new Error(`ffmpeg exited with code ${exitCode}`);

      const data = await ffmpeg.readFile("output.mov");
      if (typeof data === "string") throw new Error("Unexpected ffmpeg output");
      download(new Blob([data.slice().buffer], { type: "video/quicktime" }), fileName.replace(/\.png$/i, ".mov"));
    } finally {
      ffmpeg.terminate();
    }
  }

  async function exportGif() {
    const node = targetRef.current;
    if (!node || isExporting) return;

    setIsExporting("gif");
    setProgress(0);

    try {
      const width = node.offsetWidth;
      const height = node.offsetHeight;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return;

      const gif = GIFEncoder();
      const delay = Math.round(1000 / GIF_FPS);

      await renderFrames(node, GIF_FPS, duration, false, (frameCanvas, frame, frames) => {
        context.drawImage(frameCanvas, 0, 0, width, height);
        const imageData = context.getImageData(0, 0, width, height);
        const palette = quantize(imageData.data, 256);
        const index = applyPalette(imageData.data, palette);
        gif.writeFrame(index, width, height, { palette, delay });
        setProgress(frame / frames);
      });

      gif.finish();
      const bytes = gif.bytes();
      const gifBuffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
      download(new Blob([gifBuffer], { type: "image/gif" }), fileName.replace(/\.png$/i, ".gif"));
    } catch (error) {
      console.error(error);
      window.alert("No se pudo exportar el GIF.");
    } finally {
      setIsExporting(false);
    }
  }

  const progressLabel = `Exportando ${Math.round(progress * 100)}%`;

  return (
    <>
      <button
        type="button"
        onClick={exportVideo}
        disabled={Boolean(isExporting)}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-teal-200/30 bg-teal-300 px-4 py-3 text-sm font-bold text-zinc-950 transition hover:bg-teal-200 disabled:cursor-wait disabled:opacity-70"
      >
        <Film className="size-4" />
        {isExporting === "video" ? progressLabel : transparent ? "Exportar MOV (transparente)" : "Exportar MP4"}
      </button>
      <button
        type="button"
        onClick={exportGif}
        disabled={Boolean(isExporting)}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-200/30 bg-amber-300 px-4 py-3 text-sm font-bold text-zinc-950 transition hover:bg-amber-200 disabled:cursor-wait disabled:opacity-70"
      >
        <Film className="size-4" />
        {isExporting === "gif" ? progressLabel : "Exportar GIF"}
      </button>
    </>
  );
}

async function renderFrames(
  node: HTMLDivElement,
  fps: number,
  duration: number,
  transparent: boolean,
  onFrame: (canvas: HTMLCanvasElement, frame: number, frames: number) => void | Promise<void>,
) {
  const timeline = buildTimeline(node, duration);
  const frames = Math.ceil(timeline.totalSeconds * fps);
  const width = node.offsetWidth;
  const height = node.offsetHeight;

  node.classList.add("asset-recording");
  if (transparent) node.classList.add("asset-transparent");

  try {
    // Embedding fonts is the slowest part of html-to-image, so do it once instead of per frame.
    const fontEmbedCSS = await getFontEmbedCSS(node);

    for (let frame = 0; frame <= frames; frame += 1) {
      applyTimeline(node, timeline, frame / fps);

      const canvas = await toCanvas(node, {
        width,
        height,
        canvasWidth: width,
        canvasHeight: height,
        pixelRatio: 1,
        fontEmbedCSS,
        backgroundColor: transparent ? undefined : OPAQUE_BACKGROUND,
      });

      await onFrame(canvas, frame, frames);
    }
  } finally {
    node.classList.remove("asset-recording", "asset-transparent");
    clearTimeline(node);
  }
}

function buildTimeline(node: HTMLDivElement, rawDuration: number): Timeline {
  const duration = Math.max(0.3, Math.min(8, rawDuration || 1.6));
  // Bars carry their per-criterion delay (sequential mode) as an inline animation-delay.
  const barDelays = Array.from(node.querySelectorAll<HTMLElement>(".score-fill")).map((bar) => parseFloat(bar.style.animationDelay) || 0);
  const barsEnd = duration + Math.max(0, ...barDelays);
  const revealEnd = duration + LABEL_DELAY + POP_DURATION;

  return { duration, barDelays, totalSeconds: Math.max(barsEnd, revealEnd) + END_HOLD_SECONDS };
}

function applyTimeline(node: HTMLDivElement, timeline: Timeline, seconds: number) {
  node.querySelectorAll<HTMLElement>(".score-fill").forEach((bar, index) => {
    const local = clamp01((seconds - (timeline.barDelays[index] ?? 0)) / timeline.duration);
    bar.style.transform = `scaleX(${BAR_EASING(local).toFixed(4)})`;
  });

  const popReveal = POP_EASING(clamp01((seconds - timeline.duration - POP_DELAY) / POP_DURATION));
  const labelReveal = POP_EASING(clamp01((seconds - timeline.duration - LABEL_DELAY) / POP_DURATION));

  node.querySelectorAll<HTMLElement>(".score-pop").forEach((element) => {
    element.style.setProperty("--score-reveal", popReveal.toFixed(4));
  });
  node.querySelectorAll<HTMLElement>(".score-label").forEach((element) => {
    element.style.setProperty("--score-reveal", labelReveal.toFixed(4));
  });
}

function clearTimeline(node: HTMLDivElement) {
  node.querySelectorAll<HTMLElement>(".score-fill").forEach((bar) => bar.style.removeProperty("transform"));
  node.querySelectorAll<HTMLElement>(".score-pop, .score-label").forEach((element) => element.style.removeProperty("--score-reveal"));
}

function canvasToPng(canvas: HTMLCanvasElement) {
  return new Promise<Uint8Array>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Could not encode frame as PNG"));
      blob.arrayBuffer().then((buffer) => resolve(new Uint8Array(buffer)), reject);
    }, "image/png");
  });
}

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = name;
  link.href = url;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const sample = (t: number, a: number, b: number) => 3 * a * t * (1 - t) ** 2 + 3 * b * t ** 2 * (1 - t) + t ** 3;
  const slope = (t: number, a: number, b: number) => 3 * a * (1 - t) ** 2 + 6 * (b - a) * t * (1 - t) + 3 * (1 - b) * t ** 2;

  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;

    let t = x;
    for (let i = 0; i < 8; i += 1) {
      const error = sample(t, x1, x2) - x;
      if (Math.abs(error) < 1e-6) break;
      const d = slope(t, x1, x2);
      if (Math.abs(d) < 1e-6) break;
      t -= error / d;
    }

    // Newton can overshoot on steep curves; fall back to bisection if it left [0, 1].
    if (t < 0 || t > 1) {
      let lo = 0;
      let hi = 1;
      t = x;
      for (let i = 0; i < 30; i += 1) {
        if (sample(t, x1, x2) < x) lo = t;
        else hi = t;
        t = (lo + hi) / 2;
      }
    }

    return sample(t, y1, y2);
  };
}
