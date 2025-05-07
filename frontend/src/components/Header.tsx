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
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <Navbar bg="white" variant="light" expand="lg" fixed="top" className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand">
          <img src={logo} alt="Logo" className="logo" />
          <span className="brand-text">Greeklosophy</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="nav-link">Inicio</Nav.Link>
            {user?.role === "student" && (
              <Nav.Link as={Link} to="/dashboard" className="nav-link">
                Dashboard
              </Nav.Link>
            )}
            {user?.role === "admin" && (
              <Nav.Link as={Link} to="/admin" className="nav-link">
                Admin
              </Nav.Link>
            )}
            <Nav.Link as={Link} to="/courses" className="nav-link">Cursos</Nav.Link>
            <Nav.Link as={Link} to="/articles" className="nav-link">Blog</Nav.Link>
            <Nav.Link as={Link} to="/contacto" className="nav-link">Contacto</Nav.Link>
          </Nav>
          <SearchBar />
          <Nav className="ms-2">
            <Nav.Link onClick={() => setShowProfile(true)} className="icon-link">
              <FaUser />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
      <ModalProfile show={showProfile} onHide={() => setShowProfile(false)} />
    </Navbar>
  );
}
