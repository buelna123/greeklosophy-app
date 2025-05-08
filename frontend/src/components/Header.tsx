import { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaHome, 
  FaChartLine, 
  FaUserCog, 
  FaBook, 
  FaBlog, 
  FaEnvelope 
} from "react-icons/fa";
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
      await api.post("/logout");
      logout();
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <Navbar bg="white" variant="light" expand="lg" fixed="top" className="custom-navbar">
      <Container fluid="lg">
        <Navbar.Brand as={Link} to="/" className="brand">
          <img src={logo} alt="Logo" className="logo" />
          <span className="brand-text d-none d-sm-inline">Greeklosophy</span>
        </Navbar.Brand>
        
        <div className="d-flex align-items-center mobile-icons">
          <Navbar.Toggle aria-controls="main-navbar" className="border-0" />
        </div>

        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto main-nav">
            <Nav.Link as={Link} to="/" className="nav-link">
              <FaHome className="nav-icon" />
              <span className="nav-text">Inicio</span>
            </Nav.Link>
            
            {user?.role === "student" && (
              <Nav.Link as={Link} to="/dashboard" className="nav-link">
                <FaChartLine className="nav-icon" />
                <span className="nav-text">Dashboard</span>
              </Nav.Link>
            )}
            
            {user?.role === "admin" && (
              <Nav.Link as={Link} to="/admin" className="nav-link">
                <FaUserCog className="nav-icon" />
                <span className="nav-text">Admin</span>
              </Nav.Link>
            )}
            
            <Nav.Link as={Link} to="/courses" className="nav-link">
              <FaBook className="nav-icon" />
              <span className="nav-text">Cursos</span>
            </Nav.Link>
            
            <Nav.Link as={Link} to="/articles" className="nav-link">
              <FaBlog className="nav-icon" />
              <span className="nav-text">Blog</span>
            </Nav.Link>
            
            <Nav.Link as={Link} to="/contacto" className="nav-link">
              <FaEnvelope className="nav-icon" />
              <span className="nav-text">Contacto</span>
            </Nav.Link>
          </Nav>
          
          <div className="d-flex align-items-center search-profile-container">
            <SearchBar />
            <Nav.Link 
              onClick={() => setShowProfile(true)} 
              className="icon-link profile-icon desktop-profile"
              aria-label="Perfil"
            >
              <FaUser />
            </Nav.Link>
          </div>
        </Navbar.Collapse>
      </Container>
      <ModalProfile show={showProfile} onHide={() => setShowProfile(false)} />
    </Navbar>
  );
}