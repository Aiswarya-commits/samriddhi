import {
    jsx as _jsx,
    jsxs as _jsxs
} from "react/jsx-runtime";
import * as React from "react";
import {
    addPropertyControls,
    ControlType
} from "framer";
import {
    useAnimationFrame
} from "framer-motion";
import {
    useStore
} from "https://framer.com/m/store-1ekxEa.js@JgIJmApFyLsOgy9yJljp";

function clamp(v, min = 0, max = 1) {
    return Math.max(min, Math.min(max, v));
}
export default function ScrollCinematicSequence(props) {
    const {
        baseUrl,
        filePrefix,
        ext,
        digits,
        startIndex,
        totalFrames,
        introFrames,
        introFps,
        lockScrollDuringIntro,
        cacheRadius,
        follow,
        maxFps,
        concurrency = 6
    } = props;
    const [store, setStore] = useStore();
    const hostRef = React.useRef(null);
    const canvasRef = React.useRef(null);
    const ctxRef = React.useRef(null);
    const modeRef = React.useRef("intro");
    const introStartTsRef = React.useRef(null);
    const introDoneRef = React.useRef(false);
    const metricsRef = React.useRef({
        startY: 0,
        height: 0,
        vh: 1,
        scrollable: 1,
        ready: false
    });
    const imagesRef = React.useRef(new Map);
    const loadingRef = React.useRef(new Set);
    const desiredFrameRef = React.useRef(startIndex);
    const smoothFrameRef = React.useRef(startIndex);
    const lastDrawnFrameRef = React.useRef(-1);
    const lastTsRef = React.useRef(0);
    const lastDrawTsRef = React.useRef(0);
    const lastDesiredRef = React.useRef(startIndex);
    const canvasSizeRef = React.useRef({
        w: 0,
        h: 0,
        dpr: 0
    });
    const pad = React.useCallback(n => String(n).padStart(digits, "0"), [digits]);
    const urlFor = React.useCallback(frame => {
        const safeBase = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
        return `${safeBase}${filePrefix}${pad(frame)}.${ext}`;
    }, [baseUrl, filePrefix, pad, ext]);
    const setScrollLocked = React.useCallback(locked => {
        if (!lockScrollDuringIntro) return;
        const html = document.documentElement;
        const body = document.body;
        if (!body || !html) return;
        const w = window;
        const lenis = w.lenis || w.__lenis;
        if (locked) {
            html.style.overflow = "hidden";
            body.style.overflow = "hidden";
            body.style.height = "100vh";
            body.style.touchAction = "none";
            if (lenis ? .stop) lenis.stop();
        } else {
            html.style.overflow = "";
            body.style.overflow = "";
            body.style.height = "";
            body.style.touchAction = "";
            if (lenis ? .start) lenis.start();
        }
    }, [lockScrollDuringIntro]);
    const getSmoothScrollY = React.useCallback(() => {
        const w = window;
        const lenis = w.lenis || w.__lenis;
        const nativeY = window.scrollY || window.pageYOffset || 0;
        if (!lenis) return nativeY;
        const lenisY = typeof lenis.animatedScroll === "number" ? lenis.animatedScroll : typeof lenis.scroll === "number" ? lenis.scroll : null;
        if (typeof lenisY !== "number") return nativeY; // si Lenis quedó stale después de navegación / lock-unlock,
        // preferimos el scroll real del browser
        if (Math.abs(lenisY - nativeY) > 4) return nativeY;
        return lenisY;
    }, []);
    const recalcMetrics = React.useCallback(() => {
        const el = hostRef.current;
        if (!el) return;
        const vh = window.innerHeight || 1;
        const rect = el.getBoundingClientRect();
        const startY = rect.top + (window.scrollY || window.pageYOffset || 0);
        const height = el.offsetHeight || rect.height || 0;
        const scrollable = Math.max(1, height - vh);
        metricsRef.current = {
            startY,
            height,
            vh,
            scrollable,
            ready: height > 0
        };
    }, []);
    const getSectionProgress = React.useCallback(() => {
        const m = metricsRef.current;
        if (!m.ready) return 0;
        const y = getSmoothScrollY();
        const scrolled = y - m.startY;
        return clamp(scrolled / m.scrollable, 0, 1);
    }, [getSmoothScrollY]);
    const ensureLoaded = React.useCallback(frame => {
        const minF = startIndex;
        const maxF = startIndex + totalFrames - 1;
        if (frame < minF || frame > maxF) return;
        if (imagesRef.current.has(frame) || loadingRef.current.has(frame)) return;
        loadingRef.current.add(frame);
        fetch(urlFor(frame)).then(r => r.blob()).then(blob => createImageBitmap(blob)).then(bmp => {
            imagesRef.current.set(frame, bmp);
            loadingRef.current.delete(frame);
        }).catch(() => loadingRef.current.delete(frame));
    }, [startIndex, totalFrames, urlFor]);
    const preloadAround = React.useCallback(center => {
        const minF = startIndex;
        const maxF = startIndex + totalFrames - 1;
        const a = Math.max(minF, center - cacheRadius);
        const b = Math.min(maxF, center + cacheRadius);
        for (let f = a; f <= b; f++) ensureLoaded(f);
    }, [cacheRadius, ensureLoaded, startIndex, totalFrames]);
    const preloadAhead = React.useCallback((center, velocity) => {
        const minF = startIndex;
        const maxF = startIndex + totalFrames - 1;
        const ahead = Math.round(center + velocity * 2);
        const a = Math.max(minF, Math.min(maxF, ahead - 6));
        const b = Math.max(minF, Math.min(maxF, ahead + 6));
        for (let f = a; f <= b; f++) ensureLoaded(f);
    }, [ensureLoaded, startIndex, totalFrames]);
    const syncCanvasSize = React.useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const w = window.innerWidth;
        const h = window.innerHeight;
        const tW = Math.floor(w * dpr);
        const tH = Math.floor(h * dpr);
        const prev = canvasSizeRef.current;
        if (prev.w === tW && prev.h === tH && prev.dpr === dpr) return;
        canvasSizeRef.current = {
            w: tW,
            h: tH,
            dpr
        };
        canvas.width = tW;
        canvas.height = tH;
        canvas.style.width = "100vw";
        canvas.style.height = "100vh";
        lastDrawnFrameRef.current = -1;
    }, []);
    const drawFrame = React.useCallback(frame => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        let ctx = ctxRef.current;
        if (!ctx) {
            ctx = canvas.getContext("2d");
            ctxRef.current = ctx;
        }
        if (!ctx) return;
        const img = imagesRef.current.get(frame);
        if (!img) return;
        const cw = canvas.width;
        const ch = canvas.height;
        const iw = img.naturalWidth || img.width;
        const ih = img.naturalHeight || img.height;
        if (!iw || !ih) return;
        const scale = Math.max(cw / iw, ch / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        const dx = (cw - dw) / 2;
        const dy = (ch - dh) / 2;
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, dx, dy, dw, dh);
        lastDrawnFrameRef.current = frame;
    }, []);
    const redrawCurrentFrame = React.useCallback(() => {
        const frame = modeRef.current === "intro" ? Math.round(desiredFrameRef.current || startIndex) : Math.round(smoothFrameRef.current || desiredFrameRef.current);
        if (imagesRef.current.has(frame)) {
            lastDrawnFrameRef.current = -1;
            drawFrame(frame);
            return;
        }
        if (imagesRef.current.has(lastDrawnFrameRef.current)) {
            const last = lastDrawnFrameRef.current;
            lastDrawnFrameRef.current = -1;
            drawFrame(last);
            return;
        }
        if (imagesRef.current.has(startIndex)) {
            lastDrawnFrameRef.current = -1;
            drawFrame(startIndex);
        }
    }, [drawFrame, startIndex]);
    React.useEffect(() => {
        let cancelled = false;
        const images = imagesRef.current;
        images.clear();
        loadingRef.current.clear();
        setStore({
            showPreload: true
        });
        const minF = startIndex;
        const maxF = startIndex + totalFrames - 1;
        const allFrames = [];
        for (let f = minF; f <= maxF; f++) allFrames.push(f);
        const loadOne = async frame => {
            if (cancelled) return;
            try {
                const url = (baseUrl.endsWith("/") ? baseUrl : baseUrl + "/") + filePrefix + String(frame).padStart(digits, "0") + "." + ext;
                const resp = await fetch(url);
                const blob = await resp.blob();
                const bmp = await createImageBitmap(blob);
                if (!cancelled) images.set(frame, bmp);
            } catch { // skip failed frames
            }
        };
        const queue = [...allFrames];
        let running = 0;
        const next = () => {
            while (running < concurrency && queue.length > 0) {
                const frame = queue.shift();
                running++;
                loadOne(frame).finally(() => {
                    running--;
                    if (queue.length > 0) {
                        next();
                    } else if (running === 0 && !cancelled) {
                        setStore({
                            showPreload: false
                        });
                    }
                });
            }
        };
        next();
        return () => {
            cancelled = true;
            images.forEach(bmp => bmp.close());
            images.clear();
        };
    }, [baseUrl, filePrefix, ext, digits, startIndex, totalFrames, concurrency]);
    const tick = React.useCallback(ts => {
        if (store.showPreload) return;
        if (!metricsRef.current.ready) recalcMetrics();
        if (modeRef.current === "intro") {
            if (!introDoneRef.current) setScrollLocked(true);
            if (introStartTsRef.current == null && imagesRef.current.has(startIndex)) {
                introStartTsRef.current = ts;
            }
            if (introStartTsRef.current == null) {
                if (imagesRef.current.has(startIndex) && lastDrawnFrameRef.current !== startIndex) {
                    drawFrame(startIndex);
                }
                return;
            }
            const elapsed = (ts - introStartTsRef.current) / 1e3;
            const idx = Math.min(introFrames - 1, Math.floor(elapsed * introFps));
            const frame = startIndex + idx;
            desiredFrameRef.current = frame;
            smoothFrameRef.current = frame;
            if (imagesRef.current.has(frame) && frame !== lastDrawnFrameRef.current) {
                drawFrame(frame);
            }
            if (idx >= introFrames - 1) {
                introDoneRef.current = true;
                modeRef.current = "scrub";
                setScrollLocked(false);
                recalcMetrics();
                const scrubStart = startIndex + introFrames;
                desiredFrameRef.current = scrubStart;
                smoothFrameRef.current = scrubStart;
                lastDesiredRef.current = scrubStart;
                lastTsRef.current = ts;
                lastDrawTsRef.current = 0;
            }
            return;
        }
        const p = getSectionProgress();
        const scrubStart = startIndex + introFrames;
        const scrubEnd = startIndex + totalFrames - 1;
        const target = Math.round(scrubStart + p * (scrubEnd - scrubStart));
        desiredFrameRef.current = target;
        const velocity = desiredFrameRef.current - lastDesiredRef.current;
        lastDesiredRef.current = desiredFrameRef.current;
        preloadAround(target);
        preloadAhead(target, velocity);
        const prevTs = lastTsRef.current || ts;
        const dt = Math.max(.001, (ts - prevTs) / 1e3);
        lastTsRef.current = ts;
        const current = smoothFrameRef.current;
        const diff = desiredFrameRef.current - current;
        const k = 1 - Math.pow(1 - clamp(follow, .05, .95), dt * 60);
        const next = current + diff * k;
        const clampedFrame = Math.max(scrubStart, Math.min(scrubEnd, next));
        smoothFrameRef.current = clampedFrame;
        const frameToDraw = Math.round(clampedFrame);
        const minFrameTime = 1e3 / Math.max(12, Math.min(60, maxFps));
        if (ts - lastDrawTsRef.current < minFrameTime) return;
        lastDrawTsRef.current = ts;
        if (imagesRef.current.has(frameToDraw)) {
            if (frameToDraw !== lastDrawnFrameRef.current) {
                drawFrame(frameToDraw);
            }
        } else {
            for (let d = 1; d <= Math.min(6, cacheRadius); d++) {
                const a = frameToDraw - d;
                const b = frameToDraw + d;
                if (imagesRef.current.has(a)) {
                    if (a !== lastDrawnFrameRef.current) drawFrame(a);
                    break;
                }
                if (imagesRef.current.has(b)) {
                    if (b !== lastDrawnFrameRef.current) drawFrame(b);
                    break;
                }
            }
        }
    }, [store.showPreload, cacheRadius, drawFrame, getSectionProgress, introFps, introFrames, maxFps, preloadAhead, preloadAround, recalcMetrics, setScrollLocked, startIndex, totalFrames, follow]);
    useAnimationFrame(time => {
        if (!store.showPreload) {
            tick(time);
        }
    });
    React.useEffect(() => {
        if (store.showPreload) return;
        modeRef.current = "intro";
        introStartTsRef.current = null;
        introDoneRef.current = false;
        desiredFrameRef.current = startIndex;
        smoothFrameRef.current = startIndex;
        lastDrawnFrameRef.current = -1;
        lastTsRef.current = 0;
        lastDrawTsRef.current = 0;
        lastDesiredRef.current = startIndex;
        metricsRef.current.ready = false;
        recalcMetrics();
        setScrollLocked(true);
        if (canvasRef.current) {
            ctxRef.current = canvasRef.current.getContext("2d");
        }
        syncCanvasSize();
        const onResize = () => {
            canvasSizeRef.current = {
                w: 0,
                h: 0,
                dpr: 0
            };
            syncCanvasSize();
            recalcMetrics();
            lastDrawnFrameRef.current = -1;
            lastDrawTsRef.current = 0;
            redrawCurrentFrame();
        };
        window.addEventListener("resize", onResize);
        const ro = "ResizeObserver" in window ? new ResizeObserver(() => {
            recalcMetrics();
            redrawCurrentFrame();
        }) : null;
        if (ro && hostRef.current) ro.observe(hostRef.current);
        return () => {
            window.removeEventListener("resize", onResize);
            if (ro) ro.disconnect();
            setScrollLocked(false);
        };
    }, [store.showPreload, startIndex, recalcMetrics, setScrollLocked, syncCanvasSize]);
    return /*#__PURE__*/ _jsxs("div", {
        ref: hostRef,
        style: {
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "visible"
        },
        children: [ /*#__PURE__*/ _jsx("div", {
            style: {
                position: "fixed",
                inset: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 0,
                pointerEvents: "none"
            },
            children: /*#__PURE__*/ _jsx("canvas", {
                ref: canvasRef
            })
        }), /*#__PURE__*/ _jsx("div", {
            style: {
                height: "100%"
            }
        })]
    });
}
addPropertyControls(ScrollCinematicSequence, {
    baseUrl: {
        type: ControlType.String
    },
    filePrefix: {
        type: ControlType.String
    },
    ext: {
        type: ControlType.Enum,
        options: ["webp", "jpg", "png"],
        optionTitles: ["webp", "jpg", "png"],
        defaultValue: "webp"
    },
    digits: {
        type: ControlType.Number,
        defaultValue: 5,
        min: 1,
        max: 8,
        step: 1
    },
    startIndex: {
        type: ControlType.Number,
        defaultValue: 0,
        min: 0,
        max: 99999,
        step: 1
    },
    totalFrames: {
        type: ControlType.Number,
        defaultValue: 268,
        min: 2,
        max: 5e3,
        step: 1
    },
    introFrames: {
        type: ControlType.Number,
        defaultValue: 90,
        min: 1,
        max: 2e3,
        step: 1
    },
    introFps: {
        type: ControlType.Number,
        defaultValue: 30,
        min: 12,
        max: 60,
        step: 1
    },
    lockScrollDuringIntro: {
        type: ControlType.Boolean,
        defaultValue: true
    },
    cacheRadius: {
        type: ControlType.Number,
        defaultValue: 24,
        min: 6,
        max: 120,
        step: 1
    },
    follow: {
        type: ControlType.Number,
        defaultValue: .45,
        min: .1,
        max: .9,
        step: .05
    },
    maxFps: {
        type: ControlType.Number,
        defaultValue: 45,
        min: 24,
        max: 60,
        step: 1
    },
    concurrency: {
        type: ControlType.Number,
        defaultValue: 6,
        min: 1,
        max: 20,
        step: 1,
        title: "Parallel Downloads"
    }
});
export const __FramerMetadata__ = {
    "exports": {
        "default": {
            "type": "reactComponent",
            "name": "ScrollCinematicSequence",
            "slots": [],
            "annotations": {
                "framerContractVersion": "1"
            }
        },
        "__FramerMetadata__": {
            "type": "variable"
        }
    }
}
//# sourceMappingURL=./CinematicPlay_Guille.map