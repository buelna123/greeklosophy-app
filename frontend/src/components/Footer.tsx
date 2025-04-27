import { Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png'; 
import '@/styles/Footer.css';

export function Footer() {
    return (
        <footer className="footer-container">
            <Container className="footer-content">
                <div className="footer-brand">
                    <img src={logo} alt="Logo" className="footer-logo" />
                    <p>&copy; 2025 Greeklosophy. Todos los derechos reservados.</p>
                </div>
                <Nav className="footer-nav">
                    <Nav.Link as={Link} to="/acerca" className="footer-link">Acerca de</Nav.Link>
                    <Nav.Link as={Link} to="/terminos" className="footer-link">Términos</Nav.Link>
                    <Nav.Link as={Link} to="/privacidad" className="footer-link">Privacidad</Nav.Link>
                    <Nav.Link as={Link} to="/contacto" className="footer-link">Contacto</Nav.Link>
                </Nav>
            </Container>
        </footer>
    );
}
