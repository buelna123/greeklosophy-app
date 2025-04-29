import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';
import '@/styles/Footer.css';
export function Footer() {
    return (_jsx("footer", { className: "footer-container", children: _jsxs(Container, { className: "footer-content", children: [_jsxs("div", { className: "footer-brand", children: [_jsx("img", { src: logo, alt: "Logo", className: "footer-logo" }), _jsx("p", { children: "\u00A9 2025 Greeklosophy. Todos los derechos reservados." })] }), _jsxs(Nav, { className: "footer-nav", children: [_jsx(Nav.Link, { as: Link, to: "/acerca", className: "footer-link", children: "Acerca de" }), _jsx(Nav.Link, { as: Link, to: "/terminos", className: "footer-link", children: "T\u00E9rminos" }), _jsx(Nav.Link, { as: Link, to: "/privacidad", className: "footer-link", children: "Privacidad" }), _jsx(Nav.Link, { as: Link, to: "/contacto", className: "footer-link", children: "Contacto" })] })] }) }));
}
