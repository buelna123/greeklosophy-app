import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { Form, Button, Container, Alert, Spinner, Card, } from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCourseContext } from "@/context/CourseContext";
import api from "@/api";
import "@/styles/CourseExperience.css";
import { FaCheckCircle } from "react-icons/fa";
const allowedExtensions = [
    "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "zip", "rar"
];
const AssignmentSubmission = () => {
    const { id: courseId, assignment: assignmentId } = useParams();
    const { assignments, quizSubmitted } = useCourseContext();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const formRef = useRef(null);
    const [file, setFile] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [lastSubmission, setLastSubmission] = useState(null);
    const assignment = assignments.find((a) => a.id.toString() === assignmentId);
    const { data: submissionStatus, isLoading: loadingStatus } = useQuery({
        queryKey: ["assignmentSubmissionStatus", courseId, assignmentId],
        queryFn: async () => {
            const res = await api.get(`/courses/${courseId}/assignments/${assignmentId}/submission-status`);
            return res.data;
        },
        enabled: !!courseId && !!assignmentId,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
    useEffect(() => {
        if (submissionStatus?.submitted) {
            setSubmitted(true);
        }
    }, [submissionStatus]);
    const mutation = useMutation(async (formData) => {
        const res = await api.post(`/courses/${courseId}/assignments/${assignmentId}/submit`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        return res.data;
    }, {
        onSuccess: (data) => {
            setSuccessMsg(data.message || "Tarea enviada exitosamente");
            setErrorMsg("");
            setFile(null);
            setSubmitted(true);
            setEditMode(false);
            setLastSubmission(data.submission);
            formRef.current?.reset();
            queryClient.invalidateQueries(["assignmentSubmissionStatus", courseId, assignmentId]);
            queryClient.invalidateQueries(["courseExperienceData", courseId]);
            queryClient.invalidateQueries(["assignmentReviewList"]);
        },
        onError: (error) => {
            const errMsg = error.response?.data?.error || "Error al enviar la tarea.";
            setErrorMsg(errMsg);
            setSuccessMsg("");
            queryClient.invalidateQueries(["assignmentSubmissionStatus", courseId, assignmentId]);
        },
    });
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selected = e.target.files[0];
            const ext = selected.name.split(".").pop()?.toLowerCase();
            if (ext && allowedExtensions.includes(ext)) {
                setFile(selected);
                setErrorMsg("");
            }
            else {
                setErrorMsg("Tipo de archivo no permitido. Solo se aceptan: pdf, docx, txt, zip, etc.");
                setFile(null);
            }
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file) {
            setErrorMsg("Debe seleccionar un archivo válido.");
            return;
        }
        const ext = file.name.split(".").pop()?.toLowerCase();
        if (!ext || !allowedExtensions.includes(ext)) {
            setErrorMsg("Tipo de archivo no permitido. Solo se aceptan: pdf, docx, txt, zip, etc.");
            return;
        }
        setErrorMsg("");
        setSuccessMsg("");
        const formData = new FormData();
        formData.append("file", file);
        mutation.mutate(formData);
    };
    const handleEdit = () => {
        setEditMode(true);
        setSubmitted(false);
        setErrorMsg("");
        setSuccessMsg("");
        queryClient.invalidateQueries(["assignmentSubmissionStatus", courseId, assignmentId]);
    };
    return (_jsxs(Container, { className: "course-experience-container", children: [_jsx("h2", { className: "mb-4", children: "Entrega de Tarea" }), !quizSubmitted ? (_jsxs(Alert, { variant: "warning", children: ["Debes completar el ", _jsx("strong", { children: "Quiz" }), " antes de poder entregar la tarea."] })) : loadingStatus ? (_jsx("div", { className: "text-center my-5", children: _jsx(Spinner, { animation: "border", variant: "primary" }) })) : !assignment ? (_jsx(Alert, { variant: "warning", children: "No se encontr\u00F3 la tarea solicitada o no est\u00E1 asignada." })) : (_jsxs(_Fragment, { children: [_jsx(Card, { className: "content-area uniform-card mb-4", children: _jsxs(Card.Body, { children: [_jsx(Card.Title, { children: assignment.title }), _jsx(Card.Text, { children: assignment.description })] }) }), _jsx(Card, { className: "shadow-sm border-0 uniform-card", style: { backgroundColor: "#fff" }, children: _jsx(Card.Body, { children: submitted && !editMode ? (_jsxs("div", { children: [_jsxs(Alert, { variant: "success", className: "d-flex flex-column gap-2", children: [_jsxs("div", { className: "d-flex align-items-center gap-2", children: [_jsx(FaCheckCircle, {}), " La tarea ya fue entregada."] }), lastSubmission?.file_path && (_jsx("a", { href: lastSubmission.file_path, target: "_blank", rel: "noopener noreferrer", className: "mt-2 btn btn-outline-secondary", children: "Ver archivo entregado" }))] }), _jsx(Button, { variant: "outline-primary", onClick: handleEdit, children: "Editar Tarea" })] })) : (_jsxs(Form, { ref: formRef, onSubmit: handleSubmit, children: [errorMsg && _jsx(Alert, { variant: "danger", children: errorMsg }), successMsg && _jsx(Alert, { variant: "success", children: successMsg }), _jsxs(Form.Group, { className: "mb-3", controlId: "assignmentFile", children: [_jsx(Form.Label, { className: "form-label", children: "Seleccione el archivo a entregar" }), _jsx(Form.Control, { type: "file", onChange: handleFileChange, className: "form-control", accept: allowedExtensions.map(ext => "." + ext).join(",") })] }), _jsx("div", { className: "d-grid", children: _jsx(Button, { variant: "primary", type: "submit", disabled: mutation.isLoading, className: "btn-primary", children: mutation.isLoading ? (_jsx(Spinner, { as: "span", animation: "border", size: "sm", role: "status", "aria-hidden": "true" })) : submitted ? "Actualizar Tarea" : "Enviar Tarea" }) })] })) }) })] }))] }));
};
export default AssignmentSubmission;
