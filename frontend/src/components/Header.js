import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaBell } from "react-icons/fa";
import SearchBar from "./SearchBar";
import logo from "@/assets/logo.png";
import "@/styles/Header.css";
import { useAuth } from "@/context/AuthContext";
import { ModalProfile } from "./ModalProfile";
import api from "@/api";
export function Header() {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const handleLogout = async () => {
        try {
            // Cerrar sesión a través de la API y limpiar la sesión
            await api.post("/logout");
            logout();
            navigate("/");
        }
        catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };
    return (_jsxs(Navbar, { bg: "white", variant: "light", expand: "lg", fixed: "top", className: "custom-navbar", children: [_jsxs(Container, { children: [_jsxs(Navbar.Brand, { as: Link, to: "/", className: "brand", children: [_jsx("img", { src: logo, alt: "Logo", className: "logo" }), _jsx("span", { className: "brand-text", children: "Greeklosophy" })] }), _jsx(Navbar.Toggle, { "aria-controls": "basic-navbar-nav" }), _jsxs(Navbar.Collapse, { id: "basic-navbar-nav", children: [_jsxs(Nav, { className: "me-auto", children: [_jsx(Nav.Link, { as: Link, to: "/", className: "nav-link", children: "Inicio" }), user?.role === "student" && (_jsx(Nav.Link, { as: Link, to: "/dashboard", className: "nav-link", children: "Dashboard" })), user?.role === "admin" && (_jsx(Nav.Link, { as: Link, to: "/admin", className: "nav-link", children: "Admin" })), _jsx(Nav.Link, { as: Link, to: "/courses", className: "nav-link", children: "Cursos" }), _jsx(Nav.Link, { as: Link, to: "/articles", className: "nav-link", children: "Blog" }), _jsx(Nav.Link, { as: Link, to: "/contacto", className: "nav-link", children: "Contacto" })] }), _jsx(SearchBar, {}), _jsxs(Nav, { className: "ms-2", children: [_jsx(Nav.Link, { onClick: () => setShowNotifications(true), className: "icon-link", children: _jsx(FaBell, {}) }), _jsx(Nav.Link, { onClick: () => setShowProfile(true), className: "icon-link", children: _jsx(FaUser, {}) })] })] })] }), _jsx(ModalProfile, { show: showProfile, onHide: () => setShowProfile(false) })] }));
}
