import {
    jsx as _jsx
} from "react/jsx-runtime";
import * as React from "react";
import Lenis from "@studio-freight/lenis";
import {
    addPropertyControls,
    ControlType
} from "framer";
export default function LenisController(props) {
    const {
        lerp,
        wheelMultiplier,
        touchMultiplier
    } = props;
    React.useEffect(() => {
        const wrapper = window;
        const content = document.documentElement;
        const lenis = new Lenis({
            wrapper,
            content,
            lerp,
            wheelMultiplier,
            touchMultiplier,
            wheelEventsTarget: window
        });
        window.__lenis = lenis; // ✅ Bus global de subscriptores al RAF
        const w = window;
        if (!w.__rafSubscribers) w.__rafSubscribers = new Set;
        let rafId = 0;
        const raf = time => { // 1) primero Lenis (actualiza el scroll suavizado)
            lenis.raf(time); // 2) después todos los subscriptores (tu scrub, etc.)
            w.__rafSubscribers.forEach(fn => fn(time));
            rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
            if (window.__lenis === lenis) window.__lenis = null;
        };
    }, [lerp, wheelMultiplier, touchMultiplier]);
    return /*#__PURE__*/ _jsx("div", {
        style: {
            width: 1,
            height: 1,
            opacity: 0,
            pointerEvents: "none"
        }
    });
}
addPropertyControls(LenisController, {
    lerp: {
        type: ControlType.Number,
        defaultValue: .12,
        min: .05,
        max: .3,
        step: .01
    },
    wheelMultiplier: {
        type: ControlType.Number,
        defaultValue: 1,
        min: .2,
        max: 3,
        step: .1
    },
    touchMultiplier: {
        type: ControlType.Number,
        defaultValue: 1,
        min: .2,
        max: 3,
        step: .1
    }
});
export const __FramerMetadata__ = {
    "exports": {
        "default": {
            "type": "reactComponent",
            "name": "LenisController",
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
//# sourceMappingURL=./LenisProvider.map