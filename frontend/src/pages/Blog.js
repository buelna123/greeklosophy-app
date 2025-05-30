import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Container, Row, Col, ListGroup, Button, Spinner, } from "react-bootstrap";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { CallToAction } from "../components/CallToAction";
import { useSearchParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/Blog.css";
import "../styles/sidebar.css";
import { useArticlesQuery } from "@/hooks/useArticles";
const Blog = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredArticles, setFilteredArticles] = useState([]);
    // Usamos React Query para obtener los artículos
    const { data: articles = [], isLoading, error } = useArticlesQuery();
    // Efecto para actualizar el filtrado cada vez que cambien los datos o los parámetros de búsqueda
    useEffect(() => {
        if (articles.length === 0)
            return;
        // Filtrado basado en parámetros de la URL
        const categoria = searchParams.get("categoria")?.toLowerCase() || "";
        const autor = searchParams.get("autor")?.toLowerCase() || "";
        const fecha = searchParams.get("fecha")?.toLowerCase() || "";
        const now = new Date();
        const filtrados = articles.filter((article) => {
            const matchesCategoria = !categoria ||
                article.title.toLowerCase().includes(categoria) ||
                article.content.toLowerCase().includes(categoria);
            const matchesAutor = !autor || article.author.toLowerCase() === autor;
            // Se usa updated_at si existe; de lo contrario, se usa created_at o date
            const articleDate = new Date(article.updated_at ?? article.created_at ?? article.date);
            let matchesFecha = true;
            if (fecha === "semana") {
                const oneWeekAgo = new Date(now);
                oneWeekAgo.setDate(now.getDate() - 7);
                matchesFecha = articleDate >= oneWeekAgo;
            }
            else if (fecha === "mes") {
                const oneMonthAgo = new Date(now);
                oneMonthAgo.setMonth(now.getMonth() - 1);
                matchesFecha = articleDate >= oneMonthAgo;
            }
            else if (fecha === "año") {
                const oneYearAgo = new Date(now);
                oneYearAgo.setFullYear(now.getFullYear() - 1);
                matchesFecha = articleDate >= oneYearAgo;
            }
            return matchesCategoria && matchesAutor && matchesFecha;
        });
        setFilteredArticles(filtrados);
    }, [articles, searchParams]);
    // Manejar búsqueda en tiempo real basada en el input
    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        if (!value.trim()) {
            setFilteredArticles(articles);
            return;
        }
        const query = value.toLowerCase();
        const resultados = articles.filter((article) => {
            return (article.title.toLowerCase().includes(query) ||
                article.content.toLowerCase().includes(query) ||
                article.author.toLowerCase().includes(query));
        });
        setFilteredArticles(resultados);
    };
    // Función para formatear las fechas usando updated_at si existe o fallback a created_at o date
    const formatDate = (dateStr, fallback) => {
        const date = new Date(dateStr ?? fallback);
        return date.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    return (_jsxs(_Fragment, { children: [_jsx(Header, {}), _jsxs(Container, { fluid: true, className: "blog-page-container", children: [_jsx("div", { className: "blog-header-wrapper", children: _jsx("h1", { className: "blog-page-title", children: "Nuestro Blog" }) }), _jsx("div", { className: "blog-search-wrapper mb-4", children: _jsx("input", { type: "text", placeholder: "Buscar art\u00EDculo...", value: searchTerm, onChange: handleSearch, className: "form-control blog-search-input" }) }), isLoading ? (_jsx("div", { className: "spinner-wrapper text-center my-5", children: _jsx(Spinner, { animation: "border", role: "status", variant: "danger", children: _jsx("span", { className: "visually-hidden", children: "Cargando art\u00EDculos..." }) }) })) : error ? (_jsxs("div", { className: "text-center text-danger", children: [_jsx("h1", { children: "Error" }), _jsx("p", { children: typeof error === 'string' ? error : "No se pudo cargar el contenido del blog." })] })) : filteredArticles.length > 0 ? (_jsxs(Row, { children: [_jsx(Col, { md: 9, children: _jsx(ListGroup, { className: "blog-article-list", children: filteredArticles.map((article) => (_jsxs(ListGroup.Item, { className: "blog-article-item", children: [_jsx("img", { src: article.image ? article.image : "https://via.placeholder.com/300x200?text=Sin+Imagen", className: "blog-article-image", alt: article.title }), _jsxs("div", { className: "blog-article-content", children: [_jsx("h3", { className: "blog-article-title", children: article.title }), _jsxs("p", { className: "blog-article-meta", children: ["Por ", _jsx("strong", { children: article.author }), " |", " ", formatDate(article.updated_at, article.created_at ?? article.date)] }), _jsxs("p", { className: "blog-article-excerpt", children: [article.content.substring(0, 150), "..."] })] }), _jsx(Button, { variant: "outline-danger", className: "blog-article-button", onClick: () => navigate(`/articles/${article.id}`), children: "Leer m\u00E1s" })] }, article.id))) }) }), _jsx(Col, { md: 3, children: _jsx(Sidebar, {}) })] })) : (_jsx("p", { className: "text-center", children: "No se encontraron art\u00EDculos." }))] }), _jsx(CallToAction, {}), _jsx(Footer, {})] }));
};
export default Blog;
