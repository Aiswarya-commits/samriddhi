import {
    jsx as _jsx
} from "react/jsx-runtime";
export const TrimTitle = props => {
    const original = props.title; // return { title: "🔧 TEST OVERRIDE" }
    if (!original || original.length <= 53) {
        return {};
    }
    let truncated = original.slice(0, 53);
    const lastSpace = truncated.lastIndexOf(" ");
    if (lastSpace > 0) {
        truncated = truncated.slice(0, lastSpace);
    }
    return {
        title: `${truncated}…`
    };
};
import {
    useContext as __legacyOverrideHOC_useContext
} from "react";
import {
    DataObserverContext as __legacyOverrideHOC_DataObserverContext
} from "framer";
export function withTrimTitle(C) {
    return props => {
        __legacyOverrideHOC_useContext(__legacyOverrideHOC_DataObserverContext);
        return _jsx(C, { ...props,
            ...TrimTitle(props)
        });
    };
}
withTrimTitle.displayName = "TrimTitle";
export const __FramerMetadata__ = {
    "exports": {
        "TrimTitle": {
            "type": "override",
            "name": "TrimTitle",
            "annotations": {
                "framerContractVersion": "1"
            }
        },
        "withTrimTitle": {
            "type": "reactHoc",
            "name": "withTrimTitle",
            "annotations": {
                "framerContractVersion": "1"
            }
        },
        "__FramerMetadata__": {
            "type": "variable"
        }
    }
}
//# sourceMappingURL=./TrimTitle.map