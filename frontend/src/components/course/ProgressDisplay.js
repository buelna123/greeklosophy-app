import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Container, Card, ProgressBar as RBProgressBar, ListGroup, } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaCheckCircle, FaHourglassHalf } from "react-icons/fa";
import "@/styles/CourseExperience.css";
import { useCourseContext } from "@/context/CourseContext";
const ProgressDisplay = () => {
    const { quizSubmitted, assignmentSubmitted, examSubmitted, progressPercent, } = useCourseContext();
    const progressValue = Math.round(progressPercent);
    let progressVariant = "danger";
    if (progressValue === 100)
        progressVariant = "success";
    else if (progressValue >= 66)
        progressVariant = "info";
    else if (progressValue >= 33)
        progressVariant = "warning";
    const statusList = [
        { label: "Quizzes completados", done: quizSubmitted },
        { label: "Tarea entregada", done: assignmentSubmitted },
        { label: "Examen enviado", done: examSubmitted },
    ];
    return (_jsxs(Container, { className: "course-experience-container", children: [_jsx(motion.h2, { className: "mb-4", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: "Progreso del Curso" }), _jsxs(Card, { className: "content-area uniform-card mb-3", children: [_jsxs(Card.Body, { children: [_jsx(Card.Title, { children: "Avance del Curso" }), _jsx(RBProgressBar, { now: progressValue, label: `${progressValue}%`, animated: true, variant: progressVariant, className: "mb-3" })] }), _jsxs(Card.Footer, { className: "card-footer", children: [_jsx("h5", { className: "mb-3", children: "Elementos completados:" }), _jsx(ListGroup, { children: statusList.map(({ label, done }) => (_jsxs(ListGroup.Item, { className: "d-flex align-items-center gap-2", children: [done ? (_jsx(FaCheckCircle, { color: "green" })) : (_jsx(FaHourglassHalf, { color: "gray" })), label] }, label))) })] })] })] }));
};
export default ProgressDisplay;
