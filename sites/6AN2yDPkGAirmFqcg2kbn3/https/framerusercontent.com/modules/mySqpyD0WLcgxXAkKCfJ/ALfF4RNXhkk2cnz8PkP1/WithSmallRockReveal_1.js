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
                opacity: 1,
                scale: 0,
                x: 300,
                y: -120
            },
            animate: showPreload ? {
                opacity: 1,
                scale: 0,
                x: 300,
                y: -120
            } : {
                opacity: 1,
                scale: 1,
                x: 0,
                y: 0
            },
            transition: {
                delay: showPreload ? 0 : 1.8,
                duration: 1,
                ease: [.44, 0, .27, 1]
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
//# sourceMappingURL=./WithSmallRockReveal_1.map