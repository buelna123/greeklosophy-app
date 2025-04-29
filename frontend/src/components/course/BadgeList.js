import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Container, Row, Col, Card, Alert, Spinner } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { FaAward, FaMedal } from "react-icons/fa";
import api from "@/api";
import "@/styles/CourseExperience.css";
const BadgeList = () => {
    const { id: courseId } = useParams();
    const { data: badges, isLoading, error } = useQuery({
        queryKey: ["courseBadges", courseId],
        queryFn: async () => {
            const response = await api.get(`/courses/${courseId}/badges`);
            return response.data;
        },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
    if (isLoading) {
        return (_jsx(Container, { className: "course-experience-container text-center my-5", children: _jsx(Spinner, { animation: "border", variant: "primary" }) }));
    }
    if (error) {
        return (_jsx(Container, { className: "course-experience-container", children: _jsx(Alert, { variant: "danger", children: error.message || "Error al cargar las medallas." }) }));
    }
    return (_jsxs(Container, { className: "course-experience-container", children: [_jsxs("h2", { className: "mb-4 d-flex align-items-center gap-2", children: [_jsx(FaAward, {}), " Medallas Obtenidas"] }), badges && badges.length > 0 ? (_jsx(Row, { className: "badge-list", children: badges.map((userBadge) => (_jsx(Col, { md: 4, className: "mb-4", children: _jsxs(Card, { className: "text-center shadow-sm h-100", children: [_jsxs(Card.Body, { children: [_jsx(FaMedal, { size: 60, color: "#FFD700", className: "mb-3" }), _jsx(Card.Title, { children: userBadge.badge.name }), _jsx(Card.Text, { children: userBadge.badge.description })] }), _jsx(Card.Footer, { children: _jsxs("small", { className: "text-muted", children: ["Obtenida: ", new Date(userBadge.awarded_at).toLocaleDateString()] }) })] }) }, userBadge.id))) })) : (_jsx(Alert, { variant: "info", className: "text-center", children: "No se han asignado medallas a\u00FAn." }))] }));
};
export default BadgeList;
