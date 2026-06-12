module.exports = [
"[project]/components/AnimatedExportButton.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AnimatedExportButton",
    ()=>AnimatedExportButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$film$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Film$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/film.js [app-ssr] (ecmascript) <export default as Film>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html$2d$to$2d$image$2f$es$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/html-to-image/es/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gifenc$2f$dist$2f$gifenc$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/gifenc/dist/gifenc.esm.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const FPS = 24;
const END_HOLD_SECONDS = 0.8;
function AnimatedExportButton({ targetRef, fileName, duration, animationMode, criteriaCount }) {
    const [isExporting, setIsExporting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
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
        const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm";
        const recorder = new MediaRecorder(stream, {
            mimeType
        });
        const chunks = [];
        recorder.ondataavailable = (event)=>{
            if (event.data.size > 0) chunks.push(event.data);
        };
        node.classList.add("asset-recording");
        const stopped = new Promise((resolve)=>{
            recorder.onstop = ()=>resolve();
        });
        recorder.start();
        try {
            for(let frame = 0; frame <= frames; frame += 1){
                const seconds = frame / FPS;
                const rawProgress = Math.min(1, seconds / safeDuration);
                const progress = easeOutCubic(rawProgress);
                const reveal = Math.max(0, Math.min(1, (seconds - safeDuration) / 0.35));
                applyScoreProgress(node, progress, animationMode, criteriaCount);
                node.style.setProperty("--score-reveal", reveal.toFixed(4));
                const dataUrl = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html$2d$to$2d$image$2f$es$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toPng"])(node, {
                    cacheBust: true,
                    pixelRatio: 1,
                    backgroundColor: "#111014"
                });
                const image = await loadImage(dataUrl);
                context.clearRect(0, 0, width, height);
                context.drawImage(image, 0, 0, width, height);
                await wait(1000 / FPS);
            }
        } finally{
            recorder.stop();
            node.classList.remove("asset-recording");
            node.style.removeProperty("--score-progress");
            node.style.removeProperty("--score-reveal");
            clearInlineBarProgress(node);
        }
        await stopped;
        const blob = new Blob(chunks, {
            type: "video/webm"
        });
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
        const context = canvas.getContext("2d", {
            willReadFrequently: true
        });
        if (!context) {
            setIsExporting(false);
            return;
        }
        const gif = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gifenc$2f$dist$2f$gifenc$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GIFEncoder"])();
        node.classList.add("asset-recording");
        try {
            for(let frame = 0; frame <= frames; frame += 1){
                const seconds = frame / FPS;
                const rawProgress = Math.min(1, seconds / safeDuration);
                const progress = easeOutCubic(rawProgress);
                const reveal = Math.max(0, Math.min(1, (seconds - safeDuration) / 0.35));
                applyScoreProgress(node, progress, animationMode, criteriaCount);
                node.style.setProperty("--score-reveal", reveal.toFixed(4));
                const dataUrl = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html$2d$to$2d$image$2f$es$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toPng"])(node, {
                    cacheBust: true,
                    pixelRatio: 1,
                    backgroundColor: "#111014"
                });
                const image = await loadImage(dataUrl);
                context.clearRect(0, 0, width, height);
                context.drawImage(image, 0, 0, width, height);
                const imageData = context.getImageData(0, 0, width, height);
                const palette = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gifenc$2f$dist$2f$gifenc$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["quantize"])(imageData.data, 128);
                const index = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gifenc$2f$dist$2f$gifenc$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["applyPalette"])(imageData.data, palette);
                gif.writeFrame(index, width, height, {
                    palette,
                    delay: Math.round(1000 / FPS)
                });
                await wait(0);
            }
        } finally{
            node.classList.remove("asset-recording");
            node.style.removeProperty("--score-progress");
            node.style.removeProperty("--score-reveal");
            clearInlineBarProgress(node);
        }
        gif.finish();
        const bytes = gif.bytes();
        const gifBuffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
        const blob = new Blob([
            gifBuffer
        ], {
            type: "image/gif"
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = fileName.replace(/\.png$/i, ".gif");
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        setIsExporting(false);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: exportWebm,
                disabled: Boolean(isExporting),
                className: "inline-flex items-center justify-center gap-2 rounded-lg border border-teal-200/30 bg-teal-300 px-4 py-3 text-sm font-bold text-zinc-950 transition hover:bg-teal-200 disabled:cursor-wait disabled:opacity-70",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$film$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Film$3e$__["Film"], {
                        className: "size-4"
                    }, void 0, false, {
                        fileName: "[project]/components/AnimatedExportButton.tsx",
                        lineNumber: 180,
                        columnNumber: 9
                    }, this),
                    isExporting === "webm" ? "Exportando..." : "Exportar WebM"
                ]
            }, void 0, true, {
                fileName: "[project]/components/AnimatedExportButton.tsx",
                lineNumber: 174,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: exportGif,
                disabled: Boolean(isExporting),
                className: "inline-flex items-center justify-center gap-2 rounded-lg border border-amber-200/30 bg-amber-300 px-4 py-3 text-sm font-bold text-zinc-950 transition hover:bg-amber-200 disabled:cursor-wait disabled:opacity-70",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$film$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Film$3e$__["Film"], {
                        className: "size-4"
                    }, void 0, false, {
                        fileName: "[project]/components/AnimatedExportButton.tsx",
                        lineNumber: 189,
                        columnNumber: 9
                    }, this),
                    isExporting === "gif" ? "Exportando..." : "Exportar GIF"
                ]
            }, void 0, true, {
                fileName: "[project]/components/AnimatedExportButton.tsx",
                lineNumber: 183,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function easeOutCubic(value) {
    return 1 - Math.pow(1 - value, 3);
}
function wait(ms) {
    return new Promise((resolve)=>window.setTimeout(resolve, ms));
}
function loadImage(src) {
    return new Promise((resolve, reject)=>{
        const image = new Image();
        image.onload = ()=>resolve(image);
        image.onerror = reject;
        image.src = src;
    });
}
function applyScoreProgress(node, progress, mode, criteriaCount) {
    const bars = Array.from(node.querySelectorAll(".score-fill"));
    const count = Math.max(1, criteriaCount || bars.length);
    bars.forEach((bar, index)=>{
        const barProgress = mode === "sequential" ? Math.max(0, Math.min(1, progress * count - index)) : progress;
        bar.style.transform = `scaleX(${easeOutCubic(barProgress).toFixed(4)})`;
    });
}
function clearInlineBarProgress(node) {
    node.querySelectorAll(".score-fill").forEach((bar)=>{
        bar.style.removeProperty("transform");
    });
}
}),
"[project]/lib/types.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FORMAT_SIZES",
    ()=>FORMAT_SIZES,
    "RESOLUTION_LABELS",
    ()=>RESOLUTION_LABELS,
    "TEMPLATE_LABELS",
    ()=>TEMPLATE_LABELS,
    "getBaseCanvasSize",
    ()=>getBaseCanvasSize,
    "getCanvasSize",
    ()=>getCanvasSize,
    "getResolutionScale",
    ()=>getResolutionScale
]);
const TEMPLATE_LABELS = {
    "game-card": "Ficha técnica",
    "pros-cons": "Pros y contras",
    score: "Puntuación final",
    ranking: "Ranking Top",
    versus: "Versus"
};
const FORMAT_SIZES = {
    horizontal: {
        width: 1920,
        height: 1080,
        label: "Horizontal 16:9"
    },
    vertical: {
        width: 1080,
        height: 1920,
        label: "Vertical 9:16"
    },
    instagram: {
        width: 1080,
        height: 1350,
        label: "Instagram 4:5"
    }
};
const RESOLUTION_LABELS = {
    hd: "1080p",
    "4k": "4K"
};
function getCanvasSize(format, resolution) {
    const base = FORMAT_SIZES[format];
    const multiplier = getResolutionScale(resolution);
    return {
        width: base.width * multiplier,
        height: base.height * multiplier
    };
}
function getBaseCanvasSize(format) {
    return FORMAT_SIZES[format];
}
function getResolutionScale(resolution) {
    return resolution === "4k" ? 2 : 1;
}
}),
"[project]/lib/demoData.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createInitialProject",
    ()=>createInitialProject,
    "defaultScoreData",
    ()=>defaultScoreData,
    "demoData",
    ()=>demoData,
    "demoProjectFor",
    ()=>demoProjectFor
]);
const defaultScoreData = {
    gameName: "Galaxias y Meeples",
    criteria: [
        {
            id: "fun",
            name: "Diversión",
            value: 9
        },
        {
            id: "replayability",
            name: "Rejugabilidad",
            value: 8
        },
        {
            id: "interaction",
            name: "Interacción",
            value: 7
        },
        {
            id: "production",
            name: "Producción",
            value: 9
        },
        {
            id: "teachability",
            name: "Facilidad de enseñar",
            value: 6
        }
    ],
    finalScore: 8.5,
    finalLabel: "Compra segura",
    animationDuration: 1.6,
    animationMode: "sequential",
    layout: "full"
};
const demoData = {
    "game-card": {
        gameName: "Castillos de Cartón",
        publisher: "Mesa Clara",
        year: "2026",
        players: "2-4",
        duration: "45 min",
        age: "10+",
        difficulty: 3,
        categories: "Losetas, familiar, construcción",
        coverImage: "",
        verdict: "Familias y grupos que quieren construir combos sencillos sin una explicación larga."
    },
    "pros-cons": {
        gameName: "Bosque de Losetas",
        coverImage: "",
        pros: [
            "Turnos rápidos",
            "Mesa muy bonita",
            "Escala bien a dos jugadores"
        ],
        cons: [
            "Azar notable en el robo",
            "Puede quedarse corto para expertos"
        ],
        verdict: "Un familiar amable que entra por los ojos y sale mucho a mesa."
    },
    score: defaultScoreData,
    ranking: {
        title: "Top fillers para abrir la noche",
        items: [
            {
                position: 1,
                name: "Dados al Alba",
                comment: "Rápido, tenso y muy fácil de sacar."
            },
            {
                position: 2,
                name: "Mercado Lunar",
                comment: "Subastas pequeñas con mucha risa."
            },
            {
                position: 3,
                name: "Trenes de Bolsillo",
                comment: "Decisiones limpias en quince minutos."
            },
            {
                position: 4,
                name: "Isla Minuta",
                comment: "Perfecto para enseñar a cualquiera."
            },
            {
                position: 5,
                name: "Setas y Sombras",
                comment: "El punto justo de malicia."
            }
        ]
    },
    versus: {
        gameA: "Castillos de Cartón",
        gameB: "Bosque de Losetas",
        durationA: "45 min",
        durationB: "35 min",
        difficultyA: 3,
        difficultyB: 2,
        interactionA: 6,
        interactionB: 4,
        bestForA: "Grupos que quieren construir combos sencillos",
        bestForB: "Familias que priorizan fluidez y mesa bonita",
        winner: "Gana Castillos de Cartón por tener más recorrido."
    }
};
function createInitialProject(template = "game-card") {
    return {
        template,
        format: "horizontal",
        resolution: "hd",
        theme: "dark",
        data: structuredClone(demoData)
    };
}
function demoProjectFor(template) {
    return {
        template,
        format: "horizontal",
        resolution: "hd",
        theme: template === "ranking" ? "colorful" : "dark",
        data: structuredClone(demoData)
    };
}
}),
"[project]/components/EditorPanel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EditorPanel",
    ()=>EditorPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2d$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ImagePlus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image-plus.js [app-ssr] (ecmascript) <export default as ImagePlus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-ssr] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-ssr] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-ssr] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/demoData.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function EditorPanel({ project, onChange, onSave, onLoad, onDemo }) {
    const active = project.data[project.template];
    function updateTemplate(template, nextData) {
        onChange({
            ...project,
            data: {
                ...project.data,
                [template]: nextData
            }
        });
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "space-y-5 rounded-lg border border-white/10 bg-white/[0.045] p-4 shadow-2xl",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Select, {
                        label: "Formato",
                        value: project.format,
                        onChange: (value)=>onChange({
                                ...project,
                                format: value
                            }),
                        children: Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FORMAT_SIZES"]).map(([key, format])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: key,
                                children: format.label
                            }, key, false, {
                                fileName: "[project]/components/EditorPanel.tsx",
                                lineNumber: 38,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/EditorPanel.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Select, {
                        label: "Resolución",
                        value: project.resolution,
                        onChange: (value)=>onChange({
                                ...project,
                                resolution: value
                            }),
                        children: Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RESOLUTION_LABELS"]).map(([key, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: key,
                                children: label
                            }, key, false, {
                                fileName: "[project]/components/EditorPanel.tsx",
                                lineNumber: 43,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/EditorPanel.tsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Select, {
                        label: "Tema",
                        value: project.theme,
                        onChange: (value)=>onChange({
                                ...project,
                                theme: value
                            }),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "dark",
                                children: "Oscuro"
                            }, void 0, false, {
                                fileName: "[project]/components/EditorPanel.tsx",
                                lineNumber: 47,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "colorful",
                                children: "Colorido"
                            }, void 0, false, {
                                fileName: "[project]/components/EditorPanel.tsx",
                                lineNumber: 48,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "minimal",
                                children: "Minimalista"
                            }, void 0, false, {
                                fileName: "[project]/components/EditorPanel.tsx",
                                lineNumber: 49,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "no-solo-dados",
                                children: "No Solo Dados"
                            }, void 0, false, {
                                fileName: "[project]/components/EditorPanel.tsx",
                                lineNumber: 50,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/EditorPanel.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            project.template === "game-card" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GameCardForm, {
                data: active,
                onChange: (data)=>updateTemplate("game-card", data)
            }, void 0, false, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 55,
                columnNumber: 9
            }, this) : null,
            project.template === "pros-cons" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TextInput, {
                        label: "Nombre del juego",
                        value: project.data["pros-cons"].gameName,
                        onChange: (gameName)=>updateTemplate("pros-cons", {
                                ...project.data["pros-cons"],
                                gameName
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/EditorPanel.tsx",
                        lineNumber: 59,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ImageField, {
                        label: "Carátula del juego",
                        value: project.data["pros-cons"].coverImage,
                        onChange: (coverImage)=>updateTemplate("pros-cons", {
                                ...project.data["pros-cons"],
                                coverImage
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/EditorPanel.tsx",
                        lineNumber: 60,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ListEditor, {
                        title: "Pros",
                        values: project.data["pros-cons"].pros,
                        onChange: (pros)=>updateTemplate("pros-cons", {
                                ...project.data["pros-cons"],
                                pros
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/EditorPanel.tsx",
                        lineNumber: 61,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ListEditor, {
                        title: "Contras",
                        values: project.data["pros-cons"].cons,
                        onChange: (cons)=>updateTemplate("pros-cons", {
                                ...project.data["pros-cons"],
                                cons
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/EditorPanel.tsx",
                        lineNumber: 62,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Textarea, {
                        label: "Veredicto corto",
                        value: project.data["pros-cons"].verdict,
                        onChange: (verdict)=>updateTemplate("pros-cons", {
                                ...project.data["pros-cons"],
                                verdict
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/EditorPanel.tsx",
                        lineNumber: 63,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 58,
                columnNumber: 9
            }, this) : null,
            project.template === "score" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ScoreForm, {
                data: project.data.score,
                onChange: (score)=>updateTemplate("score", score)
            }, void 0, false, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 67,
                columnNumber: 9
            }, this) : null,
            project.template === "ranking" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(RankingForm, {
                items: project.data.ranking.items,
                title: project.data.ranking.title,
                onTitle: (title)=>updateTemplate("ranking", {
                        ...project.data.ranking,
                        title
                    }),
                onItems: (items)=>updateTemplate("ranking", {
                        ...project.data.ranking,
                        items
                    })
            }, void 0, false, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 70,
                columnNumber: 9
            }, this) : null,
            project.template === "versus" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(VersusForm, {
                project: project,
                onChange: (data)=>updateTemplate("versus", data)
            }, void 0, false, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 73,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-3 border-t border-white/10 pt-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(IconButton, {
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"],
                        label: "Guardar proyecto",
                        onClick: onSave
                    }, void 0, false, {
                        fileName: "[project]/components/EditorPanel.tsx",
                        lineNumber: 77,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(IconButton, {
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"],
                        label: "Cargar proyecto",
                        onClick: onLoad
                    }, void 0, false, {
                        fileName: "[project]/components/EditorPanel.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(IconButton, {
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2d$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ImagePlus$3e$__["ImagePlus"],
                        label: "Cargar demo",
                        onClick: onDemo
                    }, void 0, false, {
                        fileName: "[project]/components/EditorPanel.tsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(IconButton, {
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"],
                        label: "Resetear",
                        onClick: ()=>onChange((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createInitialProject"])(project.template))
                    }, void 0, false, {
                        fileName: "[project]/components/EditorPanel.tsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/EditorPanel.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
function GameCardForm({ data, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TextInput, {
                label: "Nombre del juego",
                value: data.gameName,
                onChange: (gameName)=>onChange({
                        ...data,
                        gameName
                    })
            }, void 0, false, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TextInput, {
                        label: "Editorial",
                        value: data.publisher,
                        onChange: (publisher)=>onChange({
                                ...data,
                                publisher
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/EditorPanel.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TextInput, {
                        label: "Año",
                        value: data.year,
                        onChange: (year)=>onChange({
                                ...data,
                                year
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/EditorPanel.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 90,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-3 gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TextInput, {
                        label: "Jugadores",
                        value: data.players,
                        onChange: (players)=>onChange({
                                ...data,
                                players
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/EditorPanel.tsx",
                        lineNumber: 95,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TextInput, {
                        label: "Duración",
                        value: data.duration,
                        onChange: (duration)=>onChange({
                                ...data,
                                duration
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/EditorPanel.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TextInput, {
                        label: "Edad",
                        value: data.age,
                        onChange: (age)=>onChange({
                                ...data,
                                age
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/EditorPanel.tsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 94,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Range, {
                label: "Dificultad",
                value: data.difficulty,
                max: 5,
                step: 0.5,
                onChange: (difficulty)=>onChange({
                        ...data,
                        difficulty
                    })
            }, void 0, false, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TextInput, {
                label: "Tipo / categorías",
                value: data.categories,
                onChange: (categories)=>onChange({
                        ...data,
                        categories
                    })
            }, void 0, false, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Textarea, {
                label: "¿Para quién es el juego?",
                value: data.verdict,
                onChange: (verdict)=>onChange({
                        ...data,
                        verdict
                    })
            }, void 0, false, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ImageField, {
                label: "Imagen de portada",
                value: data.coverImage,
                onChange: (coverImage)=>onChange({
                        ...data,
                        coverImage
                    })
            }, void 0, false, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/EditorPanel.tsx",
        lineNumber: 88,
        columnNumber: 5
    }, this);
}
function ScoreForm({ data, onChange }) {
    function updateCriteria(criteria) {
        onChange({
            ...data,
            criteria
        });
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TextInput, {
                label: "Nombre del juego",
                value: data.gameName,
                onChange: (gameName)=>onChange({
                        ...data,
                        gameName
                    })
            }, void 0, false, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 114,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Select, {
                        label: "Diseño",
                        value: data.layout,
                        onChange: (layout)=>onChange({
                                ...data,
                                layout: layout
                            }),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "full",
                                children: "Pantalla completa"
                            }, void 0, false, {
                                fileName: "[project]/components/EditorPanel.tsx",
                                lineNumber: 117,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "lower-third",
                                children: "Franja inferior"
                            }, void 0, false, {
                                fileName: "[project]/components/EditorPanel.tsx",
                                lineNumber: 118,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/EditorPanel.tsx",
                        lineNumber: 116,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Select, {
                        label: "Animación",
                        value: data.animationMode,
                        onChange: (animationMode)=>onChange({
                                ...data,
                                animationMode: animationMode
                            }),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "sequential",
                                children: "Una a una"
                            }, void 0, false, {
                                fileName: "[project]/components/EditorPanel.tsx",
                                lineNumber: 121,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "together",
                                children: "Todas a la vez"
                            }, void 0, false, {
                                fileName: "[project]/components/EditorPanel.tsx",
                                lineNumber: 122,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/EditorPanel.tsx",
                        lineNumber: 120,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 115,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CriteriaEditor, {
                values: data.criteria,
                onChange: updateCriteria
            }, void 0, false, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 125,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NumberInput, {
                label: "Nota final",
                value: data.finalScore,
                min: 0,
                max: 10,
                step: 0.5,
                onChange: (finalScore)=>onChange({
                        ...data,
                        finalScore
                    })
            }, void 0, false, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TextInput, {
                label: "Etiqueta final",
                value: data.finalLabel,
                onChange: (finalLabel)=>onChange({
                        ...data,
                        finalLabel
                    })
            }, void 0, false, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 127,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NumberInput, {
                label: "Duración animación (s)",
                value: data.animationDuration ?? 1.6,
                min: 0.3,
                max: 8,
                step: 0.1,
                onChange: (animationDuration)=>onChange({
                        ...data,
                        animationDuration
                    })
            }, void 0, false, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 128,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/EditorPanel.tsx",
        lineNumber: 113,
        columnNumber: 5
    }, this);
}
function CriteriaEditor({ values, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-bold text-zinc-200",
                        children: "Criterios de evaluación"
                    }, void 0, false, {
                        fileName: "[project]/components/EditorPanel.tsx",
                        lineNumber: 137,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>onChange([
                                ...values,
                                {
                                    id: crypto.randomUUID(),
                                    name: "Nuevo criterio",
                                    value: 7
                                }
                            ]),
                        className: "inline-flex items-center gap-2 rounded-md bg-teal-300 px-3 py-2 text-xs font-bold text-zinc-950",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                className: "size-4"
                            }, void 0, false, {
                                fileName: "[project]/components/EditorPanel.tsx",
                                lineNumber: 139,
                                columnNumber: 11
                            }, this),
                            " Añadir"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/EditorPanel.tsx",
                        lineNumber: 138,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 136,
                columnNumber: 7
            }, this),
            values.map((criterion, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-3 rounded-lg border border-white/10 bg-black/18 p-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-[1fr_auto] gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TextInput, {
                                    label: "Nombre",
                                    value: criterion.name,
                                    onChange: (name)=>onChange(values.map((entry, i)=>i === index ? {
                                                ...entry,
                                                name
                                            } : entry))
                                }, void 0, false, {
                                    fileName: "[project]/components/EditorPanel.tsx",
                                    lineNumber: 145,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    disabled: values.length <= 1,
                                    onClick: ()=>onChange(values.filter((_, i)=>i !== index)),
                                    className: "mt-6 grid size-10 place-items-center rounded-md bg-rose-400/18 text-rose-200 disabled:opacity-40",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        className: "size-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/EditorPanel.tsx",
                                        lineNumber: 147,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/EditorPanel.tsx",
                                    lineNumber: 146,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/EditorPanel.tsx",
                            lineNumber: 144,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Range, {
                            label: "Nota",
                            value: criterion.value,
                            max: 10,
                            step: 0.5,
                            onChange: (value)=>onChange(values.map((entry, i)=>i === index ? {
                                        ...entry,
                                        value
                                    } : entry))
                        }, void 0, false, {
                            fileName: "[project]/components/EditorPanel.tsx",
                            lineNumber: 150,
                            columnNumber: 11
                        }, this)
                    ]
                }, criterion.id, true, {
                    fileName: "[project]/components/EditorPanel.tsx",
                    lineNumber: 143,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/components/EditorPanel.tsx",
        lineNumber: 135,
        columnNumber: 5
    }, this);
}
function RankingForm({ title, items, onTitle, onItems }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TextInput, {
                label: "Título del ranking",
                value: title,
                onChange: onTitle
            }, void 0, false, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 170,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm font-bold text-zinc-200",
                                children: "Juegos del ranking"
                            }, void 0, false, {
                                fileName: "[project]/components/EditorPanel.tsx",
                                lineNumber: 173,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                disabled: items.length >= 10,
                                onClick: ()=>onItems([
                                        ...items,
                                        {
                                            position: items.length + 1,
                                            name: "",
                                            comment: "",
                                            coverImage: ""
                                        }
                                    ]),
                                className: "inline-flex items-center gap-2 rounded-md bg-teal-300 px-3 py-2 text-xs font-bold text-zinc-950 disabled:opacity-40",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                        className: "size-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/EditorPanel.tsx",
                                        lineNumber: 175,
                                        columnNumber: 13
                                    }, this),
                                    " Añadir"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/EditorPanel.tsx",
                                lineNumber: 174,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/EditorPanel.tsx",
                        lineNumber: 172,
                        columnNumber: 9
                    }, this),
                    items.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2 rounded-lg border border-white/10 bg-black/18 p-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-[70px_1fr_auto] gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NumberInput, {
                                            label: "Pos.",
                                            value: item.position,
                                            min: 1,
                                            max: 10,
                                            step: 1,
                                            onChange: (position)=>onItems(items.map((entry, i)=>i === index ? {
                                                        ...entry,
                                                        position
                                                    } : entry))
                                        }, void 0, false, {
                                            fileName: "[project]/components/EditorPanel.tsx",
                                            lineNumber: 181,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TextInput, {
                                            label: "Nombre",
                                            value: item.name,
                                            onChange: (name)=>onItems(items.map((entry, i)=>i === index ? {
                                                        ...entry,
                                                        name
                                                    } : entry))
                                        }, void 0, false, {
                                            fileName: "[project]/components/EditorPanel.tsx",
                                            lineNumber: 182,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>onItems(items.filter((_, i)=>i !== index)),
                                            className: "mt-6 grid size-10 place-items-center rounded-md bg-rose-400/18 text-rose-200",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                className: "size-4"
                                            }, void 0, false, {
                                                fileName: "[project]/components/EditorPanel.tsx",
                                                lineNumber: 184,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/EditorPanel.tsx",
                                            lineNumber: 183,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/EditorPanel.tsx",
                                    lineNumber: 180,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ImageField, {
                                    label: "Carátula",
                                    value: item.coverImage ?? "",
                                    onChange: (coverImage)=>onItems(items.map((entry, i)=>i === index ? {
                                                ...entry,
                                                coverImage
                                            } : entry)),
                                    compact: true
                                }, void 0, false, {
                                    fileName: "[project]/components/EditorPanel.tsx",
                                    lineNumber: 187,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Textarea, {
                                    label: "Comentario corto (opcional)",
                                    value: item.comment,
                                    onChange: (comment)=>onItems(items.map((entry, i)=>i === index ? {
                                                ...entry,
                                                comment
                                            } : entry)),
                                    rows: 2
                                }, void 0, false, {
                                    fileName: "[project]/components/EditorPanel.tsx",
                                    lineNumber: 188,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, index, true, {
                            fileName: "[project]/components/EditorPanel.tsx",
                            lineNumber: 179,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 171,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/EditorPanel.tsx",
        lineNumber: 169,
        columnNumber: 5
    }, this);
}
function VersusForm({ project, onChange }) {
    const data = project.data.versus;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TextInput, {
                        label: "Juego A",
                        value: data.gameA,
                        onChange: (gameA)=>onChange({
                                ...data,
                                gameA
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/EditorPanel.tsx",
                        lineNumber: 201,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TextInput, {
                        label: "Juego B",
                        value: data.gameB,
                        onChange: (gameB)=>onChange({
                                ...data,
                                gameB
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/EditorPanel.tsx",
                        lineNumber: 202,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 200,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ImageField, {
                        label: "Carátula A",
                        value: data.coverImageA ?? "",
                        onChange: (coverImageA)=>onChange({
                                ...data,
                                coverImageA
                            }),
                        compact: true
                    }, void 0, false, {
                        fileName: "[project]/components/EditorPanel.tsx",
                        lineNumber: 205,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ImageField, {
                        label: "Carátula B",
                        value: data.coverImageB ?? "",
                        onChange: (coverImageB)=>onChange({
                                ...data,
                                coverImageB
                            }),
                        compact: true
                    }, void 0, false, {
                        fileName: "[project]/components/EditorPanel.tsx",
                        lineNumber: 206,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 204,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TextInput, {
                        label: "Duración A",
                        value: data.durationA,
                        onChange: (durationA)=>onChange({
                                ...data,
                                durationA
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/EditorPanel.tsx",
                        lineNumber: 209,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TextInput, {
                        label: "Duración B",
                        value: data.durationB,
                        onChange: (durationB)=>onChange({
                                ...data,
                                durationB
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/EditorPanel.tsx",
                        lineNumber: 210,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 208,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Range, {
                label: "Dificultad A",
                value: data.difficultyA,
                max: 5,
                step: 0.5,
                onChange: (difficultyA)=>onChange({
                        ...data,
                        difficultyA
                    })
            }, void 0, false, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 212,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Range, {
                label: "Dificultad B",
                value: data.difficultyB,
                max: 5,
                step: 0.5,
                onChange: (difficultyB)=>onChange({
                        ...data,
                        difficultyB
                    })
            }, void 0, false, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 213,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Range, {
                label: "Interacción A",
                value: data.interactionA,
                max: 10,
                step: 0.5,
                onChange: (interactionA)=>onChange({
                        ...data,
                        interactionA
                    })
            }, void 0, false, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 214,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Range, {
                label: "Interacción B",
                value: data.interactionB,
                max: 10,
                step: 0.5,
                onChange: (interactionB)=>onChange({
                        ...data,
                        interactionB
                    })
            }, void 0, false, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 215,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Textarea, {
                label: "Mejor para A",
                value: data.bestForA,
                onChange: (bestForA)=>onChange({
                        ...data,
                        bestForA
                    }),
                rows: 2
            }, void 0, false, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 216,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Textarea, {
                label: "Mejor para B",
                value: data.bestForB,
                onChange: (bestForB)=>onChange({
                        ...data,
                        bestForB
                    }),
                rows: 2
            }, void 0, false, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 217,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TextInput, {
                label: "Título de conclusión",
                value: data.conclusionLabel ?? "Ganador / conclusión",
                onChange: (conclusionLabel)=>onChange({
                        ...data,
                        conclusionLabel
                    })
            }, void 0, false, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 218,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Textarea, {
                label: "Ganador / conclusión",
                value: data.winner,
                onChange: (winner)=>onChange({
                        ...data,
                        winner
                    })
            }, void 0, false, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 219,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/EditorPanel.tsx",
        lineNumber: 199,
        columnNumber: 5
    }, this);
}
function ListEditor({ title, values, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-bold text-zinc-200",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/components/EditorPanel.tsx",
                        lineNumber: 228,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>onChange([
                                ...values,
                                ""
                            ]),
                        className: "inline-flex items-center gap-2 rounded-md bg-teal-300 px-3 py-2 text-xs font-bold text-zinc-950",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                className: "size-4"
                            }, void 0, false, {
                                fileName: "[project]/components/EditorPanel.tsx",
                                lineNumber: 230,
                                columnNumber: 11
                            }, this),
                            " Añadir"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/EditorPanel.tsx",
                        lineNumber: 229,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 227,
                columnNumber: 7
            }, this),
            values.map((value, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-[1fr_auto] gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            value: value,
                            onChange: (event)=>onChange(values.map((entry, i)=>i === index ? event.target.value : entry)),
                            className: fieldClass
                        }, void 0, false, {
                            fileName: "[project]/components/EditorPanel.tsx",
                            lineNumber: 235,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>onChange(values.filter((_, i)=>i !== index)),
                            className: "grid size-11 place-items-center rounded-md bg-rose-400/18 text-rose-200",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "size-4"
                            }, void 0, false, {
                                fileName: "[project]/components/EditorPanel.tsx",
                                lineNumber: 237,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/EditorPanel.tsx",
                            lineNumber: 236,
                            columnNumber: 11
                        }, this)
                    ]
                }, index, true, {
                    fileName: "[project]/components/EditorPanel.tsx",
                    lineNumber: 234,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/components/EditorPanel.tsx",
        lineNumber: 226,
        columnNumber: 5
    }, this);
}
function ImageField({ label, value, onChange, compact = false }) {
    function handleImage(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ()=>onChange(String(reader.result || ""));
        reader.readAsDataURL(file);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "block",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/components/EditorPanel.tsx",
                        lineNumber: 256,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "file",
                        accept: "image/*",
                        onChange: (event)=>handleImage(event.target.files?.[0] ?? null),
                        className: `block w-full rounded-lg border border-white/10 bg-black/25 text-sm text-zinc-300 file:mr-4 file:rounded-md file:border-0 file:bg-teal-300 file:px-3 file:py-2 file:text-sm file:font-bold file:text-zinc-950 ${compact ? "p-2" : "p-3"}`
                    }, void 0, false, {
                        fileName: "[project]/components/EditorPanel.tsx",
                        lineNumber: 257,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 255,
                columnNumber: 7
            }, this),
            value ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(IconButton, {
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"],
                label: "Quitar imagen",
                onClick: ()=>onChange("")
            }, void 0, false, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 259,
                columnNumber: 16
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/EditorPanel.tsx",
        lineNumber: 254,
        columnNumber: 5
    }, this);
}
function IconButton({ icon: Icon, label, onClick }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: onClick,
        className: "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.055] px-3 py-2 text-sm font-bold text-zinc-100 transition hover:border-teal-300/50 hover:bg-white/[0.09]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                className: "size-4"
            }, void 0, false, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 267,
                columnNumber: 7
            }, this),
            label
        ]
    }, void 0, true, {
        fileName: "[project]/components/EditorPanel.tsx",
        lineNumber: 266,
        columnNumber: 5
    }, this);
}
const fieldClass = "w-full rounded-lg border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-300";
function TextInput({ label, value, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
        label: label,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            value: value,
            onChange: (event)=>onChange(event.target.value),
            className: fieldClass
        }, void 0, false, {
            fileName: "[project]/components/EditorPanel.tsx",
            lineNumber: 276,
            columnNumber: 31
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/EditorPanel.tsx",
        lineNumber: 276,
        columnNumber: 10
    }, this);
}
function NumberInput({ label, value, min, max, step, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
        label: label,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "number",
            min: min,
            max: max,
            step: step,
            value: value,
            onChange: (event)=>onChange(Number(event.target.value)),
            className: fieldClass
        }, void 0, false, {
            fileName: "[project]/components/EditorPanel.tsx",
            lineNumber: 280,
            columnNumber: 31
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/EditorPanel.tsx",
        lineNumber: 280,
        columnNumber: 10
    }, this);
}
function Textarea({ label, value, onChange, rows = 3 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
        label: label,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
            rows: rows,
            value: value,
            onChange: (event)=>onChange(event.target.value),
            className: `${fieldClass} resize-none`
        }, void 0, false, {
            fileName: "[project]/components/EditorPanel.tsx",
            lineNumber: 284,
            columnNumber: 31
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/EditorPanel.tsx",
        lineNumber: 284,
        columnNumber: 10
    }, this);
}
function Select({ label, value, onChange, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
        label: label,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
            value: value,
            onChange: (event)=>onChange(event.target.value),
            className: fieldClass,
            children: children
        }, void 0, false, {
            fileName: "[project]/components/EditorPanel.tsx",
            lineNumber: 288,
            columnNumber: 31
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/EditorPanel.tsx",
        lineNumber: 288,
        columnNumber: 10
    }, this);
}
function Range({ label, value, max, onChange, step = 1 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
        label: `${label}: ${value}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "range",
            min: 0,
            max: max,
            step: step,
            value: value,
            onChange: (event)=>onChange(Number(event.target.value)),
            className: "range-thumb h-2 w-full appearance-none rounded-full bg-white/12 accent-orange-400"
        }, void 0, false, {
            fileName: "[project]/components/EditorPanel.tsx",
            lineNumber: 294,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/EditorPanel.tsx",
        lineNumber: 293,
        columnNumber: 5
    }, this);
}
function Field({ label, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: "block",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400",
                children: label
            }, void 0, false, {
                fileName: "[project]/components/EditorPanel.tsx",
                lineNumber: 302,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/components/EditorPanel.tsx",
        lineNumber: 301,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ExportButton.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ExportButton",
    ()=>ExportButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-ssr] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html$2d$to$2d$image$2f$es$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/html-to-image/es/index.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function ExportButton({ targetRef, fileName }) {
    async function exportPng() {
        const node = targetRef.current;
        if (!node) return;
        node.classList.add("asset-exporting");
        let dataUrl;
        try {
            dataUrl = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html$2d$to$2d$image$2f$es$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toPng"])(node, {
                cacheBust: true,
                pixelRatio: 1,
                backgroundColor: "#111014"
            });
        } finally{
            node.classList.remove("asset-exporting");
        }
        const link = document.createElement("a");
        link.download = fileName;
        link.href = dataUrl;
        link.click();
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: exportPng,
        className: "inline-flex items-center justify-center gap-2 rounded-lg bg-orange-400 px-4 py-3 text-sm font-bold text-zinc-950 transition hover:bg-orange-300",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                className: "size-4"
            }, void 0, false, {
                fileName: "[project]/components/ExportButton.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            "Descargar PNG"
        ]
    }, void 0, true, {
        fileName: "[project]/components/ExportButton.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/AutoFitText.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AutoFitText",
    ()=>AutoFitText
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function AutoFitText({ as: Tag = "span", children, className = "", maxSize, minSize = 16, lines = 1, lineHeight = 1, style }) {
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [fontSize, setFontSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(maxSize);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutEffect"])(()=>{
        const element = ref.current;
        if (!element) return;
        let frame = 0;
        const textFits = ()=>{
            const maxHeightValue = Number.parseFloat(window.getComputedStyle(element).maxHeight);
            const heightIsConstrained = Number.isFinite(maxHeightValue) && element.clientHeight >= maxHeightValue - 1;
            return element.scrollWidth <= element.clientWidth + 1 && (!heightIsConstrained || element.scrollHeight <= element.clientHeight + 1);
        };
        const fit = ()=>{
            element.style.setProperty("--auto-fit-size", `${maxSize}px`);
            let low = minSize;
            let high = maxSize;
            let best = minSize;
            for(let index = 0; index < 9; index += 1){
                const mid = (low + high) / 2;
                element.style.setProperty("--auto-fit-size", `${mid}px`);
                if (textFits()) {
                    best = mid;
                    low = mid;
                } else {
                    high = mid;
                }
            }
            element.style.setProperty("--auto-fit-size", `${best}px`);
            setFontSize(Math.floor(best * 10) / 10);
        };
        const scheduleFit = ()=>{
            window.cancelAnimationFrame(frame);
            frame = window.requestAnimationFrame(fit);
        };
        scheduleFit();
        const resizeObserver = new ResizeObserver(scheduleFit);
        resizeObserver.observe(element);
        document.fonts?.ready.then(scheduleFit);
        return ()=>{
            window.cancelAnimationFrame(frame);
            resizeObserver.disconnect();
        };
    }, [
        children,
        lineHeight,
        lines,
        maxSize,
        minSize
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Tag, {
        ref: ref,
        className: `auto-fit-text ${lines === 1 ? "auto-fit-text-single" : ""} ${className}`,
        style: {
            ...style,
            "--auto-fit-size": `${fontSize}px`,
            "--auto-fit-lines": lines,
            "--auto-fit-line-height": lineHeight
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/components/AutoFitText.tsx",
        lineNumber: 94,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/templates/templateStyles.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clampScore",
    ()=>clampScore,
    "themeClasses",
    ()=>themeClasses
]);
function themeClasses(theme) {
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
            versusCircle: "border-[#17151d] text-[#17151d]"
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
            versusCircle: "border-orange-300 text-orange-200"
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
            versusCircle: "border-[#CBD870] text-[#CBD870]"
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
        versusCircle: "border-orange-300 text-orange-200"
    };
}
function clampScore(value, max = 10) {
    return Math.max(0, Math.min(max, Number.isFinite(value) ? value : 0));
}
}),
"[project]/components/templates/GameCardTemplate.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GameCardTemplate",
    ()=>GameCardTemplate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-ssr] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-ssr] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-ssr] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-ssr] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutoFitText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AutoFitText.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$templates$2f$templateStyles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/templates/templateStyles.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function GameCardTemplate({ data, format, theme, resolution }) {
    const size = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCanvasSize"])(format, resolution);
    const baseSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getBaseCanvasSize"])(format);
    const scale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getResolutionScale"])(resolution);
    const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$templates$2f$templateStyles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["themeClasses"])(theme);
    const vertical = format === "vertical";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            width: size.width,
            height: size.height
        },
        className: `asset-safe relative overflow-hidden ${t.bg}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                width: baseSize.width,
                height: baseSize.height,
                transform: `scale(${scale})`,
                transformOrigin: "top left"
            },
            className: "relative overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 bg-[linear-gradient(115deg,rgba(0,0,0,.34),transparent_48%,rgba(0,0,0,.22)),radial-gradient(circle_at_18%_16%,rgba(249,115,22,.32),transparent_30%),radial-gradient(circle_at_86%_22%,rgba(45,212,191,.22),transparent_28%)]"
                }, void 0, false, {
                    fileName: "[project]/components/templates/GameCardTemplate.tsx",
                    lineNumber: 29,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `absolute inset-x-16 top-14 h-2 rounded-full ${t.topLine}`
                }, void 0, false, {
                    fileName: "[project]/components/templates/GameCardTemplate.tsx",
                    lineNumber: 30,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `relative grid h-full gap-14 p-20 pt-24 ${vertical ? "grid-rows-[auto_1fr_auto]" : "grid-cols-[1fr_820px]"}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "flex min-h-0 flex-col justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: `mb-7 inline-flex rounded-md px-6 py-3 text-3xl font-black uppercase ${t.accent}`,
                                            children: "Ficha técnica"
                                        }, void 0, false, {
                                            fileName: "[project]/components/templates/GameCardTemplate.tsx",
                                            lineNumber: 34,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutoFitText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AutoFitText"], {
                                            as: "h1",
                                            maxSize: vertical ? 96 : 126,
                                            minSize: 42,
                                            lines: 3,
                                            lineHeight: 0.9,
                                            className: "max-w-[1000px] text-balance font-black drop-shadow-[0_8px_18px_rgba(0,0,0,.35)]",
                                            children: data.gameName || "Nombre del juego"
                                        }, void 0, false, {
                                            fileName: "[project]/components/templates/GameCardTemplate.tsx",
                                            lineNumber: 35,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutoFitText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AutoFitText"], {
                                            as: "p",
                                            maxSize: 36,
                                            minSize: 20,
                                            lines: 1,
                                            lineHeight: 1.15,
                                            className: `mt-8 font-bold ${t.muted}`,
                                            children: [
                                                data.publisher || "Editorial",
                                                " · ",
                                                data.year || "Año"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/templates/GameCardTemplate.tsx",
                                            lineNumber: 38,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/templates/GameCardTemplate.tsx",
                                    lineNumber: 33,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `grid gap-5 ${vertical ? "grid-cols-2" : "grid-cols-3"}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Info, {
                                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
                                                    label: "Jugadores",
                                                    value: data.players || "2-4",
                                                    iconClass: t.icon
                                                }, void 0, false, {
                                                    fileName: "[project]/components/templates/GameCardTemplate.tsx",
                                                    lineNumber: 45,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Info, {
                                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"],
                                                    label: "Duración",
                                                    value: data.duration || "45 min",
                                                    iconClass: t.icon
                                                }, void 0, false, {
                                                    fileName: "[project]/components/templates/GameCardTemplate.tsx",
                                                    lineNumber: 46,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Info, {
                                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"],
                                                    label: "Edad",
                                                    value: data.age || "10+",
                                                    iconClass: t.icon
                                                }, void 0, false, {
                                                    fileName: "[project]/components/templates/GameCardTemplate.tsx",
                                                    lineNumber: 47,
                                                    columnNumber: 15
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/templates/GameCardTemplate.tsx",
                                            lineNumber: 44,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Info, {
                                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"],
                                            label: "Tipo / categorías",
                                            value: data.categories || "Familiar",
                                            iconClass: t.icon,
                                            wide: true
                                        }, void 0, false, {
                                            fileName: "[project]/components/templates/GameCardTemplate.tsx",
                                            lineNumber: 49,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/templates/GameCardTemplate.tsx",
                                    lineNumber: 43,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `rounded-lg border p-7 ${t.panel}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-5 flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-3xl font-black uppercase text-white/90",
                                                    children: "Dificultad"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/templates/GameCardTemplate.tsx",
                                                    lineNumber: 54,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "rounded-md bg-black/25 px-5 py-2 text-4xl font-black",
                                                    children: [
                                                        data.difficulty,
                                                        "/5"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/templates/GameCardTemplate.tsx",
                                                    lineNumber: 55,
                                                    columnNumber: 15
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/templates/GameCardTemplate.tsx",
                                            lineNumber: 53,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-5 gap-3",
                                            children: Array.from({
                                                length: 5
                                            }).map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DifficultySegment, {
                                                    value: Math.max(0, Math.min(1, data.difficulty - index)),
                                                    emptyClass: t.line,
                                                    fillClass: t.difficultyFill
                                                }, index, false, {
                                                    fileName: "[project]/components/templates/GameCardTemplate.tsx",
                                                    lineNumber: 59,
                                                    columnNumber: 17
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/templates/GameCardTemplate.tsx",
                                            lineNumber: 57,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/templates/GameCardTemplate.tsx",
                                    lineNumber: 52,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/templates/GameCardTemplate.tsx",
                            lineNumber: 32,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "flex min-h-0 flex-col gap-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `relative min-h-0 flex-1 overflow-hidden rounded-lg border-2 ${t.panel}`,
                                    children: [
                                        data.coverImage ? // eslint-disable-next-line @next/next/no-img-element
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: data.coverImage,
                                            alt: "",
                                            className: "h-full w-full object-cover"
                                        }, void 0, false, {
                                            fileName: "[project]/components/templates/GameCardTemplate.tsx",
                                            lineNumber: 69,
                                            columnNumber: 15
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid h-full place-items-center bg-[linear-gradient(145deg,rgba(20,184,166,.22),rgba(249,115,22,.18))] p-12 text-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `mx-auto mb-8 grid size-56 place-items-center rounded-lg border border-white/20 bg-black/24 text-9xl font-black ${t.placeholderMark}`,
                                                        children: "M"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/templates/GameCardTemplate.tsx",
                                                        lineNumber: 73,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: `text-5xl font-black ${t.muted}`,
                                                        children: "Portada del juego"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/templates/GameCardTemplate.tsx",
                                                        lineNumber: 74,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/templates/GameCardTemplate.tsx",
                                                lineNumber: 72,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/templates/GameCardTemplate.tsx",
                                            lineNumber: 71,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/55 to-transparent"
                                        }, void 0, false, {
                                            fileName: "[project]/components/templates/GameCardTemplate.tsx",
                                            lineNumber: 78,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/templates/GameCardTemplate.tsx",
                                    lineNumber: 66,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `rounded-lg border p-8 ${t.panel}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: `text-3xl font-black uppercase ${t.muted}`,
                                            children: "¿Para quién es el juego?"
                                        }, void 0, false, {
                                            fileName: "[project]/components/templates/GameCardTemplate.tsx",
                                            lineNumber: 81,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutoFitText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AutoFitText"], {
                                            as: "p",
                                            maxSize: 48,
                                            minSize: 22,
                                            lines: 3,
                                            lineHeight: 1.25,
                                            className: "mt-3 font-black text-pretty",
                                            children: data.verdict || "Un cierre memorable para la reseña."
                                        }, void 0, false, {
                                            fileName: "[project]/components/templates/GameCardTemplate.tsx",
                                            lineNumber: 82,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/templates/GameCardTemplate.tsx",
                                    lineNumber: 80,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/templates/GameCardTemplate.tsx",
                            lineNumber: 65,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/templates/GameCardTemplate.tsx",
                    lineNumber: 31,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/templates/GameCardTemplate.tsx",
            lineNumber: 28,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/templates/GameCardTemplate.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
function DifficultySegment({ value, emptyClass, fillClass }) {
    const fill = value >= 1 ? "100%" : value >= 0.5 ? "50%" : "0%";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `h-9 overflow-hidden rounded-full ${emptyClass}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `h-full rounded-full ${fillClass}`,
            style: {
                width: fill
            }
        }, void 0, false, {
            fileName: "[project]/components/templates/GameCardTemplate.tsx",
            lineNumber: 98,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/templates/GameCardTemplate.tsx",
        lineNumber: 97,
        columnNumber: 5
    }, this);
}
function Info({ icon: Icon, label, value, iconClass, wide = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${wide ? "min-h-32" : "min-h-40"} rounded-lg border border-white/12 bg-black/28 p-5 shadow-[0_18px_44px_rgba(0,0,0,.24)]`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                className: `mb-4 size-10 ${iconClass}`
            }, void 0, false, {
                fileName: "[project]/components/templates/GameCardTemplate.tsx",
                lineNumber: 118,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-2xl font-bold uppercase text-zinc-300/90",
                children: label
            }, void 0, false, {
                fileName: "[project]/components/templates/GameCardTemplate.tsx",
                lineNumber: 119,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutoFitText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AutoFitText"], {
                as: "p",
                maxSize: wide ? 30 : 26,
                minSize: 16,
                lines: wide ? 2 : 3,
                lineHeight: 1.2,
                className: "mt-1 break-words font-black",
                children: value
            }, void 0, false, {
                fileName: "[project]/components/templates/GameCardTemplate.tsx",
                lineNumber: 120,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/templates/GameCardTemplate.tsx",
        lineNumber: 117,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/templates/ProsConsTemplate.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProsConsTemplate",
    ()=>ProsConsTemplate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/minus.js [app-ssr] (ecmascript) <export default as Minus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutoFitText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AutoFitText.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$templates$2f$templateStyles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/templates/templateStyles.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function ProsConsTemplate({ data, format, theme, resolution }) {
    const size = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCanvasSize"])(format, resolution);
    const baseSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getBaseCanvasSize"])(format);
    const scale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getResolutionScale"])(resolution);
    const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$templates$2f$templateStyles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["themeClasses"])(theme);
    const vertical = format === "vertical";
    const instagram = format === "instagram";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            width: size.width,
            height: size.height
        },
        className: `asset-safe relative overflow-hidden ${t.bg}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                width: baseSize.width,
                height: baseSize.height,
                transform: `scale(${scale})`,
                transformOrigin: "top left"
            },
            className: "relative overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 bg-[linear-gradient(90deg,rgba(16,185,129,.12),transparent_48%,rgba(244,63,94,.12)),radial-gradient(circle_at_20%_12%,rgba(34,197,94,.28),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(248,113,113,.24),transparent_28%)]"
                }, void 0, false, {
                    fileName: "[project]/components/templates/ProsConsTemplate.tsx",
                    lineNumber: 20,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `relative flex h-full flex-col ${instagram ? "p-12" : "p-20"}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `mb-8 grid gap-8 ${instagram ? "grid-cols-[1fr_330px] items-stretch" : "grid-cols-[1fr_420px] items-end"}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: `mb-6 w-fit rounded-md px-6 py-3 text-3xl font-black uppercase ${t.accent}`,
                                            children: "Pros y contras"
                                        }, void 0, false, {
                                            fileName: "[project]/components/templates/ProsConsTemplate.tsx",
                                            lineNumber: 24,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutoFitText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AutoFitText"], {
                                            as: "h1",
                                            maxSize: instagram ? 74 : vertical ? 92 : 108,
                                            minSize: 34,
                                            lines: instagram ? 3 : 2,
                                            lineHeight: 0.9,
                                            className: "max-w-[1320px] text-balance font-black drop-shadow-[0_8px_18px_rgba(0,0,0,.35)]",
                                            children: data.gameName || "Nombre del juego"
                                        }, void 0, false, {
                                            fileName: "[project]/components/templates/ProsConsTemplate.tsx",
                                            lineNumber: 25,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/templates/ProsConsTemplate.tsx",
                                    lineNumber: 23,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CoverPanel, {
                                    image: data.coverImage,
                                    placeholder: "Portada",
                                    panel: t.panel,
                                    markClass: t.placeholderMark
                                }, void 0, false, {
                                    fileName: "[project]/components/templates/ProsConsTemplate.tsx",
                                    lineNumber: 29,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/templates/ProsConsTemplate.tsx",
                            lineNumber: 22,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `grid flex-1 gap-6 ${vertical || instagram ? "grid-rows-2" : "grid-cols-2"}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Column, {
                                    title: "Lo mejor",
                                    items: data.pros,
                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"],
                                    tone: "good",
                                    panel: t.panel,
                                    muted: t.muted,
                                    headerClass: t.prosHeader,
                                    badgeClass: t.prosBadge,
                                    compact: instagram
                                }, void 0, false, {
                                    fileName: "[project]/components/templates/ProsConsTemplate.tsx",
                                    lineNumber: 32,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Column, {
                                    title: "Lo peor",
                                    items: data.cons,
                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"],
                                    tone: "bad",
                                    panel: t.panel,
                                    muted: t.muted,
                                    headerClass: t.consHeader,
                                    badgeClass: t.consBadge,
                                    compact: instagram
                                }, void 0, false, {
                                    fileName: "[project]/components/templates/ProsConsTemplate.tsx",
                                    lineNumber: 33,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/templates/ProsConsTemplate.tsx",
                            lineNumber: 31,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `mt-6 rounded-lg border ${instagram ? "p-6" : "p-8"} ${t.panel}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: `text-3xl font-black uppercase ${t.muted}`,
                                    children: "Veredicto"
                                }, void 0, false, {
                                    fileName: "[project]/components/templates/ProsConsTemplate.tsx",
                                    lineNumber: 36,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutoFitText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AutoFitText"], {
                                    as: "p",
                                    maxSize: instagram ? 38 : 48,
                                    minSize: 20,
                                    lines: instagram ? 2 : 3,
                                    lineHeight: 1.18,
                                    className: "mt-2 font-black text-pretty",
                                    children: data.verdict || "Una conclusión breve y contundente."
                                }, void 0, false, {
                                    fileName: "[project]/components/templates/ProsConsTemplate.tsx",
                                    lineNumber: 37,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/templates/ProsConsTemplate.tsx",
                            lineNumber: 35,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/templates/ProsConsTemplate.tsx",
                    lineNumber: 21,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/templates/ProsConsTemplate.tsx",
            lineNumber: 19,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/templates/ProsConsTemplate.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
function Column({ title, items, icon: Icon, tone, panel, muted, headerClass, badgeClass, compact = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: `overflow-hidden rounded-lg border ${panel}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `flex items-center gap-5 ${compact ? "px-6 py-5" : "px-8 py-7"} ${headerClass}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `grid ${compact ? "size-13" : "size-16"} place-items-center rounded-md bg-black/16`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                            className: compact ? "size-8" : "size-10"
                        }, void 0, false, {
                            fileName: "[project]/components/templates/ProsConsTemplate.tsx",
                            lineNumber: 72,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/templates/ProsConsTemplate.tsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: `${compact ? "text-5xl" : "text-6xl"} font-black`,
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/components/templates/ProsConsTemplate.tsx",
                        lineNumber: 74,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/templates/ProsConsTemplate.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${compact ? "space-y-3 p-5" : "space-y-5 p-8"}`,
                children: [
                    (items.length ? items : [
                        "Añade un punto clave"
                    ]).slice(0, 5).map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `grid items-center rounded-md bg-black/20 ${compact ? "grid-cols-[56px_1fr] gap-4 p-4" : "grid-cols-[72px_1fr] gap-5 p-5"}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `grid place-items-center rounded-md font-black ${compact ? "size-12 text-2xl" : "size-16 text-3xl"} ${badgeClass}`,
                                    children: index + 1
                                }, void 0, false, {
                                    fileName: "[project]/components/templates/ProsConsTemplate.tsx",
                                    lineNumber: 79,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutoFitText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AutoFitText"], {
                                    maxSize: compact ? 30 : 36,
                                    minSize: 16,
                                    lines: 2,
                                    lineHeight: 1.15,
                                    className: "font-black text-pretty",
                                    children: item
                                }, void 0, false, {
                                    fileName: "[project]/components/templates/ProsConsTemplate.tsx",
                                    lineNumber: 82,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, `${item}-${index}`, true, {
                            fileName: "[project]/components/templates/ProsConsTemplate.tsx",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: `pt-1 text-2xl font-bold uppercase ${muted}`,
                        children: tone === "good" ? "Fortalezas claras" : "Puntos a vigilar"
                    }, void 0, false, {
                        fileName: "[project]/components/templates/ProsConsTemplate.tsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/templates/ProsConsTemplate.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/templates/ProsConsTemplate.tsx",
        lineNumber: 69,
        columnNumber: 5
    }, this);
}
function CoverPanel({ image, placeholder, panel, markClass }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `relative min-h-0 overflow-hidden rounded-lg border ${panel}`,
        children: [
            image ? // eslint-disable-next-line @next/next/no-img-element
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: image,
                alt: "",
                className: "h-full w-full object-cover"
            }, void 0, false, {
                fileName: "[project]/components/templates/ProsConsTemplate.tsx",
                lineNumber: 98,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid h-full min-h-52 place-items-center bg-black/24 p-6 text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `mx-auto mb-4 grid size-24 place-items-center rounded-md border border-white/20 bg-black/24 text-5xl font-black ${markClass}`,
                            children: "M"
                        }, void 0, false, {
                            fileName: "[project]/components/templates/ProsConsTemplate.tsx",
                            lineNumber: 102,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-2xl font-black text-white/75",
                            children: placeholder
                        }, void 0, false, {
                            fileName: "[project]/components/templates/ProsConsTemplate.tsx",
                            lineNumber: 103,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/templates/ProsConsTemplate.tsx",
                    lineNumber: 101,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/templates/ProsConsTemplate.tsx",
                lineNumber: 100,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent"
            }, void 0, false, {
                fileName: "[project]/components/templates/ProsConsTemplate.tsx",
                lineNumber: 107,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/templates/ProsConsTemplate.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/templates/RankingTemplate.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RankingTemplate",
    ()=>RankingTemplate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutoFitText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AutoFitText.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$templates$2f$templateStyles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/templates/templateStyles.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function RankingTemplate({ data, format, theme, resolution }) {
    const size = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCanvasSize"])(format, resolution);
    const baseSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getBaseCanvasSize"])(format);
    const scale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getResolutionScale"])(resolution);
    const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$templates$2f$templateStyles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["themeClasses"])(theme);
    const vertical = format === "vertical";
    const instagram = format === "instagram";
    const items = data.items.slice(0, 10);
    const layoutClass = instagram ? "grid-cols-1" : vertical ? "grid-cols-1" : "grid-cols-2";
    const titleLines = instagram ? 2 : vertical ? 2 : 1;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            width: size.width,
            height: size.height
        },
        className: `asset-safe relative overflow-hidden ${t.bg}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                width: baseSize.width,
                height: baseSize.height,
                transform: `scale(${scale})`,
                transformOrigin: "top left"
            },
            className: "relative overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,.32),transparent_45%,rgba(0,0,0,.22)),radial-gradient(circle_at_12%_18%,rgba(250,204,21,.30),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(34,197,94,.20),transparent_27%)]"
                }, void 0, false, {
                    fileName: "[project]/components/templates/RankingTemplate.tsx",
                    lineNumber: 22,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `absolute inset-x-16 top-14 h-2 rounded-full ${t.topLine}`
                }, void 0, false, {
                    fileName: "[project]/components/templates/RankingTemplate.tsx",
                    lineNumber: 23,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `relative flex h-full flex-col ${instagram ? "p-12 pt-16" : "p-20 pt-24"}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: `mb-5 w-fit rounded-md px-6 py-3 text-3xl font-black uppercase ${t.accent}`,
                            children: "Ranking Top"
                        }, void 0, false, {
                            fileName: "[project]/components/templates/RankingTemplate.tsx",
                            lineNumber: 25,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutoFitText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AutoFitText"], {
                            as: "h1",
                            maxSize: instagram ? 76 : vertical ? 96 : 104,
                            minSize: 34,
                            lines: titleLines,
                            lineHeight: 0.9,
                            className: "max-w-[1500px] text-balance font-black drop-shadow-[0_8px_18px_rgba(0,0,0,.35)]",
                            children: data.title || "Título del ranking"
                        }, void 0, false, {
                            fileName: "[project]/components/templates/RankingTemplate.tsx",
                            lineNumber: 26,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `mt-8 grid flex-1 auto-rows-fr gap-4 ${layoutClass}`,
                            children: (items.length ? items : [
                                {
                                    position: 1,
                                    name: "Juego destacado",
                                    comment: "Comentario breve"
                                }
                            ]).map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                    className: `grid grid-cols-[116px_1fr] items-center overflow-hidden rounded-lg border ${t.panel}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `relative grid h-full min-h-20 place-items-center overflow-hidden text-5xl font-black shadow-[10px_0_30px_rgba(0,0,0,.18)] ${t.rankingNumber}`,
                                            children: [
                                                item.coverImage ? // eslint-disable-next-line @next/next/no-img-element
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: item.coverImage,
                                                    alt: "",
                                                    className: "absolute inset-0 h-full w-full object-cover opacity-35 mix-blend-multiply"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/templates/RankingTemplate.tsx",
                                                    lineNumber: 35,
                                                    columnNumber: 19
                                                }, this) : null,
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "relative z-10 drop-shadow-[0_3px_10px_rgba(0,0,0,.6)]",
                                                    children: [
                                                        "#",
                                                        item.position || index + 1
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/templates/RankingTemplate.tsx",
                                                    lineNumber: 37,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/templates/RankingTemplate.tsx",
                                            lineNumber: 32,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `flex min-h-0 min-w-0 flex-col px-7 py-4 ${item.comment ? "justify-center" : "justify-center text-center"}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutoFitText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AutoFitText"], {
                                                    as: "h2",
                                                    maxSize: item.comment ? 42 : 52,
                                                    minSize: 20,
                                                    lines: item.comment ? 1 : 2,
                                                    lineHeight: item.comment ? 1 : 0.95,
                                                    className: "font-black",
                                                    children: item.name || "Nombre del juego"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/templates/RankingTemplate.tsx",
                                                    lineNumber: 40,
                                                    columnNumber: 17
                                                }, this),
                                                item.comment ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutoFitText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AutoFitText"], {
                                                    as: "p",
                                                    maxSize: 26,
                                                    minSize: 14,
                                                    lines: 2,
                                                    lineHeight: 1.15,
                                                    className: `mt-2 font-bold ${t.muted}`,
                                                    children: item.comment
                                                }, void 0, false, {
                                                    fileName: "[project]/components/templates/RankingTemplate.tsx",
                                                    lineNumber: 44,
                                                    columnNumber: 19
                                                }, this) : null
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/templates/RankingTemplate.tsx",
                                            lineNumber: 39,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, `${item.position}-${item.name}-${index}`, true, {
                                    fileName: "[project]/components/templates/RankingTemplate.tsx",
                                    lineNumber: 31,
                                    columnNumber: 13
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/templates/RankingTemplate.tsx",
                            lineNumber: 29,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/templates/RankingTemplate.tsx",
                    lineNumber: 24,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/templates/RankingTemplate.tsx",
            lineNumber: 21,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/templates/RankingTemplate.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/templates/ScoreTemplate.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ScoreTemplate",
    ()=>ScoreTemplate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutoFitText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AutoFitText.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$templates$2f$templateStyles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/templates/templateStyles.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function ScoreTemplate({ data, format, theme, resolution }) {
    const size = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCanvasSize"])(format, resolution);
    const baseSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getBaseCanvasSize"])(format);
    const scale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getResolutionScale"])(resolution);
    const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$templates$2f$templateStyles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["themeClasses"])(theme);
    const vertical = format === "vertical";
    const lowerThird = data.layout === "lower-third";
    const finalScore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$templates$2f$templateStyles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clampScore"])(data.finalScore);
    const duration = Math.max(0.3, Math.min(8, data.animationDuration || 1.6));
    const criteria = data.criteria.length ? data.criteria.slice(0, lowerThird ? data.criteria.length : 8) : [
        {
            id: "empty",
            name: "Criterio",
            value: 7
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            width: size.width,
            height: size.height,
            "--score-animation-duration": `${duration}s`
        },
        className: `asset-safe score-template relative overflow-hidden ${t.bg}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                width: baseSize.width,
                height: baseSize.height,
                transform: `scale(${scale})`,
                transformOrigin: "top left"
            },
            className: "jsx-eab719801c72fa97" + " " + "relative overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    id: "eab719801c72fa97",
                    children: ".score-template .score-fill{transform-origin:0;animation:score-fill var(--score-animation-duration,1.6s) cubic-bezier(.16, 1, .3, 1) forwards;transform:scaleX(0)}.score-template .score-pop,.score-template .score-label{opacity:0;animation:.5s ease-out forwards score-pop;animation-delay:calc(var(--score-animation-duration,1.6s) + .14s);transform:translateY(18px)scale(.98)}.score-template .score-label{animation-delay:calc(var(--score-animation-duration,1.6s) + .26s)}.asset-exporting .score-fill,.asset-recording .score-fill{animation:none}.asset-exporting .score-fill{transform:scaleX(1)}.asset-recording .score-fill{transform:scaleX(var(--score-progress,0))}.asset-exporting .score-pop,.asset-exporting .score-label,.asset-recording .score-pop,.asset-recording .score-label{opacity:var(--score-reveal,1);transform:translateY(calc((1 - var(--score-reveal,1)) * 18px)) scale(calc(.98 + (var(--score-reveal,1) * .02)));animation:none}@keyframes score-fill{0%{transform:scaleX(0)}to{transform:scaleX(1)}}@keyframes score-pop{to{opacity:1;transform:translateY(0)scale(1)}}"
                }, void 0, false, void 0, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-eab719801c72fa97" + " " + "absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,.3),transparent_42%,rgba(0,0,0,.25)),radial-gradient(circle_at_24%_18%,rgba(249,115,22,.30),transparent_30%),radial-gradient(circle_at_84%_80%,rgba(45,212,191,.20),transparent_32%)]"
                }, void 0, false, {
                    fileName: "[project]/components/templates/ScoreTemplate.tsx",
                    lineNumber: 93,
                    columnNumber: 9
                }, this),
                lowerThird ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LowerThirdScore, {
                    data: data,
                    criteria: criteria,
                    finalScore: finalScore,
                    theme: t
                }, void 0, false, {
                    fileName: "[project]/components/templates/ScoreTemplate.tsx",
                    lineNumber: 95,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FullScore, {
                    data: data,
                    criteria: criteria,
                    finalScore: finalScore,
                    theme: t,
                    vertical: vertical
                }, void 0, false, {
                    fileName: "[project]/components/templates/ScoreTemplate.tsx",
                    lineNumber: 97,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/templates/ScoreTemplate.tsx",
            lineNumber: 34,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/templates/ScoreTemplate.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
function FullScore({ data, criteria, finalScore, theme, vertical }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `relative grid h-full gap-10 p-16 ${vertical ? "grid-rows-[auto_1fr_auto]" : "grid-cols-[1.16fr_.84fr]"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "flex min-h-0 flex-col",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: `mb-5 w-fit rounded-md px-6 py-3 text-3xl font-black uppercase ${theme.accent}`,
                        children: "Puntuación final"
                    }, void 0, false, {
                        fileName: "[project]/components/templates/ScoreTemplate.tsx",
                        lineNumber: 120,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutoFitText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AutoFitText"], {
                        as: "h1",
                        maxSize: vertical ? 96 : 96,
                        minSize: 38,
                        lines: 3,
                        lineHeight: 0.9,
                        className: "max-w-[1040px] text-balance font-black drop-shadow-[0_8px_18px_rgba(0,0,0,.35)]",
                        children: data.gameName || "Nombre del juego"
                    }, void 0, false, {
                        fileName: "[project]/components/templates/ScoreTemplate.tsx",
                        lineNumber: 121,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-8 flex-1 space-y-4",
                        children: criteria.map((criterion, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ScoreBar, {
                                delay: barDelay(data, index),
                                label: criterion.name,
                                value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$templates$2f$templateStyles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clampScore"])(criterion.value),
                                fillClass: theme.scoreFill
                            }, criterion.id, false, {
                                fileName: "[project]/components/templates/ScoreTemplate.tsx",
                                lineNumber: 126,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/templates/ScoreTemplate.tsx",
                        lineNumber: 124,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/templates/ScoreTemplate.tsx",
                lineNumber: 119,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: `relative overflow-hidden rounded-lg border p-8 ${theme.panel}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `absolute inset-x-0 top-0 h-5 ${theme.scoreTopLine}`
                    }, void 0, false, {
                        fileName: "[project]/components/templates/ScoreTemplate.tsx",
                        lineNumber: 131,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-full flex-col justify-between pt-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: `text-4xl font-black uppercase ${theme.muted}`,
                                        children: "Nota final"
                                    }, void 0, false, {
                                        fileName: "[project]/components/templates/ScoreTemplate.tsx",
                                        lineNumber: 134,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `score-pop mt-6 grid aspect-square place-items-center rounded-full border-[14px] bg-black/24 shadow-[inset_0_0_80px_rgba(249,115,22,.16)] ${theme.scoreBorder}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[176px] font-black leading-none",
                                            children: finalScore.toFixed(1)
                                        }, void 0, false, {
                                            fileName: "[project]/components/templates/ScoreTemplate.tsx",
                                            lineNumber: 136,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/templates/ScoreTemplate.tsx",
                                        lineNumber: 135,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/templates/ScoreTemplate.tsx",
                                lineNumber: 133,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: `mb-5 h-3 rounded-full ${theme.line}`
                                    }, void 0, false, {
                                        fileName: "[project]/components/templates/ScoreTemplate.tsx",
                                        lineNumber: 140,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutoFitText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AutoFitText"], {
                                        as: "p",
                                        maxSize: 60,
                                        minSize: 24,
                                        lines: 3,
                                        lineHeight: 0.95,
                                        className: "score-label font-black text-pretty",
                                        children: data.finalLabel || "Etiqueta final"
                                    }, void 0, false, {
                                        fileName: "[project]/components/templates/ScoreTemplate.tsx",
                                        lineNumber: 141,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/templates/ScoreTemplate.tsx",
                                lineNumber: 139,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/templates/ScoreTemplate.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/templates/ScoreTemplate.tsx",
                lineNumber: 130,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/templates/ScoreTemplate.tsx",
        lineNumber: 118,
        columnNumber: 5
    }, this);
}
function LowerThirdScore({ data, criteria, finalScore, theme }) {
    const columnCount = Math.max(1, Math.ceil(criteria.length / 2));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute inset-x-12 bottom-10 grid h-[320px] grid-cols-[430px_minmax(0,1fr)_260px] items-center gap-8 rounded-lg border border-white/15 bg-black/62 p-8 shadow-[0_-28px_90px_rgba(0,0,0,.42)] backdrop-blur-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: `mb-3 w-fit rounded-md px-4 py-2 text-2xl font-black uppercase ${theme.accent}`,
                        children: "Puntuación"
                    }, void 0, false, {
                        fileName: "[project]/components/templates/ScoreTemplate.tsx",
                        lineNumber: 167,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutoFitText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AutoFitText"], {
                        as: "h1",
                        maxSize: 54,
                        minSize: 24,
                        lines: 2,
                        lineHeight: 0.92,
                        className: "font-black",
                        children: data.gameName || "Nombre del juego"
                    }, void 0, false, {
                        fileName: "[project]/components/templates/ScoreTemplate.tsx",
                        lineNumber: 168,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutoFitText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AutoFitText"], {
                        as: "p",
                        maxSize: 30,
                        minSize: 16,
                        lines: 2,
                        lineHeight: 1.2,
                        className: `score-label mt-4 font-black ${theme.muted}`,
                        children: data.finalLabel || "Etiqueta final"
                    }, void 0, false, {
                        fileName: "[project]/components/templates/ScoreTemplate.tsx",
                        lineNumber: 171,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/templates/ScoreTemplate.tsx",
                lineNumber: 166,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid min-w-0 grid-rows-2 gap-4",
                style: {
                    gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`
                },
                children: criteria.map((criterion, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CompactScoreBar, {
                        delay: barDelay(data, index),
                        label: criterion.name,
                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$templates$2f$templateStyles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clampScore"])(criterion.value),
                        fillClass: theme.scoreFill
                    }, criterion.id, false, {
                        fileName: "[project]/components/templates/ScoreTemplate.tsx",
                        lineNumber: 177,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/templates/ScoreTemplate.tsx",
                lineNumber: 175,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `score-pop grid h-[220px] w-[220px] place-self-center place-items-center rounded-lg border-[10px] bg-black/24 ${theme.panel} ${theme.scoreBorder}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: `text-2xl font-black uppercase ${theme.muted}`,
                            children: "Nota"
                        }, void 0, false, {
                            fileName: "[project]/components/templates/ScoreTemplate.tsx",
                            lineNumber: 182,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[78px] font-black leading-none",
                            children: finalScore.toFixed(1)
                        }, void 0, false, {
                            fileName: "[project]/components/templates/ScoreTemplate.tsx",
                            lineNumber: 183,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/templates/ScoreTemplate.tsx",
                    lineNumber: 181,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/templates/ScoreTemplate.tsx",
                lineNumber: 180,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/templates/ScoreTemplate.tsx",
        lineNumber: 165,
        columnNumber: 5
    }, this);
}
function ScoreBar({ label, value, delay, fillClass }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-lg border border-white/10 bg-black/20 p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-3 flex items-end justify-between gap-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutoFitText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AutoFitText"], {
                        maxSize: 30,
                        minSize: 16,
                        lines: 1,
                        lineHeight: 1,
                        className: "font-black",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/components/templates/ScoreTemplate.tsx",
                        lineNumber: 194,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "rounded-md bg-white/12 px-4 py-2 text-4xl font-black leading-none",
                        children: [
                            value,
                            "/10"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/templates/ScoreTemplate.tsx",
                        lineNumber: 197,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/templates/ScoreTemplate.tsx",
                lineNumber: 193,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-8 overflow-hidden rounded-full bg-white/12",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `score-fill h-full rounded-full shadow-[0_0_32px_rgba(250,204,21,.32)] ${fillClass}`,
                    style: {
                        width: `${value * 10}%`,
                        animationDelay: `${delay}s`
                    }
                }, void 0, false, {
                    fileName: "[project]/components/templates/ScoreTemplate.tsx",
                    lineNumber: 200,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/templates/ScoreTemplate.tsx",
                lineNumber: 199,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/templates/ScoreTemplate.tsx",
        lineNumber: 192,
        columnNumber: 5
    }, this);
}
function CompactScoreBar({ label, value, delay, fillClass }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-w-0 rounded-md border border-white/10 bg-black/22 p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-2 flex items-center justify-between gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutoFitText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AutoFitText"], {
                        maxSize: 20,
                        minSize: 12,
                        lines: 1,
                        lineHeight: 1,
                        className: "font-black",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/components/templates/ScoreTemplate.tsx",
                        lineNumber: 210,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-2xl font-black",
                        children: [
                            value,
                            "/10"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/templates/ScoreTemplate.tsx",
                        lineNumber: 213,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/templates/ScoreTemplate.tsx",
                lineNumber: 209,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-6 overflow-hidden rounded-full bg-white/12",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `score-fill h-full rounded-full ${fillClass}`,
                    style: {
                        width: `${value * 10}%`,
                        animationDelay: `${delay}s`
                    }
                }, void 0, false, {
                    fileName: "[project]/components/templates/ScoreTemplate.tsx",
                    lineNumber: 216,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/templates/ScoreTemplate.tsx",
                lineNumber: 215,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/templates/ScoreTemplate.tsx",
        lineNumber: 208,
        columnNumber: 5
    }, this);
}
function barDelay(data, index) {
    return data.animationMode === "sequential" ? index * Math.max(0.12, data.animationDuration / Math.max(1, data.criteria.length) * 0.45) : 0;
}
}),
"[project]/components/PreviewPanel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PreviewPanel",
    ()=>PreviewPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$templates$2f$GameCardTemplate$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/templates/GameCardTemplate.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$templates$2f$ProsConsTemplate$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/templates/ProsConsTemplate.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$templates$2f$RankingTemplate$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/templates/RankingTemplate.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$templates$2f$ScoreTemplate$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/templates/ScoreTemplate.tsx [app-ssr] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module './templates/VersusTemplate'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
"use client";
;
;
;
;
;
;
;
;
const PreviewPanel = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(function PreviewPanel({ project, animationNonce = 0 }, ref) {
    const wrapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [scale, setScale] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0.4);
    const size = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCanvasSize"])(project.format, project.resolution);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const wrap = wrapRef.current;
        if (!wrap) return;
        const observer = new ResizeObserver(([entry])=>{
            const width = entry.contentRect.width;
            setScale(Math.min(1, width / size.width));
        });
        observer.observe(wrap);
        return ()=>observer.disconnect();
    }, [
        size.width
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-lg border border-white/10 bg-black/18 p-3 shadow-2xl",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ref: wrapRef,
            className: "overflow-hidden rounded-md",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: size.width * scale,
                    height: size.height * scale
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        transform: `scale(${scale})`,
                        transformOrigin: "top left"
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: ref,
                        style: {
                            width: size.width,
                            height: size.height
                        },
                        children: [
                            project.template === "game-card" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$templates$2f$GameCardTemplate$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GameCardTemplate"], {
                                data: project.data["game-card"],
                                format: project.format,
                                theme: project.theme,
                                resolution: project.resolution
                            }, void 0, false, {
                                fileName: "[project]/components/PreviewPanel.tsx",
                                lineNumber: 39,
                                columnNumber: 51
                            }, this) : null,
                            project.template === "pros-cons" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$templates$2f$ProsConsTemplate$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProsConsTemplate"], {
                                data: project.data["pros-cons"],
                                format: project.format,
                                theme: project.theme,
                                resolution: project.resolution
                            }, void 0, false, {
                                fileName: "[project]/components/PreviewPanel.tsx",
                                lineNumber: 40,
                                columnNumber: 51
                            }, this) : null,
                            project.template === "score" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$templates$2f$ScoreTemplate$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ScoreTemplate"], {
                                data: project.data.score,
                                format: project.format,
                                theme: project.theme,
                                resolution: project.resolution
                            }, animationNonce, false, {
                                fileName: "[project]/components/PreviewPanel.tsx",
                                lineNumber: 41,
                                columnNumber: 47
                            }, this) : null,
                            project.template === "ranking" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$templates$2f$RankingTemplate$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RankingTemplate"], {
                                data: project.data.ranking,
                                format: project.format,
                                theme: project.theme,
                                resolution: project.resolution
                            }, void 0, false, {
                                fileName: "[project]/components/PreviewPanel.tsx",
                                lineNumber: 42,
                                columnNumber: 49
                            }, this) : null,
                            project.template === "versus" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(VersusTemplate, {
                                data: project.data.versus,
                                format: project.format,
                                theme: project.theme,
                                resolution: project.resolution
                            }, void 0, false, {
                                fileName: "[project]/components/PreviewPanel.tsx",
                                lineNumber: 43,
                                columnNumber: 48
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/PreviewPanel.tsx",
                        lineNumber: 38,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/PreviewPanel.tsx",
                    lineNumber: 37,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/PreviewPanel.tsx",
                lineNumber: 36,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/PreviewPanel.tsx",
            lineNumber: 35,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/PreviewPanel.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
});
}),
"[project]/components/TemplateSelector.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TemplateSelector",
    ()=>TemplateSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$badge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileBadge$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-badge.js [app-ssr] (ecmascript) <export default as FileBadge>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2d$checks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ListChecks$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/list-checks.js [app-ssr] (ecmascript) <export default as ListChecks>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$medal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Medal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/medal.js [app-ssr] (ecmascript) <export default as Medal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$swords$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Swords$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/swords.js [app-ssr] (ecmascript) <export default as Swords>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trophy.js [app-ssr] (ecmascript) <export default as Trophy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/types.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const icons = {
    "game-card": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$badge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileBadge$3e$__["FileBadge"],
    "pros-cons": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2d$checks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ListChecks$3e$__["ListChecks"],
    score: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$medal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Medal$3e$__["Medal"],
    ranking: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__["Trophy"],
    versus: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$swords$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Swords$3e$__["Swords"]
};
function TemplateSelector({ value, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-2 gap-2 lg:grid-cols-5",
        children: Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TEMPLATE_LABELS"]).map((template)=>{
            const Icon = icons[template];
            const active = value === template;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>onChange(template),
                className: `flex min-h-20 items-center gap-3 rounded-lg border px-3 text-left text-sm transition ${active ? "border-orange-300 bg-orange-400/15 text-white shadow-[0_0_0_1px_rgba(251,146,60,.25)]" : "border-white/10 bg-white/[0.04] text-zinc-300 hover:border-teal-300/50 hover:bg-white/[0.07]"}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `grid size-9 shrink-0 place-items-center rounded-md ${active ? "bg-orange-400 text-zinc-950" : "bg-white/8 text-teal-200"}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                            className: "size-5"
                        }, void 0, false, {
                            fileName: "[project]/components/TemplateSelector.tsx",
                            lineNumber: 39,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/TemplateSelector.tsx",
                        lineNumber: 38,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-medium leading-tight",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TEMPLATE_LABELS"][template]
                    }, void 0, false, {
                        fileName: "[project]/components/TemplateSelector.tsx",
                        lineNumber: 41,
                        columnNumber: 13
                    }, this)
                ]
            }, template, true, {
                fileName: "[project]/components/TemplateSelector.tsx",
                lineNumber: 28,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/components/TemplateSelector.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
}),
"[project]/lib/filename.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getProjectFileName",
    ()=>getProjectFileName
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/types.ts [app-ssr] (ecmascript)");
;
function slugify(value) {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "").slice(0, 70);
}
function getProjectFileName(project) {
    let name;
    switch(project.template){
        case "ranking":
            name = project.data.ranking.title;
            break;
        case "versus":
            name = `${project.data.versus.gameA} vs ${project.data.versus.gameB}`;
            break;
        case "game-card":
            name = project.data["game-card"].gameName;
            break;
        case "pros-cons":
            name = project.data["pros-cons"].gameName;
            break;
        case "score":
            name = project.data.score.gameName;
            break;
    }
    const template = slugify(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TEMPLATE_LABELS"][project.template]);
    return `${slugify(name) || "meeplemotion"}-${template}.png`;
}
}),
"[project]/lib/hydrateProject.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hydrateProject",
    ()=>hydrateProject
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/demoData.ts [app-ssr] (ecmascript)");
;
function hydrateProject(project) {
    const legacyScore = project.data.score;
    const criteria = Array.isArray(legacyScore.criteria) && legacyScore.criteria.length > 0 ? legacyScore.criteria : legacyCriteriaFrom(legacyScore);
    return {
        ...project,
        resolution: project.resolution ?? "hd",
        data: {
            ...project.data,
            score: {
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultScoreData"],
                ...project.data.score,
                criteria,
                animationDuration: project.data.score.animationDuration ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultScoreData"].animationDuration,
                animationMode: project.data.score.animationMode ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultScoreData"].animationMode,
                layout: project.data.score.layout ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultScoreData"].layout
            },
            "pros-cons": {
                ...project.data["pros-cons"],
                coverImage: project.data["pros-cons"].coverImage ?? ""
            },
            ranking: {
                ...project.data.ranking,
                items: project.data.ranking.items.map((item)=>({
                        ...item,
                        coverImage: item.coverImage ?? ""
                    }))
            },
            versus: {
                ...project.data.versus,
                coverImageA: project.data.versus.coverImageA ?? "",
                coverImageB: project.data.versus.coverImageB ?? "",
                conclusionLabel: project.data.versus.conclusionLabel ?? "Ganador / conclusión"
            }
        }
    };
}
function legacyCriteriaFrom(score) {
    return [
        {
            id: "fun",
            name: "Diversión",
            value: score.fun ?? 9
        },
        {
            id: "replayability",
            name: "Rejugabilidad",
            value: score.replayability ?? 8
        },
        {
            id: "interaction",
            name: "Interacción",
            value: score.interaction ?? 7
        },
        {
            id: "production",
            name: "Producción",
            value: score.production ?? 9
        },
        {
            id: "teachability",
            name: "Facilidad de enseñar",
            value: score.teachability ?? 6
        }
    ];
}
}),
"[project]/lib/storage.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "loadProject",
    ()=>loadProject,
    "saveProject",
    ()=>saveProject
]);
const STORAGE_KEY = "meeplemotion:last-project";
function saveProject(project) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
}
function loadProject() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch  {
        return null;
    }
}
}),
"[project]/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-ssr] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panels$2d$top$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelsTopLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/panels-top-left.js [app-ssr] (ecmascript) <export default as PanelsTopLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/play.js [app-ssr] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AnimatedExportButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AnimatedExportButton.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$EditorPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/EditorPanel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ExportButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ExportButton.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PreviewPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/PreviewPanel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$TemplateSelector$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/TemplateSelector.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/demoData.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filename$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/filename.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hydrateProject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/hydrateProject.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/storage.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/types.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
function Home() {
    const [project, setProject] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hydrateProject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hydrateProject"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createInitialProject"])()));
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("Demo inicial cargada");
    const [animationNonce, setAnimationNonce] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const previewRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fileName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filename$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getProjectFileName"])(project), [
        project
    ]);
    const canvasSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCanvasSize"])(project.format, project.resolution);
    function replayScoreAnimation() {
        setAnimationNonce((value)=>value + 1);
    }
    function handleTemplateChange(template) {
        setProject((current)=>({
                ...current,
                template
            }));
        if (template === "score") replayScoreAnimation();
        setStatus(`Plantilla activa: ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TEMPLATE_LABELS"][template]}`);
    }
    function handleSave() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["saveProject"])(project);
        setStatus("Proyecto guardado en este navegador");
    }
    function handleLoad() {
        const saved = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadProject"])();
        if (saved) {
            const hydratedProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hydrateProject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hydrateProject"])(saved);
            setProject(hydratedProject);
            if (hydratedProject.template === "score") replayScoreAnimation();
            setStatus("Último proyecto cargado");
            return;
        }
        setStatus("No hay proyecto guardado todavía");
    }
    function handleDemo() {
        setProject((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hydrateProject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hydrateProject"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["demoProjectFor"])(project.template)));
        if (project.template === "score") replayScoreAnimation();
        setStatus(`Demo cargada para ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TEMPLATE_LABELS"][project.template]}`);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen px-4 py-6 text-zinc-100 sm:px-6 lg:px-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto max-w-[1800px]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "mb-6 flex flex-col gap-5 rounded-lg border border-white/10 bg-white/[0.035] p-5 shadow-2xl lg:flex-row lg:items-end lg:justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-4 inline-flex items-center gap-2 rounded-lg border border-orange-300/25 bg-orange-400/10 px-3 py-2 text-sm font-bold text-orange-100",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panels$2d$top$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelsTopLeft$3e$__["PanelsTopLeft"], {
                                            className: "size-4"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 63,
                                            columnNumber: 15
                                        }, this),
                                        "MeepleMotion"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 62,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-4xl font-black leading-tight text-white sm:text-5xl",
                                    children: "MeepleMotion"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 66,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-2 max-w-2xl text-base font-medium text-zinc-300 sm:text-lg",
                                    children: "Generador de assets para vídeos de juegos de mesa"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 67,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 61,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-3 sm:flex-row sm:items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/10 bg-black/22 px-3 py-2 text-sm font-semibold text-zinc-300",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                            className: "size-4 text-teal-200"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 71,
                                            columnNumber: 15
                                        }, this),
                                        status
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 70,
                                    columnNumber: 13
                                }, this),
                                project.template === "score" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: replayScoreAnimation,
                                            className: "inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.075] px-4 py-3 text-sm font-bold text-zinc-100 transition hover:border-teal-300/50 hover:bg-white/[0.11]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                                    className: "size-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 81,
                                                    columnNumber: 19
                                                }, this),
                                                "Previsualizar animación"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 76,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AnimatedExportButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatedExportButton"], {
                                            targetRef: previewRef,
                                            fileName: fileName,
                                            duration: project.data.score.animationDuration ?? 1.6,
                                            animationMode: project.data.score.animationMode,
                                            criteriaCount: project.data.score.criteria.length
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 84,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true) : null,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ExportButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ExportButton"], {
                                    targetRef: previewRef,
                                    fileName: fileName
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 93,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 69,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 60,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "mb-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$TemplateSelector$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TemplateSelector"], {
                        value: project.template,
                        onChange: handleTemplateChange
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 98,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 97,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "grid gap-6 xl:grid-cols-[430px_1fr]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$EditorPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EditorPanel"], {
                            project: project,
                            onChange: (nextProject)=>setProject((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hydrateProject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hydrateProject"])(nextProject)),
                            onSave: handleSave,
                            onLoad: handleLoad,
                            onDemo: handleDemo
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 102,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "min-w-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-3 flex flex-wrap items-center justify-between gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-lg font-black text-white",
                                                    children: "Previsualización"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 106,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-zinc-400",
                                                    children: fileName
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 107,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 105,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "rounded-md border border-white/10 bg-black/24 px-3 py-2 text-sm font-bold text-zinc-300",
                                            children: [
                                                canvasSize.width,
                                                "x",
                                                canvasSize.height
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 109,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 104,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PreviewPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PreviewPanel"], {
                                    ref: previewRef,
                                    project: project,
                                    animationNonce: animationNonce
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 113,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 103,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 101,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 59,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_0rcgkl0._.js.map