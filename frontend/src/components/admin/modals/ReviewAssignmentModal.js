import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "@/api";
const ReviewAssignmentModal = ({ show, onHide, submissionId, assignmentTitle, filePath, defaultGrade, defaultComment, onSuccess, }) => {
    const queryClient = useQueryClient();
    const [grade, setGrade] = useState(defaultGrade ?? 0);
    const [comment, setComment] = useState(defaultComment ?? "");
    const [loading, setLoading] = useState(false);
    const mutation = useMutation(async ({ submissionId, grade, review_comment }) => {
        const res = await api.post(`/admin/submissions/${submissionId}/feedback`, {
            submission_id: submissionId,
            grade,
            review_comment,
        });
        return res.data;
    }, {
        onSuccess: (data) => {
            if (data.success) {
                toast.success(data.success);
                queryClient.invalidateQueries(["assignmentSubmissions"]);
                onSuccess();
                onHide();
            }
            else {
                toast.error(data.error || "Error al guardar la retroalimentación.");
            }
        },
        onError: (error) => {
            toast.error(error.message || "Error al enviar retroalimentación.");
        },
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (grade < 1 || grade > 10) {
            toast.error("La calificación debe ser entre 1 y 10");
            return;
        }
        mutation.mutate({ submissionId, grade, review_comment: comment });
    };
    return (_jsxs(Modal, { show: show, onHide: onHide, size: "lg", centered: true, children: [_jsx(Modal.Header, { closeButton: true, children: _jsx(Modal.Title, { children: "Calificar Entrega" }) }), _jsx(Modal.Body, { children: _jsxs(Form, { onSubmit: handleSubmit, children: [_jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Tarea" }), _jsx(Form.Control, { type: "text", value: assignmentTitle, disabled: true, readOnly: true })] }), _jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Archivo Entregado" }), _jsx("div", { children: _jsx("a", { href: `${api.defaults.baseURL}/storage/${filePath}`, target: "_blank", rel: "noopener noreferrer", children: "Ver archivo" }) })] }), _jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Calificaci\u00F3n (1 a 10)" }), _jsx(Form.Control, { type: "number", value: grade, min: 1, max: 10, onChange: (e) => setGrade(Number(e.target.value)), required: true })] }), _jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Comentario" }), _jsx(Form.Control, { as: "textarea", rows: 3, value: comment, onChange: (e) => setComment(e.target.value), placeholder: "Escribe un comentario para el estudiante..." })] }), _jsx("div", { className: "d-flex justify-content-end", children: _jsx(Button, { type: "submit", variant: "primary", disabled: mutation.isLoading, children: mutation.isLoading ? _jsx(Spinner, { size: "sm", animation: "border" }) : "Guardar Calificación" }) })] }) })] }));
};
export default ReviewAssignmentModal;
