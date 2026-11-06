import {
    jsx as _jsx
} from "react/jsx-runtime";
import {
    useEffect
} from "react";
import {
    useStore
} from "https://framer.com/m/store-1ekxEa.js@JgIJmApFyLsOgy9yJljp";
export function withPreloaderFade(Component) {
    return props => {
        const [store] = useStore();
        const {
            showPreload
        } = store;
        useEffect(() => {
            if (showPreload) {
                document.body.style.height = "100vh";
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.height = "auto";
                document.body.style.overflow = "auto";
            }
        }, [showPreload]);
        return /*#__PURE__*/ _jsx(Component, { ...props,
            animate: {
                opacity: showPreload ? 1 : 0
            },
            transition: {
                duration: .6,
                ease: "easeOut"
            }
        });
    };
}
export const __FramerMetadata__ = {
    "exports": {
        "withPreloaderFade": {
            "type": "reactHoc",
            "name": "withPreloaderFade",
            "annotations": {
                "framerContractVersion": "1"
            }
        },
        "__FramerMetadata__": {
            "type": "variable"
        }
    }
}
//# sourceMappingURL=./WithPreloadHandler.map