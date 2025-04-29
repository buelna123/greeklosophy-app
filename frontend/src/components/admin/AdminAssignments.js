import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/admin/AdminAssignments.tsx
import { useState } from "react";
import { Container, Table, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaHourglassHalf, FaCheckCircle, FaFileAlt } from "react-icons/fa";
import api from "@/api";
import AssignmentModal from "./modals/AssignmentModal";
import "@/styles/admin.css";
const AdminAssignments = () => {
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState(null);
    const { data: assignmentsData, isLoading } = useQuery({
        queryKey: ["adminAssignments"],
        queryFn: async () => {
            const response = await api.get("/admin/assignments");
            return response.data.data.sort((a, b) => b.id - a.id);
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
    const formatDate = (dateString) => {
        if (!dateString)
            return "Sin fecha";
        return new Date(dateString).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    const renderStatusIcon = (status) => {
        switch (status) {
            case "submitted":
                return _jsx(FaFileAlt, { color: "orange", title: "Entregado" });
            case "reviewed":
                return _jsx(FaCheckCircle, { color: "green", title: "Revisado" });
            case "pending":
            default:
                return _jsx(FaHourglassHalf, { color: "gray", title: "Pendiente" });
        }
    };
    const handleShowModal = (assignment) => {
        setEditingAssignment(assignment || null);
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
        setEditingAssignment(null);
    };
    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta asignación?"))
            return;
        try {
            const response = await api.delete(`/admin/assignments/${id}`);
            if (response.data.success) {
                toast.success(response.data.success);
                queryClient.invalidateQueries(["adminAssignments"]);
            }
            else {
                toast.error(response.data.error || "Error desconocido.");
            }
        }
        catch (err) {
            toast.error("Error al eliminar la asignación.");
        }
    };
    return (_jsxs(Container, { className: "admin-container", children: [_jsx("h1", { children: "Gesti\u00F3n de Asignaciones" }), _jsx(Button, { variant: "primary", className: "admin-button-primary mb-3", onClick: () => handleShowModal(), children: "Crear Nueva Asignaci\u00F3n" }), isLoading ? (_jsx("div", { className: "text-center my-4", children: _jsx(Spinner, { animation: "border", role: "status", children: _jsx("span", { className: "visually-hidden", children: "Cargando..." }) }) })) : (_jsxs(Table, { striped: true, bordered: true, hover: true, responsive: true, className: "admin-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "ID" }), _jsx("th", { children: "Curso" }), _jsx("th", { children: "T\u00EDtulo" }), _jsx("th", { children: "Fecha L\u00EDmite" }), _jsx("th", { children: "Estado" }), _jsx("th", { children: "Acciones" })] }) }), _jsx("tbody", { children: assignmentsData?.map((assignment) => (_jsxs("tr", { children: [_jsx("td", { children: assignment.id }), _jsx("td", { children: assignment.course_name || assignment.course_id }), _jsx("td", { children: assignment.title }), _jsx("td", { children: formatDate(assignment.due_date) }), _jsx("td", { className: "text-center", children: renderStatusIcon(assignment.status) }), _jsxs("td", { children: [_jsx(Button, { className: "admin-button me-2", onClick: () => handleShowModal(assignment), children: "Editar" }), _jsx(Button, { variant: "danger", className: "admin-button", onClick: () => handleDelete(assignment.id), children: "Eliminar" })] })] }, assignment.id))) })] })), _jsx(AssignmentModal, { show: showModal, onHide: handleCloseModal, editingAssignment: editingAssignment, onSuccess: () => queryClient.invalidateQueries(["adminAssignments"]) })] }));
};
export default AdminAssignments;
