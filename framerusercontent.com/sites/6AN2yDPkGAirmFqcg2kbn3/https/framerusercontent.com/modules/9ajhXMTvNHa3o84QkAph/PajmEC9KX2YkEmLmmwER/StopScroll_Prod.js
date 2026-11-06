import {
    jsx as _jsx,
    Fragment as _Fragment
} from "react/jsx-runtime";
import {
    addPropertyControls,
    ControlType
} from "framer";
/**
 * @framerDisableUnlink
 *
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function StopScroll(props) {
    const {
        toggle
    } = props;
    return toggle ? /*#__PURE__*/ _jsx("style", {
        "data-frameruni-stop-scroll": true,
        children: `body { overflow: hidden !important; }`
    }) : /*#__PURE__*/ _jsx(_Fragment, {});
}
StopScroll.displayName = "Stop Scroll";
addPropertyControls(StopScroll, {
    toggle: {
        type: ControlType.Boolean,
        title: "Block Scroll",
        description: "More components at [Framer University](https://frameruni.link/cc)."
    }
});
export const __FramerMetadata__ = {
    "exports": {
        "default": {
            "type": "reactComponent",
            "name": "StopScroll",
            "slots": [],
            "annotations": {
                "framerSupportedLayoutWidth": "auto",
                "framerContractVersion": "1",
                "framerDisableUnlink": "*",
                "framerSupportedLayoutHeight": "auto"
            }
        },
        "__FramerMetadata__": {
            "type": "variable"
        }
    }
}
//# sourceMappingURL=./StopScroll_Prod.map