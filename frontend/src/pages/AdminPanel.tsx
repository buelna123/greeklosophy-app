import React from "react";
import { Container, Nav } from "react-bootstrap";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import "../styles/AdminPanel.css";
import { useAuth } from "@/context/AuthContext";

const AdminPanel: React.FC = () => {
  const { isAdmin } = useAuth();
  const location = useLocation();

  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Header />
      <Container fluid className="admin-panel-container">
        <Nav
          variant="tabs"
          activeKey={location.pathname}
          className="admin-panel-tabs"
        >
          <Nav.Item>
            <Nav.Link as={Link} to="/admin/dashboard" eventKey="/admin/dashboard">
              Dashboard
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/admin/courses" eventKey="/admin/courses">
              Cursos
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/admin/articles" eventKey="/admin/articles">
              Artículos
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/admin/topics" eventKey="/admin/topics">
              Temas
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/admin/assignments" eventKey="/admin/assignments">
              Tareas
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/admin/reviews" eventKey="/admin/reviews">
              Revisar Tareas
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/admin/quizzes" eventKey="/admin/quizzes">
              Quizzes
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/admin/exams" eventKey="/admin/exams">
              Exámenes
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Outlet />
      </Container>
      <Footer />
    </>
  );
};

export default AdminPanel;
