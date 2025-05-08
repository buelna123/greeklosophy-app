import { Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaInfoCircle, 
  FaFileContract, 
  FaLock, 
  FaEnvelope,
  FaCopyright
} from 'react-icons/fa';
import logo from '@/assets/logo.png'; 
import '@/styles/Footer.css';

export function Footer() {
    return (
        <footer className="gl-footer-container">
            <Container className="gl-footer-content">
                <div className="gl-footer-brand">
                    <img src={logo} alt="Logo" className="gl-footer-logo" />
                    <p><FaCopyright className="gl-copyright-icon" /> 2025 Greeklosophy. Todos los derechos reservados.</p>
                </div>
                <Nav className="gl-footer-nav">
                    <Nav.Link as={Link} to="/acerca" className="gl-footer-link">
                        <FaInfoCircle className="gl-footer-icon" /> Acerca de
                    </Nav.Link>
                    <Nav.Link as={Link} to="/terminos" className="gl-footer-link">
                        <FaFileContract className="gl-footer-icon" /> Términos
                    </Nav.Link>
                    <Nav.Link as={Link} to="/privacidad" className="gl-footer-link">
                        <FaLock className="gl-footer-icon" /> Privacidad
                    </Nav.Link>
                    <Nav.Link as={Link} to="/contacto" className="gl-footer-link">
                        <FaEnvelope className="gl-footer-icon" /> Contacto
                    </Nav.Link>
                </Nav>
            </Container>
        </footer>
    );
}