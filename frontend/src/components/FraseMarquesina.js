import { jsx as _jsx } from "react/jsx-runtime";
import { useLocation } from "react-router-dom";
import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { frasesGenerales, frasesHome, frasesCursos, frasesArticulos, frasesDashboard, frasesAdmin, } from "@/utils/frases";
import "@/styles/FraseMarquesina.css";
const getFrasesPorRuta = (pathname) => {
    if (pathname.startsWith("/courses"))
        return frasesCursos;
    if (pathname.startsWith("/articles"))
        return frasesArticulos;
    if (pathname.startsWith("/dashboard"))
        return frasesDashboard;
    if (pathname.startsWith("/admin"))
        return frasesAdmin;
    if (pathname === "/")
        return frasesHome;
    return frasesGenerales;
};
export const FraseMarquesina = () => {
    const { pathname } = useLocation();
    const frases = useMemo(() => getFrasesPorRuta(pathname), [pathname]);
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const tweenRef = useRef(null);
    useEffect(() => {
        if (!trackRef.current)
            return;
        const totalWidth = trackRef.current.scrollWidth / 3;
        const tween = gsap.to(trackRef.current, {
            x: `-=${totalWidth}`,
            duration: 35,
            ease: "linear",
            repeat: -1,
        });
        tweenRef.current = tween;
        return () => {
            tween.kill();
        };
    }, [frases]);
    // Hover effect: aumentar la velocidad
    useEffect(() => {
        const el = containerRef.current;
        if (!el || !tweenRef.current)
            return;
        const handleEnter = () => {
            tweenRef.current.timeScale(2); // Doble velocidad
        };
        const handleLeave = () => {
            tweenRef.current.timeScale(1); // Velocidad normal
        };
        el.addEventListener("mouseenter", handleEnter);
        el.addEventListener("mouseleave", handleLeave);
        return () => {
            el.removeEventListener("mouseenter", handleEnter);
            el.removeEventListener("mouseleave", handleLeave);
        };
    }, []);
    // Evita que aparezca durante el loading inicial
    if (pathname === "/" && document.body.classList.contains("loading")) {
        return null;
    }
    return (_jsx("div", { className: "marquesina-container", ref: containerRef, children: _jsx("div", { className: "marquesina-inner", children: _jsx("div", { className: "marquesina-track", ref: trackRef, children: [...frases, ...frases, ...frases].map((frase, index) => (_jsx("span", { className: "marquesina-frase", children: frase }, index))) }) }) }));
};
