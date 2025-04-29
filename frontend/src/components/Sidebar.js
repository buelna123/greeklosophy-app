import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { memo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card, Badge, Spinner } from "react-bootstrap";
import { FaFire, FaCalendarAlt, FaUser } from "react-icons/fa";
import { useQueries } from "@tanstack/react-query";
import api from "@/api";
import "../styles/sidebar.css";
const Sidebar = ({ onDataLoaded }) => {
    // Ejecutar tres queries simultáneas para artículos, autores y categorías
    const results = useQueries({
        queries: [
            {
                queryKey: ["trendingArticles"],
                queryFn: async () => {
                    const response = await api.get("/articles");
                    // Tomamos solo los primeros 3 artículos para la sección en tendencia
                    return response.data.data.slice(0, 3);
                },
                staleTime: 1000 * 60 * 5, // 5 minutos
                refetchOnWindowFocus: false,
            },
            {
                queryKey: ["authors"],
                queryFn: async () => {
                    const response = await api.get("/authors");
                    return response.data;
                },
                staleTime: 1000 * 60 * 5,
                refetchOnWindowFocus: false,
            },
            {
                queryKey: ["categories"],
                queryFn: async () => {
                    const response = await api.get("/categories");
                    return response.data;
                },
                staleTime: 1000 * 60 * 5,
                refetchOnWindowFocus: false,
            }
        ]
    });
    // Extraer datos de cada query; si alguna no está disponible, se asigna un arreglo vacío
    const trending = results[0].data || [];
    const autores = results[1].data || [];
    const categorias = results[2].data || [];
    // Determinar el estado de carga general del sidebar
    const loadingSidebar = results.some((query) => query.isLoading);
    // Notificar cuando se han cargado todos los datos
    if (!loadingSidebar && onDataLoaded) {
        onDataLoaded();
    }
    // Obtener parámetros de filtrado desde la URL
    const [searchParams] = useSearchParams();
    const categoriaActiva = searchParams.get("categoria")?.toLowerCase();
    const autorActivo = searchParams.get("autor")?.toLowerCase();
    const fechaActiva = searchParams.get("fecha")?.toLowerCase();
    return (_jsx("div", { className: "sidebar-articulos", children: _jsx(Card, { className: "mb-4 shadow-sm sidebar-single-card", children: _jsx(Card.Body, { children: loadingSidebar ? (_jsx("div", { className: "d-flex justify-content-center align-items-center sidebar-loading-height", children: _jsx(Spinner, { animation: "border", variant: "danger" }) })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "sidebar-section", children: [_jsx(Card.Title, { className: "text-danger mb-3", children: "\uD83D\uDCC2 Categor\u00EDas" }), _jsx("div", { className: "d-flex flex-wrap gap-2", children: categorias.map((cat, idx) => {
                                        const isActive = categoriaActiva === cat.toLowerCase();
                                        return (_jsx(Badge, { bg: "light", text: "dark", className: `sidebar-badge ${isActive ? "active-filter" : ""}`, children: _jsx(Link, { to: `/articles?categoria=${encodeURIComponent(cat)}`, children: cat }) }, idx));
                                    }) })] }), _jsxs("div", { className: "sidebar-section", children: [_jsxs(Card.Title, { className: "text-danger mb-3", children: [_jsx(FaUser, { className: "me-2" }), "Autores Populares"] }), _jsx("ul", { className: "list-unstyled mb-0", children: autores.map((autor, idx) => {
                                        const isActive = autorActivo === autor.toLowerCase();
                                        return (_jsx("li", { children: _jsx(Link, { to: `/articles?autor=${encodeURIComponent(autor)}`, className: isActive ? "active-filter" : "", children: autor }) }, idx));
                                    }) })] }), _jsxs("div", { className: "sidebar-section", children: [_jsxs(Card.Title, { className: "text-danger mb-3", children: [_jsx(FaFire, { className: "me-2" }), "En Tendencia"] }), _jsx("ul", { className: "list-unstyled mb-0", children: trending.map((art) => (_jsx("li", { children: _jsx(Link, { to: `/articles/${art.id}`, children: art.title }) }, art.id))) })] }), _jsxs("div", { className: "sidebar-section", children: [_jsxs(Card.Title, { className: "text-danger mb-3", children: [_jsx(FaCalendarAlt, { className: "me-2" }), "Filtrar por Fecha"] }), _jsx("ul", { className: "list-unstyled mb-0", children: ["semana", "mes", "año"].map((fecha) => (_jsx("li", { children: _jsx(Link, { to: `/articles?fecha=${fecha}`, className: fechaActiva === fecha ? "active-filter" : "", children: fecha === "semana"
                                                ? "Última semana"
                                                : fecha === "mes"
                                                    ? "Último mes"
                                                    : "Último año" }) }, fecha))) })] })] })) }) }) }));
};
export default memo(Sidebar);
