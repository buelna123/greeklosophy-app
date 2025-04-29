import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api";
import { Spinner } from "react-bootstrap";
export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const listRef = useRef(null);
    const handleSearch = async (event) => {
        const value = event.target.value;
        setQuery(value);
        if (value.trim().length > 2) {
            setLoading(true);
            try {
                const response = await api.get(`/search?query=${encodeURIComponent(value)}`);
                const data = response.data;
                if (Array.isArray(data)) {
                    setError(null);
                    setResults(data);
                }
                else {
                    setError("Datos de búsqueda no válidos.");
                    setResults([]);
                }
            }
            catch (err) {
                setError(`Error en la búsqueda: ${err.message}`);
                console.error("Error fetching search results:", err);
            }
            finally {
                setLoading(false);
            }
        }
        else {
            setResults([]);
            setError(null);
            setLoading(false);
        }
        setSelectedIndex(-1);
    };
    const handleSelect = (result) => {
        const route = result.type === "course" ? `/courses/${result.id}` : `/articles/${result.id}`;
        navigate(route);
        setQuery("");
        setResults([]);
        setSelectedIndex(-1);
    };
    const handleKeyDown = (event) => {
        if (results.length === 0)
            return;
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setSelectedIndex((prev) => {
                const nextIndex = prev < results.length - 1 ? prev + 1 : prev;
                scrollToItem(nextIndex);
                return nextIndex;
            });
        }
        else if (event.key === "ArrowUp") {
            event.preventDefault();
            setSelectedIndex((prev) => {
                const nextIndex = prev > 0 ? prev - 1 : prev;
                scrollToItem(nextIndex);
                return nextIndex;
            });
        }
        else if (event.key === "Enter" && selectedIndex >= 0) {
            handleSelect(results[selectedIndex]);
        }
    };
    const scrollToItem = (index) => {
        if (listRef.current && listRef.current.children[index]) {
            listRef.current.children[index].scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    };
    return (_jsxs("div", { className: "search-bar-container", children: [_jsx("input", { type: "text", value: query, onChange: handleSearch, onKeyDown: handleKeyDown, placeholder: "Buscar cursos, art\u00EDculos o categor\u00EDas...", className: "search-input" }), loading && (_jsx("div", { className: "search-loading", children: _jsx(Spinner, { animation: "border", size: "sm", role: "status" }) })), error && _jsx("p", { className: "error-message", children: error }), results.length > 0 && (_jsx("ul", { className: "search-results", ref: listRef, children: results.map((result, index) => (_jsxs("li", { onClick: () => handleSelect(result), tabIndex: 0, className: index === selectedIndex ? "selected" : "", children: [result.title, " (", result.type === "course" ? "Curso" : "Artículo", ")"] }, `${result.type}-${result.id}`))) }))] }));
}
