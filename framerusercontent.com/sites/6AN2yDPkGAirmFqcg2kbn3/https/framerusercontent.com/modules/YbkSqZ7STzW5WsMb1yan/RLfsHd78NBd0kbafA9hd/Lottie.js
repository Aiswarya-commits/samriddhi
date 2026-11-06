import {
    jsx as _jsx
} from "react/jsx-runtime";
import {
    useRef,
    useCallback,
    useEffect
} from "react";
import {
    motion,
    addPropertyControls,
    ControlType,
    RenderTarget
} from "framer";
import {
    defaultEvents
} from "https://framer.com/m/framer/default-utils.js@^0.45.0";
import {
    useAutoMotionValue
} from "https://framer.com/m/framer/useAutoMotionValue.js@0.3.0";
import lottie from "https://jspm.dev/lottie-web@5.7.8";
var SrcType;
(function(SrcType) {
    SrcType["File"] = "Upload";
    SrcType["Url"] = "URL";
})(SrcType || (SrcType = {}));
var Poster;
(function(Poster) {
    Poster["Auto"] = "Auto";
    Poster["Custom"] = "Custom";
})(Poster || (Poster = {}));
const placeholderUrl = "https://misc.framerstatic.com/lottie/logo.json";
/**
 * LOTTIE
 *
 * @framerIntrinsicWidth 200
 * @framerIntrinsicHeight 350
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export function Lottie(props) {
    const {
        style,
        srcUrl,
        srcFile,
        srcType,
        poster,
        progress: progressRaw,
        playing,
        loop,
        posterProgress,
        pauseOnCanvas,
        isForwardsDirection,
        speed,
        onClick,
        onMouseEnter,
        onMouseLeave,
        onMouseDown,
        onMouseUp,
        onComplete
    } = props;
    const isOnCanvas = RenderTarget.current() === RenderTarget.canvas;
    const shouldPlay = (!pauseOnCanvas || !isOnCanvas) && playing;
    const direction = isForwardsDirection ? 1 : -1;
    const isCustomPoster = poster === "Custom";
    const el = useRef();
    const didInitialMount = useRef(false);
    const animationInfo = useRef({
        data: null,
        animation: null,
        duration: null
    });
    const progress = useAutoMotionValue(progressRaw, {
        transform: v => v * .01
    });
    const play = () => {
        var _animationInfo_current_animation, _animationInfo_current;
        return (_animationInfo_current = animationInfo.current) === null || _animationInfo_current === void 0 ? void 0 : (_animationInfo_current_animation = _animationInfo_current.animation) === null || _animationInfo_current_animation === void 0 ? void 0 : _animationInfo_current_animation.play();
    };
    const pause = () => {
        var _animationInfo_current_animation, _animationInfo_current;
        return (_animationInfo_current = animationInfo.current) === null || _animationInfo_current === void 0 ? void 0 : (_animationInfo_current_animation = _animationInfo_current.animation) === null || _animationInfo_current_animation === void 0 ? void 0 : _animationInfo_current_animation.pause();
    };
    const destroy = () => {
        var _animationInfo_current_animation, _animationInfo_current;
        return (_animationInfo_current = animationInfo.current) === null || _animationInfo_current === void 0 ? void 0 : (_animationInfo_current_animation = _animationInfo_current.animation) === null || _animationInfo_current_animation === void 0 ? void 0 : _animationInfo_current_animation.destroy();
    };
    const scrubTo = useCallback((normalizedProgress, shouldPlayAfter) => {
        if (!animationInfo.current.duration || !animationInfo.current.animation) return; // Lottie gets weird when scrubbing to the exact last frame
        const frameNumberTarget = normalizedProgress === 1 ? animationInfo.current.duration - 1 : normalizedProgress * animationInfo.current.duration;
        if (shouldPlayAfter) animationInfo.current.animation.goToAndPlay(frameNumberTarget, true);
        else animationInfo.current.animation.goToAndStop(frameNumberTarget, true);
    }, []);
    const fetchLottieData = useCallback(async url => {
        if (!url) return null;
        const data = await fetch(url, {
            method: "GET",
            credentials: "omit",
            redirect: "follow"
        }).then(d => d.json());
        return data;
    }, []); // Fetch lottie animation & start setup
    const init = useCallback(async () => { // Clear current animation
        destroy();
        let dataUrl;
        if (srcType === "URL") dataUrl = srcUrl;
        if (srcType === "Upload") dataUrl = srcFile;
        if (!dataUrl) {
            console.warn("No valid Lottie animation provided");
            dataUrl = placeholderUrl;
        }
        const data = await fetchLottieData(dataUrl);
        animationInfo.current.data = data;
        return setup(didInitialMount.current);
    }, [srcType, srcUrl, srcFile]); // Create Lottie animation
    const setup = useCallback(shouldPlayAfter => {
        if (!el.current) return;
        destroy();
        const options = {
            container: el.current,
            renderer: "svg",
            loop: loop,
            autoplay: shouldPlay,
            animationData: animationInfo.current.data,
            rendererSettings: {
                preserveAspectRatio: "xMidYMid slice"
            }
        };
        const anim = animationInfo.current.animation = lottie.loadAnimation(options);
        animationInfo.current.duration = anim.getDuration(true);
        anim.setDirection(direction);
        anim.setSpeed(speed);
        didInitialMount.current = true;
        if (isOnCanvas && isCustomPoster) scrubTo(posterProgress, false);
        else scrubTo(progress.get(), shouldPlay || shouldPlayAfter);
        return () => {
            anim.destroy();
        };
    }, [loop, shouldPlay, speed, direction, isOnCanvas, isCustomPoster, posterProgress]); // Initial setup or re-init when source changes
    useEffect(() => {
        let cleanup;
        init().then(c => cleanup = c);
        return () => {
            if (cleanup) cleanup();
        };
    }, [srcType, srcFile, srcUrl]); // No run-time option for loop option, recreating anim
    useEffect(() => {
        if (!didInitialMount.current) return;
        return setup(false);
    }, [loop]); // Perf hack lets see if anyone notices
    useEffect(() => lottie.setQuality(isOnCanvas ? "low" : "medium"), []); // useEffect(() => {
    //     if (!isOnCanvas) return
    //     const normalizedProgress = progress.get() * 0.01
    //     if (shouldPlay) scrubTo(normalizedProgress, true)
    //     else scrubTo(normalizedProgress, false)
    // }, [progressRaw, shouldPlay])
    useEffect(() => progress.onChange(val => {
        if (isOnCanvas) return;
        if (shouldPlay) scrubTo(val, true);
        else scrubTo(val, false);
    }), []);
    useEffect(() => {
        const val = progress.get();
        if (shouldPlay) scrubTo(val, true);
        else scrubTo(val, false);
    }, [progressRaw]);
    useEffect(() => {
        if (!isOnCanvas) return;
        const normalizedPosterProgress = posterProgress * .01;
        if (isCustomPoster) scrubTo(normalizedPosterProgress, false);
        else scrubTo(progress.get(), false);
    }, [isCustomPoster, posterProgress]);
    useEffect(() => {
        var _animationInfo_current;
        if (!((_animationInfo_current = animationInfo.current) === null || _animationInfo_current === void 0 ? void 0 : _animationInfo_current.animation)) return;
        animationInfo.current.animation.setSpeed(speed);
        scrubTo(progress.get(), true);
    }, [speed]);
    useEffect(() => {
        var _animationInfo_current;
        if (!((_animationInfo_current = animationInfo.current) === null || _animationInfo_current === void 0 ? void 0 : _animationInfo_current.animation)) return;
        animationInfo.current.animation.setDirection(direction);
        scrubTo(progress.get(), true);
    }, [direction]);
    useEffect(() => {
        if (shouldPlay) play();
        else pause();
    }, [shouldPlay]);
    return /*#__PURE__*/ _jsx(motion.div, {
        ref: el,
        style: style,
        onClick,
        onMouseEnter,
        onMouseLeave,
        onMouseDown,
        onMouseUp
    });
}
Lottie.defaultProps = {
    height: 200,
    width: 200,
    srcType: "URL",
    pauseOnCanvas: true,
    srcUrl: placeholderUrl,
    progress: 0,
    poster: "Auto",
    posterProgress: 0
};
addPropertyControls(Lottie, {
    srcType: {
        type: ControlType.Enum,
        displaySegmentedControl: true,
        title: "Source",
        options: ["URL", "Upload"]
    },
    srcUrl: {
        type: ControlType.String,
        title: "URL",
        placeholder: "../example.json",
        hidden: props => props.srcType === "Upload"
    },
    srcFile: {
        type: ControlType.File,
        title: "File",
        allowedFileTypes: ["json"],
        hidden: props => props.srcType === "URL"
    },
    playing: {
        type: ControlType.Boolean,
        title: "Playing",
        enabledTitle: "Yes",
        disabledTitle: "No"
    }, // Temporarily disabling for perf
    pauseOnCanvas: {
        type: ControlType.Boolean,
        title: "Canvas",
        disabledTitle: "Play",
        enabledTitle: "Pause",
        hidden: props => props.playing === false
    },
    loop: {
        type: ControlType.Boolean,
        title: "Loop",
        enabledTitle: "Yes",
        disabledTitle: "No"
    },
    isForwardsDirection: {
        title: "Direction",
        type: ControlType.Boolean,
        enabledTitle: "Normal",
        disabledTitle: "Reverse"
    },
    speed: {
        type: ControlType.Number,
        defaultValue: 1,
        min: 0,
        max: 10,
        step: .5,
        displayStepper: true,
        unit: "x"
    },
    poster: {
        title: "Poster",
        type: ControlType.Enum,
        options: ["Auto", "Custom"],
        displaySegmentedControl: true
    },
    posterProgress: {
        title: " ",
        type: ControlType.Number,
        max: 100,
        min: 0,
        unit: "%",
        hidden: ({
            poster
        }) => poster === "Auto"
    },
    progress: {
        title: "Progress",
        type: ControlType.Number,
        max: 100,
        min: 0,
        unit: "%",
        description: "This component is made for JSON files. [Learn more here](https://lottiefiles.com/what-is-lottie)."
    },
    ...defaultEvents
});
export const __FramerMetadata__ = {
    "exports": {
        "Lottie": {
            "type": "reactComponent",
            "name": "Lottie",
            "slots": [],
            "annotations": {
                "framerIntrinsicHeight": "350",
                "framerIntrinsicWidth": "200",
                "framerSupportedLayoutWidth": "fixed",
                "framerSupportedLayoutHeight": "any-prefer-fixed",
                "framerContractVersion": "1"
            }
        },
        "__FramerMetadata__": {
            "type": "variable"
        }
    }
}
//# sourceMappingURL=./Lottie.map