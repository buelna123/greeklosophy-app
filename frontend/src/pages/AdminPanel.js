import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Container, Nav } from "react-bootstrap";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import "../styles/AdminPanel.css";
import { useAuth } from "@/context/AuthContext";
const AdminPanel = () => {
    const { isAdmin } = useAuth();
    const location = useLocation();
    if (!isAdmin()) {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    return (_jsxs(_Fragment, { children: [_jsx(Header, {}), _jsxs(Container, { fluid: true, className: "admin-panel-container", children: [_jsxs(Nav, { variant: "tabs", activeKey: location.pathname, className: "admin-panel-tabs", children: [_jsx(Nav.Item, { children: _jsx(Nav.Link, { as: Link, to: "/admin/dashboard", eventKey: "/admin/dashboard", children: "Dashboard" }) }), _jsx(Nav.Item, { children: _jsx(Nav.Link, { as: Link, to: "/admin/courses", eventKey: "/admin/courses", children: "Cursos" }) }), _jsx(Nav.Item, { children: _jsx(Nav.Link, { as: Link, to: "/admin/articles", eventKey: "/admin/articles", children: "Art\u00EDculos" }) }), _jsx(Nav.Item, { children: _jsx(Nav.Link, { as: Link, to: "/admin/topics", eventKey: "/admin/topics", children: "Temas" }) }), _jsx(Nav.Item, { children: _jsx(Nav.Link, { as: Link, to: "/admin/assignments", eventKey: "/admin/assignments", children: "Tareas" }) }), _jsx(Nav.Item, { children: _jsx(Nav.Link, { as: Link, to: "/admin/reviews", eventKey: "/admin/reviews", children: "Revisar Tareas" }) }), _jsx(Nav.Item, { children: _jsx(Nav.Link, { as: Link, to: "/admin/quizzes", eventKey: "/admin/quizzes", children: "Quizzes" }) }), _jsx(Nav.Item, { children: _jsx(Nav.Link, { as: Link, to: "/admin/exams", eventKey: "/admin/exams", children: "Ex\u00E1menes" }) })] }), _jsx(Outlet, {})] }), _jsx(Footer, {})] }));
};
export default AdminPanel;
