import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Container, Table, Button, Spinner, Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api";
import { FaEdit } from "react-icons/fa";
import "@/styles/admin.css";
const AdminAssignmentReview = () => {
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);
    const [current, setCurrent] = useState(null);
    const [grade, setGrade] = useState(0);
    const [comment, setComment] = useState("");
    const { data: submissions, isLoading } = useQuery({
        queryKey: ["assignmentReviewList"],
        queryFn: async () => {
            const res = await api.get("/admin/assignment-reviews");
            return res.data.submissions;
        },
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchInterval: 30000, // auto-refresh
        staleTime: 1000 * 60,
    });
    const mutation = useMutation(async ({ submissionId, grade, review_comment }) => {
        const res = await api.post(`/admin/submissions/${submissionId}/feedback`, { grade, review_comment });
        return res.data;
    }, {
        onSuccess: (data) => {
            toast.success(data.success || "Calificación guardada.");
            queryClient.invalidateQueries(["assignmentReviewList"]);
            handleClose();
        },
        onError: (err) => {
            toast.error(err.message || "Error al calificar.");
        },
    });
    const handleOpen = (submission) => {
        setCurrent(submission);
        setGrade(submission.grade ?? 0);
        setComment(submission.review_comment ?? "");
        setShowModal(true);
    };
    const handleClose = () => {
        setShowModal(false);
        setCurrent(null);
        setGrade(0);
        setComment("");
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!current)
            return;
        mutation.mutate({ submissionId: current.id, grade, review_comment: comment });
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    const getFileUrl = (path) => {
        const cleanPath = path.replace(/^\/?storage\//, "");
        return `${api.defaults.baseURL?.replace("/api", "")}/storage/${cleanPath}`;
    };
    return (_jsxs(Container, { className: "admin-container", children: [_jsx("h1", { children: "Revisi\u00F3n de Entregas" }), isLoading ? (_jsx("div", { className: "text-center my-4", children: _jsx(Spinner, { animation: "border", role: "status" }) })) : (_jsxs(Table, { striped: true, bordered: true, hover: true, responsive: true, className: "admin-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "ID" }), _jsx("th", { children: "Curso" }), _jsx("th", { children: "Alumno" }), _jsx("th", { children: "Fecha de Entrega" }), _jsx("th", { children: "Calificaci\u00F3n" }), _jsx("th", { children: "Acciones" })] }) }), _jsx("tbody", { children: submissions?.length ? (submissions.map((sub) => (_jsxs("tr", { children: [_jsx("td", { children: sub.id }), _jsx("td", { children: sub.course_name }), _jsx("td", { children: sub.user_name }), _jsx("td", { children: formatDate(sub.submitted_at) }), _jsx("td", { children: sub.grade ?? "—" }), _jsx("td", { children: _jsxs(Button, { size: "sm", variant: "secondary", onClick: () => handleOpen(sub), children: [_jsx(FaEdit, { className: "me-1" }), " Calificar"] }) })] }, sub.id)))) : (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "text-center text-muted py-4", children: "No hay entregas disponibles." }) })) })] })), _jsxs(Modal, { show: showModal, onHide: handleClose, size: "lg", children: [_jsx(Modal.Header, { closeButton: true, children: _jsxs(Modal.Title, { children: ["Calificar Entrega #", current?.id] }) }), _jsx(Modal.Body, { children: _jsxs(Form, { onSubmit: handleSubmit, children: [_jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Archivo Entregado" }), _jsx("div", { children: current?.file_path ? (_jsx("a", { href: getFileUrl(current.file_path), target: "_blank", rel: "noopener noreferrer", children: "Ver archivo" })) : (_jsx("span", { className: "text-muted", children: "Sin archivo" })) })] }), _jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Calificaci\u00F3n (1-10)" }), _jsx(Form.Control, { type: "number", min: 1, max: 10, value: grade, onChange: (e) => setGrade(Number(e.target.value)), required: true })] }), _jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Comentario" }), _jsx(Form.Control, { as: "textarea", rows: 3, value: comment, onChange: (e) => setComment(e.target.value) })] }), _jsx("div", { className: "text-end", children: _jsx(Button, { variant: "primary", type: "submit", disabled: mutation.isLoading, children: mutation.isLoading ? "Guardando..." : "Guardar Calificación" }) })] }) })] })] }));
};
export default AdminAssignmentReview;
