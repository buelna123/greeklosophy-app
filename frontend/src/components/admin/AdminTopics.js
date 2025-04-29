import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/admin/AdminTopics.tsx
import { useState } from "react";
import { Container, Table, Button, Spinner } from "react-bootstrap";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "@/api";
import TopicModal from "./modals/TopicModal";
import "@/styles/admin.css";
const AdminTopics = () => {
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);
    const [editingTopic, setEditingTopic] = useState(null);
    const { data: topicsData, isLoading } = useQuery({
        queryKey: ["adminTopics"],
        queryFn: async () => {
            const res = await api.get("/admin/topics");
            return res.data.data;
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
    const handleShowModal = (topic) => {
        setEditingTopic(topic || null);
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
        setEditingTopic(null);
    };
    const handleDelete = async (id) => {
        if (!window.confirm("¿Eliminar este tema?"))
            return;
        try {
            const res = await api.delete(`/admin/topics/${id}`);
            if (res.data.success) {
                toast.success(res.data.success);
                queryClient.invalidateQueries(["adminTopics"]);
            }
            else {
                toast.error(res.data.error || "Error desconocido.");
            }
        }
        catch (err) {
            toast.error("Error al eliminar el tema.");
        }
    };
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    return (_jsxs(Container, { className: "admin-container", children: [_jsx("h1", { children: "Gesti\u00F3n de Temas" }), _jsx(Button, { variant: "primary", className: "admin-button-primary mb-3", onClick: () => handleShowModal(), children: "Crear Nuevo Tema" }), isLoading ? (_jsx("div", { className: "text-center my-4", children: _jsx(Spinner, { animation: "border", role: "status", children: _jsx("span", { className: "visually-hidden", children: "Cargando..." }) }) })) : (_jsxs(Table, { striped: true, bordered: true, hover: true, className: "admin-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "ID" }), _jsx("th", { children: "Curso" }), _jsx("th", { children: "T\u00EDtulo" }), _jsx("th", { children: "Creaci\u00F3n" }), _jsx("th", { children: "Actualizaci\u00F3n" }), _jsx("th", { children: "Acciones" })] }) }), _jsx("tbody", { children: topicsData &&
                            topicsData.map((topic) => (_jsxs("tr", { children: [_jsx("td", { children: topic.id }), _jsx("td", { children: topic.course_id }), _jsx("td", { children: topic.title }), _jsx("td", { children: formatDate(topic.created_at) }), _jsx("td", { children: formatDate(topic.updated_at) }), _jsxs("td", { children: [_jsx(Button, { className: "admin-button me-2", onClick: () => handleShowModal(topic), children: "Editar" }), _jsx(Button, { variant: "danger", className: "admin-button", onClick: () => handleDelete(topic.id), children: "Eliminar" })] })] }, topic.id))) })] })), _jsx(TopicModal, { show: showModal, onHide: handleCloseModal, editingTopic: editingTopic, onSuccess: () => queryClient.invalidateQueries(["adminTopics"]) })] }));
};
export default AdminTopics;
