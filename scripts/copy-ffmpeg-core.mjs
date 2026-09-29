// Copies ffmpeg.wasm into public/ so the ProRes export works offline and its worker is served unbundled
// (Next's bundler rejects the worker's dynamic import of the core).
import { copyFileSync, mkdirSync } from "node:fs";

const files = {
  "node_modules/@ffmpeg/core/dist/esm": ["ffmpeg-core.js", "ffmpeg-core.wasm"],
  "node_modules/@ffmpeg/ffmpeg/dist/esm": ["worker.js", "const.js", "errors.js"],
};
const to = "public/ffmpeg";

mkdirSync(to, { recursive: true });
for (const [from, names] of Object.entries(files)) {
  for (const name of names) copyFileSync(`${from}/${name}`, `${to}/${name}`);
}
