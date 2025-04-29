import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/course/TopicDetail.tsx
import { useRef } from "react";
import { Container, Card, Alert, Button } from "react-bootstrap";
import { useParams, Link, Outlet } from "react-router-dom";
import { useCourseContext } from "@/context/CourseContext";
import { FaPen } from "react-icons/fa";
import "@/styles/CourseExperience.css";
const TopicDetail = () => {
    const containerRef = useRef(null);
    const { topicId } = useParams();
    const { topics } = useCourseContext();
    const topic = topics.find((t) => t.id.toString() === topicId);
    if (!topic) {
        return (_jsx(Container, { className: "course-experience-container", ref: containerRef, children: _jsx(Alert, { variant: "danger", children: "Tema no encontrado." }) }));
    }
    return (_jsxs(Container, { className: "course-experience-container", ref: containerRef, children: [_jsx("h2", { className: "mb-4", children: topic.title }), _jsx(Card, { className: "content-area mb-4", children: _jsxs(Card.Body, { children: [_jsx(Card.Text, { children: topic.content }), _jsxs(Button, { as: Link, to: "quiz", variant: "primary", className: "btn-primary d-flex align-items-center gap-2 mt-3", children: [_jsx(FaPen, {}), " Realizar Quiz"] })] }) }), _jsx(Outlet, {})] }));
};
export default TopicDetail;
