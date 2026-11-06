import {
    jsx as _jsx
} from "react/jsx-runtime";
import {
    useStore
} from "https://framer.com/m/store-1ekxEa.js@JgIJmApFyLsOgy9yJljp";
export function withDelayedHeroEntrance(Component) {
    return props => {
        const [store] = useStore();
        const {
            showPreload
        } = store;
        return /*#__PURE__*/ _jsx(Component, { ...props,
            initial: {
                opacity: 0,
                scale: 1,
                x: 0,
                y: 0
            },
            animate: showPreload ? {
                opacity: 0,
                scale: 1
            } : {
                opacity: 1,
                scale: 1
            },
            transition: {
                delay: showPreload ? 0 : 2.8,
                duration: .2,
                ease: "easeOut"
            }
        });
    };
}
export const __FramerMetadata__ = {
    "exports": {
        "withDelayedHeroEntrance": {
            "type": "reactHoc",
            "name": "withDelayedHeroEntrance",
            "annotations": {
                "framerContractVersion": "1"
            }
        },
        "__FramerMetadata__": {
            "type": "variable"
        }
    }
}
//# sourceMappingURL=./WithScanReveal.map