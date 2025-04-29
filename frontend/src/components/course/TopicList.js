import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Container, Row, Col, Card, Alert, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useCourseContext } from "@/context/CourseContext";
import { FaBookOpen, FaArrowRight } from "react-icons/fa";
import "@/styles/CourseExperience.css";
const TopicList = () => {
    const { topics } = useCourseContext();
    const { id: courseId } = useParams();
    if (!topics || topics.length === 0) {
        return (_jsx(Container, { className: "course-experience-container", children: _jsx(Alert, { variant: "warning", children: "No hay temas disponibles para este curso." }) }));
    }
    return (_jsxs(Container, { className: "course-experience-container", children: [_jsxs("h2", { className: "mb-4 d-flex align-items-center gap-2", children: [_jsx(FaBookOpen, {}), " Lista de Temas"] }), _jsx(Row, { children: topics.map((topic) => (_jsx(Col, { md: 6, className: "mb-4", children: _jsxs(Card, { className: "content-area uniform-card shadow-sm h-100", children: [_jsxs(Card.Body, { children: [_jsx(Card.Title, { children: topic.title }), _jsx(Card.Text, { children: topic.content.length > 100
                                            ? topic.content.substring(0, 100) + "..."
                                            : topic.content })] }), _jsx(Card.Footer, { className: "d-flex justify-content-end", children: _jsxs(Button, { as: Link, to: `/course-experience/${courseId}/topics/${topic.id}`, variant: "primary", className: "d-flex align-items-center gap-2", children: ["Ver Detalle ", _jsx(FaArrowRight, {})] }) })] }) }, topic.id))) })] }));
};
export default TopicList;
