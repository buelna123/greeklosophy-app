import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import "@/styles/loading.css";
export const Loader = ({ ready }) => {
    const [show, setShow] = useState(true);
    const ringRef = useRef(null);
    useEffect(() => {
        if (ready) {
            setShow(false); // Ocultar loader con fade
        }
    }, [ready]);
    useEffect(() => {
        if (ringRef.current) {
            gsap.to(ringRef.current, {
                rotate: 360,
                duration: 2,
                ease: "linear",
                repeat: -1,
            });
        }
    }, []);
    return (_jsx(AnimatePresence, { children: show && (_jsx(motion.div, { className: "loading-container", initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.6 }, children: _jsxs("div", { className: "loader-wrapper", children: [_jsx("div", { className: "particles-background" }), _jsx("div", { ref: ringRef, className: "loader-ring-gsap" }), _jsx("img", { src: "/logo.svg", alt: "Logo", className: "loading-logo-large" })] }) })) }));
};
