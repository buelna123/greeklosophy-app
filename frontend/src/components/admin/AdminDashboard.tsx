import React from "react";
import { Container, Row, Col, Card, Table, Button, Spinner } from "react-bootstrap";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api"; // Cliente Axios configurado
import { toast } from "react-toastify"; // Importa toast
import "../../styles/admin.css";

interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  fecha_registro: string;
  status: string;
}

interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  // Otros campos de paginación si se requieren.
}

const AdminDashboard = () => {
  const queryClient = useQueryClient();

  // Consulta para obtener cursos
  const {
    data: coursesData,
    isLoading: loadingCourses,
    error: errorCourses,
  } = useQuery<Course[]>({
    queryKey: ["adminCourses"],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Course>>("/courses");
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Consulta para obtener artículos
  const {
    data: articlesData,
    isLoading: loadingArticles,
    error: errorArticles,
  } = useQuery<Article[]>({
    queryKey: ["adminArticles"],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Article>>("/articles");
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Consulta para obtener usuarios
  const {
    data: usersData,
    isLoading: loadingUsers,
    error: errorUsers,
  } = useQuery<User[]>({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<User>>("/users");
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Mutación para cambiar el estado de un usuario mediante PATCH a la ruta /users/{id}/status
  const mutationToggleStatus = useMutation<
    { success?: string },
    unknown,
    { id: number; newStatus: string }
  >({
    mutationFn: async ({ id, newStatus }) => {
      const response = await api.patch<{ success?: string }>(`/users/${id}/status`, {
        status: newStatus,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.success || "Estado actualizado correctamente.");
      queryClient.invalidateQueries(["adminUsers"]);
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || "Error al actualizar el estado.";
      toast.error(errorMsg);
    },
  });

  const toggleStatus = (userId: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    mutationToggleStatus.mutate({ id: userId, newStatus });
  };

  if (loadingCourses || loadingArticles || loadingUsers) {
    return (
      <Container className="admin-container text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando datos...</span>
        </Spinner>
      </Container>
    );
  }

  if (errorCourses || errorArticles || errorUsers || !usersData) {
    const errMsg =
      (errorCourses as any)?.message ||
      (errorArticles as any)?.message ||
      (errorUsers as any)?.message ||
      "Error al cargar los datos.";
    return (
      <Container className="admin-container text-center mt-5">
        <h1>Error</h1>
        <p>{errMsg}</p>
      </Container>
    );
  }

  const courseCount = coursesData ? coursesData.length : 0;
  const articleCount = articlesData ? articlesData.length : 0;
  const users = usersData;

  return (
    <Container className="admin-container">
      <h1>Dashboard de Administración</h1>
      <Row className="mt-4">
        <Col md={4}>
          <Card className="admin-card">
            <Card.Body>
              <Card.Title className="admin-card-title">Cursos</Card.Title>
              <Card.Text className="admin-card-text">
                Total de cursos: {courseCount}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="admin-card">
            <Card.Body>
              <Card.Title className="admin-card-title">Artículos</Card.Title>
              <Card.Text className="admin-card-text">
                Total de artículos: {articleCount}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="admin-card">
            <Card.Body>
              <Card.Title className="admin-card-title">Usuarios</Card.Title>
              <Card.Text className="admin-card-text">
                Total de usuarios: {users.length}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h2 className="mt-4">Lista de Usuarios</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Fecha Registro</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{new Date(user.fecha_registro).toLocaleDateString()}</td>
                <td className={user.status === "active" ? "text-success" : "text-danger"}>
                  {user.status === "active" ? "Activo" : "Inactivo"}
                </td>
                <td>
                  <Button
                    variant={user.status === "active" ? "danger" : "success"}
                    size="sm"
                    onClick={() => toggleStatus(user.id, user.status)}
                  >
                    {user.status === "active" ? "Desactivar" : "Activar"}
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center">
                No hay usuarios registrados.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminDashboard;
