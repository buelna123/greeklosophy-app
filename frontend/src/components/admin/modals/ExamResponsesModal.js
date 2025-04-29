import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Modal, Button, Table, Accordion, Spinner, } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useExamResponses } from "@/hooks/useExamResponses"; // 🔥 Ahora sí: usar hook dinámico
import "@/styles/admin.css";
const ExamResponsesModal = ({ show, onHide, courseId, }) => {
    const { data, isLoading, error } = useExamResponses(courseId); // 🔥 Se trae solo el curso actual
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    return (_jsxs(Modal, { show: show, onHide: onHide, size: "lg", centered: true, className: "admin-modal", children: [_jsx(Modal.Header, { closeButton: true, children: _jsx(Modal.Title, { children: "Respuestas del Examen" }) }), _jsx(Modal.Body, { children: isLoading ? (_jsx("div", { className: "text-center my-4", children: _jsx(Spinner, { animation: "border", role: "status", children: _jsx("span", { className: "visually-hidden", children: "Cargando..." }) }) })) : error ? (_jsxs("div", { className: "text-center my-4 text-danger", children: ["Error al cargar las respuestas del examen. ", _jsx("br", {}), error instanceof Error ? error.message : "Intenta recargar la página."] })) : !data || data.length === 0 ? (_jsx("p", { className: "text-center", children: "A\u00FAn no hay alumnos que hayan respondido este examen." })) : (_jsx(Accordion, { children: data.map((result, index) => (_jsxs(Accordion.Item, { eventKey: index.toString(), children: [_jsx(Accordion.Header, { children: _jsx("div", { className: "d-flex flex-column w-100", children: _jsxs("div", { className: "d-flex justify-content-between", children: [_jsxs("div", { children: [_jsx("strong", { children: result.user.name }), _jsx("br", {}), _jsx("small", { children: result.user.email })] }), _jsxs("div", { className: "text-end", children: [_jsx("strong", { children: "Calificaci\u00F3n:" }), " ", result.score, _jsx("br", {}), result.passed ? (_jsx("span", { className: "text-success", children: "\u2714\uFE0F Aprobado" })) : (_jsx("span", { className: "text-danger", children: "\u274C No Aprobado" })), _jsx("br", {}), _jsx("strong", { children: "Fecha:" }), " ", formatDate(result.created_at)] })] }) }) }), _jsx(Accordion.Body, { children: _jsxs(Table, { striped: true, bordered: true, hover: true, responsive: true, className: "admin-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Pregunta" }), _jsx("th", { children: "Respuesta Seleccionada" }), _jsx("th", { children: "\u00BFCorrecta?" })] }) }), _jsx("tbody", { children: result.answers.map((answer, idx) => (_jsxs("tr", { children: [_jsx("td", { children: answer.question_text }), _jsx("td", { children: answer.selected_option || "(sin respuesta)" }), _jsx("td", { className: "text-center", children: answer.is_correct ? (_jsx(FaCheckCircle, { color: "green" })) : (_jsx(FaTimesCircle, { color: "red" })) })] }, `answer-${idx}`))) })] }) })] }, `user-${result.user.id}`))) })) }), _jsx(Modal.Footer, { children: _jsx(Button, { variant: "secondary", onClick: onHide, children: "Cerrar" }) })] }));
};
export default ExamResponsesModal;
