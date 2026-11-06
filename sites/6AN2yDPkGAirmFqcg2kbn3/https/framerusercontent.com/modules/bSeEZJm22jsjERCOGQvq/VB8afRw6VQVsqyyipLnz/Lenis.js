import {
    jsx as _jsx,
    jsxs as _jsxs,
    Fragment as _Fragment
} from "react/jsx-runtime";
import {
    addPropertyControls,
    ControlType
} from "framer";
import _Lenis from "https://unpkg.com/lenis@1.3.7/dist/lenis.mjs";
import {
    useEffect,
    useRef
} from "react";
/**
 * @framerSupportedLayoutHeight any
 * @framerSupportedLayoutWidth any
 * @framerDisableUnlink
 */
export default function Lenis({
    smooth,
    easing,
    infinite,
    orientation,
    intensity,
    children
}) {
    const wrapperRef = useRef();
    const contentRef = useRef();
    useEffect(() => {
        if (children && (!wrapperRef.current || !contentRef.current)) return;
        if (wrapperRef.current && contentRef.current) {
            if (orientation === "horizontal") {
                wrapperRef.current.style.setProperty("overflowX", "auto");
            } else {
                wrapperRef.current.style.setProperty("overflowY", "auto");
            }
        }
        const lenis = new _Lenis({
            smoothWheel: smooth,
            duration: intensity / 10,
            infinite,
            orientation,
            gestureOrientation: orientation === "horizontal" ? "both" : "vertical",
            autoRaf: true,
            autoToggle: true,
            anchors: true,
            allowNestedScroll: true,
            wrapper: wrapperRef.current,
            content: contentRef.current,
            syncTouch: Boolean(infinite) || orientation === "horizontal"
        }); // expose lenis to the app in case it's needed
        window.lenis = lenis;
        return () => {
            lenis.destroy();
        };
    }, [children]);
    return /*#__PURE__*/ _jsxs(_Fragment, {
        children: [ /*#__PURE__*/ _jsx("link", {
            href: "https://unpkg.com/lenis@1.3.7/dist/lenis.css",
            rel: "stylesheet"
        }), /*#__PURE__*/ _jsx("style", {
            children: `.lenis-content * {
                    width: 100% !important;
                }`
        }), children && /*#__PURE__*/ _jsx("div", {
            ref: wrapperRef,
            style: orientation === "horizontal" ? {
                overflowX: "auto",
                width: "100%"
            } : {
                overflowY: "auto",
                height: "100%"
            },
            children: /*#__PURE__*/ _jsx("div", {
                ref: contentRef,
                style: {
                    width: "100%"
                },
                className: "lenis-content",
                children: children
            })
        })]
    });
}
addPropertyControls(Lenis, {
    smooth: {
        type: ControlType.Boolean,
        title: "Smooth",
        defaultValue: true
    },
    intensity: {
        type: ControlType.Number,
        title: "Intensity",
        defaultValue: 12,
        step: 1,
        min: 1,
        max: 100,
        hidden(props) {
            return props.smooth === false;
        }
    },
    infinite: {
        type: ControlType.Boolean,
        title: "Infinite",
        defaultValue: false,
        hidden(props) {
            return props.smooth === false;
        }
    },
    orientation: {
        type: ControlType.Enum,
        defaultValue: "Vertical",
        displaySegmentedControl: true,
        options: ["vertical", "horizontal"],
        optionTitles: ["Vertical", "Horizontal"],
        hidden(props) {
            return props.smooth === false;
        }
    },
    children: {
        type: ControlType.ComponentInstance,
        title: "Content",
        description: "Cooked and served by [darkroom.engineering](https://darkroom.engineering)."
    }
});
export const __FramerMetadata__ = {
    "exports": {
        "default": {
            "type": "reactComponent",
            "name": "Lenis",
            "slots": ["children"],
            "annotations": {
                "framerSupportedLayoutWidth": "any",
                "framerContractVersion": "1",
                "framerDisableUnlink": "",
                "framerSupportedLayoutHeight": "any"
            }
        },
        "__FramerMetadata__": {
            "type": "variable"
        }
    }
}
//# sourceMappingURL=./Lenis.map