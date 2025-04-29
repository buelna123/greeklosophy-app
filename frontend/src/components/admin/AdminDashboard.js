import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Container, Row, Col, Card, Table, Button, Spinner } from "react-bootstrap";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api"; // Cliente Axios configurado
import { toast } from "react-toastify"; // Importa toast
import "../../styles/admin.css";
const AdminDashboard = () => {
    const queryClient = useQueryClient();
    // Consulta para obtener cursos
    const { data: coursesData, isLoading: loadingCourses, error: errorCourses, } = useQuery({
        queryKey: ["adminCourses"],
        queryFn: async () => {
            const response = await api.get("/courses");
            return response.data.data;
        },
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
    // Consulta para obtener artículos
    const { data: articlesData, isLoading: loadingArticles, error: errorArticles, } = useQuery({
        queryKey: ["adminArticles"],
        queryFn: async () => {
            const response = await api.get("/articles");
            return response.data.data;
        },
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
    // Consulta para obtener usuarios
    const { data: usersData, isLoading: loadingUsers, error: errorUsers, } = useQuery({
        queryKey: ["adminUsers"],
        queryFn: async () => {
            const response = await api.get("/users");
            return response.data.data;
        },
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
    // Mutación para cambiar el estado de un usuario mediante PATCH a la ruta /users/{id}/status
    const mutationToggleStatus = useMutation({
        mutationFn: async ({ id, newStatus }) => {
            const response = await api.patch(`/users/${id}/status`, {
                status: newStatus,
            });
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data.success || "Estado actualizado correctamente.");
            queryClient.invalidateQueries(["adminUsers"]);
        },
        onError: (error) => {
            const errorMsg = error.response?.data?.message || "Error al actualizar el estado.";
            toast.error(errorMsg);
        },
    });
    const toggleStatus = (userId, currentStatus) => {
        const newStatus = currentStatus === "active" ? "inactive" : "active";
        mutationToggleStatus.mutate({ id: userId, newStatus });
    };
    if (loadingCourses || loadingArticles || loadingUsers) {
        return (_jsx(Container, { className: "admin-container text-center mt-5", children: _jsx(Spinner, { animation: "border", role: "status", children: _jsx("span", { className: "visually-hidden", children: "Cargando datos..." }) }) }));
    }
    if (errorCourses || errorArticles || errorUsers || !usersData) {
        const errMsg = errorCourses?.message ||
            errorArticles?.message ||
            errorUsers?.message ||
            "Error al cargar los datos.";
        return (_jsxs(Container, { className: "admin-container text-center mt-5", children: [_jsx("h1", { children: "Error" }), _jsx("p", { children: errMsg })] }));
    }
    const courseCount = coursesData ? coursesData.length : 0;
    const articleCount = articlesData ? articlesData.length : 0;
    const users = usersData;
    return (_jsxs(Container, { className: "admin-container", children: [_jsx("h1", { children: "Dashboard de Administraci\u00F3n" }), _jsxs(Row, { className: "mt-4", children: [_jsx(Col, { md: 4, children: _jsx(Card, { className: "admin-card", children: _jsxs(Card.Body, { children: [_jsx(Card.Title, { className: "admin-card-title", children: "Cursos" }), _jsxs(Card.Text, { className: "admin-card-text", children: ["Total de cursos: ", courseCount] })] }) }) }), _jsx(Col, { md: 4, children: _jsx(Card, { className: "admin-card", children: _jsxs(Card.Body, { children: [_jsx(Card.Title, { className: "admin-card-title", children: "Art\u00EDculos" }), _jsxs(Card.Text, { className: "admin-card-text", children: ["Total de art\u00EDculos: ", articleCount] })] }) }) }), _jsx(Col, { md: 4, children: _jsx(Card, { className: "admin-card", children: _jsxs(Card.Body, { children: [_jsx(Card.Title, { className: "admin-card-title", children: "Usuarios" }), _jsxs(Card.Text, { className: "admin-card-text", children: ["Total de usuarios: ", users.length] })] }) }) })] }), _jsx("h2", { className: "mt-4", children: "Lista de Usuarios" }), _jsxs(Table, { striped: true, bordered: true, hover: true, responsive: true, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Nombre" }), _jsx("th", { children: "Email" }), _jsx("th", { children: "Fecha Registro" }), _jsx("th", { children: "Estado" }), _jsx("th", { children: "Acci\u00F3n" })] }) }), _jsx("tbody", { children: users.length > 0 ? (users.map((user) => (_jsxs("tr", { children: [_jsx("td", { children: user.name }), _jsx("td", { children: user.email }), _jsx("td", { children: new Date(user.fecha_registro).toLocaleDateString() }), _jsx("td", { className: user.status === "active" ? "text-success" : "text-danger", children: user.status === "active" ? "Activo" : "Inactivo" }), _jsx("td", { children: _jsx(Button, { variant: user.status === "active" ? "danger" : "success", size: "sm", onClick: () => toggleStatus(user.id, user.status), children: user.status === "active" ? "Desactivar" : "Activar" }) })] }, user.id)))) : (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "text-center", children: "No hay usuarios registrados." }) })) })] })] }));
};
export default AdminDashboard;
