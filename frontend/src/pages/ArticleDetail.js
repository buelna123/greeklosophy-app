import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useParams } from "react-router-dom";
import { useRef, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { CallToAction } from "../components/CallToAction";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Sidebar from "../components/Sidebar";
import { Spinner } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import api from "@/api";
import "../styles/DetailPage.css";
// Función para obtener los datos del artículo vía API
const fetchArticle = async (articleId) => {
    const response = await api.get(`/articles/${articleId}`);
    return response.data;
};
const ArticleDetail = () => {
    // Obtenemos el ID del artículo desde la URL
    const { articleId } = useParams();
    // Utilizamos useQuery para manejar la petición del artículo.
    const { data: article, error, isLoading, } = useQuery({
        queryKey: ["article", articleId],
        queryFn: () => {
            if (!articleId)
                throw new Error("ID de artículo faltante");
            return fetchArticle(articleId);
        },
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
    // Referencia para la animación de tipeo
    const contentRef = useRef(null);
    const typingTimeout = useRef(null);
    // Efecto para la animación tipo máquina de escribir
    useEffect(() => {
        if (!article || isLoading || !contentRef.current || !article.content)
            return;
        let index = 0;
        const text = article.content;
        const type = () => {
            if (contentRef.current) {
                contentRef.current.innerHTML = text.slice(0, index);
                index++;
                if (index <= text.length) {
                    typingTimeout.current = window.setTimeout(type, 15);
                }
            }
        };
        typingTimeout.current = window.setTimeout(type, 300);
        return () => {
            if (typingTimeout.current)
                clearTimeout(typingTimeout.current);
        };
    }, [article, isLoading]);
    // Función para formatear fechas
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    return (_jsxs(_Fragment, { children: [_jsx(Header, {}), _jsxs("div", { className: "detail-page", children: [_jsxs("div", { className: "detail-layout", children: [_jsx(motion.div, { className: "detail-container", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: "easeOut" }, children: isLoading ? (_jsx("div", { className: "spinner-wrapper", children: _jsx(Spinner, { animation: "border", role: "status", variant: "danger", style: { width: 70, height: 70 }, children: _jsx("span", { className: "visually-hidden", children: "Cargando art\u00EDculo..." }) }) })) : error || !article ? (_jsxs("div", { className: "detail-error", children: [_jsx("h1", { children: "Error" }), _jsx("p", { children: error?.message || "Artículo no encontrado" })] })) : (_jsxs(_Fragment, { children: [_jsx("h1", { className: "detail-title", children: article.title }), _jsx(Tilt, { tiltMaxAngleX: 5, tiltMaxAngleY: 5, glareEnable: true, glareMaxOpacity: 0.3, glareColor: "transparent", glarePosition: "all", className: "detail-image-tilt", children: _jsx("img", { src: article.image ? article.image : "https://via.placeholder.com/300x200?text=Sin+Imagen", className: "detail-image", alt: article.title, loading: "lazy" }) }), _jsx("p", { className: "detail-content", ref: contentRef }), article.category && (_jsxs("p", { className: "cd-category", children: [_jsx("strong", { children: "Categor\u00EDa:" }), " ", article.category] })), _jsxs("p", { className: "ad-meta", children: ["Por ", article.author, " | Publicado:", " ", formatDate(article.created_at)] }), article.updated_at && (_jsxs("p", { className: "ad-updated", children: [_jsx("strong", { children: "\u00DAltima actualizaci\u00F3n:" }), " ", formatDate(article.updated_at)] }))] })) }), _jsx("div", { className: "sidebar-container", children: _jsx(Sidebar, {}) })] }), _jsx(CallToAction, {})] }), _jsx(Footer, {})] }));
};
export default ArticleDetail;
