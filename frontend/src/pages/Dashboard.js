import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Container, Card, ListGroup } from "react-bootstrap";
import api from "@/api"; // Importamos el cliente Axios
const Dashboard = () => {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Hacemos la solicitud al backend de Laravel
                const response = await api.get("/courses");
                // Usamos type assertion para asegurar que 'response.data' es de tipo 'Curso[]'
                const data = response.data;
                if (!data || data.length === 0) {
                    setError("No se encontraron cursos.");
                }
                else {
                    setCursos(data);
                }
            }
            catch (error) {
                // Verificamos que el error sea de tipo Error
                if (error instanceof Error) {
                    setError(`Error al cargar los cursos: ${error.message}`);
                }
                else {
                    setError("Error desconocido al cargar los cursos.");
                }
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    if (loading) {
        return (_jsxs(Container, { className: "mt-4", children: [_jsx("h2", { style: { backgroundColor: "red" }, children: "Mis Cursos" }), _jsx("p", { children: "Cargando cursos..." })] }));
    }
    if (error) {
        return (_jsxs(Container, { className: "mt-4", children: [_jsx("h2", { style: { backgroundColor: "red" }, children: "Mis Cursos" }), _jsx("p", { children: error })] }));
    }
    return (_jsxs(Container, { className: "mt-4", children: [_jsx("h2", { style: { backgroundColor: "red" }, children: "Mis Cursos" }), _jsx(ListGroup, { children: cursos.map((curso) => (_jsx(ListGroup.Item, { children: _jsx(Card, { children: _jsxs(Card.Body, { children: [_jsx(Card.Title, { children: curso.title }), _jsx(Card.Text, { children: curso.description })] }) }) }, curso.id))) })] }));
};
export default Dashboard;
