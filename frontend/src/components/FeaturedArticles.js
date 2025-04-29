import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "@/api";
import "@/styles/FeaturedArticles.css";
const FeaturedArticles = () => {
    const { data: articlesData, isLoading, isError, error } = useQuery({
        queryKey: ["featuredArticles"],
        queryFn: async () => {
            const response = await api.get("/articles");
            return response.data.data;
        },
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
    });
    const articles = articlesData ? articlesData.slice(0, 4) : [];
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [maxContentLength, setMaxContentLength] = React.useState(150);
    const [firstLoad, setFirstLoad] = React.useState(true);
    React.useEffect(() => {
        const handleResize = () => {
            setMaxContentLength(window.innerWidth < 768 ? 100 : 150);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    React.useEffect(() => {
        const timer = setTimeout(() => setFirstLoad(false), 400);
        return () => clearTimeout(timer);
    }, []);
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const goToSlide = (index) => {
        if (index !== currentIndex) {
            setCurrentIndex(index);
        }
    };
    return (_jsxs("section", { className: "featured-articles", children: [_jsx("h2", { className: "section-title", children: "\u00DAltimos Art\u00EDculos" }), isLoading ? (_jsx("div", { className: "spinner-wrapper text-center", children: _jsx(Spinner, { animation: "border", role: "status", variant: "danger", children: _jsx("span", { className: "visually-hidden", children: "Cargando art\u00EDculos..." }) }) })) : isError ? (_jsxs("div", { className: "error text-center", children: [_jsx("h1", { children: "Error" }), _jsx("p", { children: error?.message || "Error al cargar los artículos." })] })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "carousel-container", children: _jsx(AnimatePresence, { mode: "wait", children: _jsxs(motion.div, { className: "article-card", initial: firstLoad ? { opacity: 0, y: 30 } : { opacity: 0, scale: 0.95 }, animate: firstLoad ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, transition: { duration: 0.6, ease: "easeOut" }, children: [_jsxs("div", { className: "hover-wrapper", children: [_jsx("div", { className: "image-container", children: _jsx("img", { src: articles[currentIndex]?.image || "https://via.placeholder.com/300x200?text=Sin+Imagen", alt: articles[currentIndex]?.title, className: "article-image" }) }), _jsxs("div", { className: "article-content", children: [_jsx("h3", { children: articles[currentIndex]?.title }), _jsxs("p", { children: [articles[currentIndex]?.content.substring(0, maxContentLength), "..."] }), _jsxs("div", { className: "article-meta", children: [_jsxs("span", { className: "author", children: ["Por ", articles[currentIndex]?.author] }), _jsx("span", { className: "date", children: formatDate(articles[currentIndex]?.updated_at || articles[currentIndex]?.created_at) })] }), _jsx("div", { className: "button-container", children: _jsx(Link, { to: `/articles/${articles[currentIndex]?.id}`, className: "read-more", children: "Leer m\u00E1s" }) })] })] }), _jsx("div", { className: "hover-gradient" })] }, articles[currentIndex]?.id) }) }), _jsx("div", { className: "carousel-indicators", children: articles.map((_, index) => (_jsx("span", { className: index === currentIndex ? "active-dot" : "dot", onClick: () => goToSlide(index) }, index))) })] }))] }));
};
export default FeaturedArticles;
