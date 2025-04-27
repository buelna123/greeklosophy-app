import { useEffect, useState } from "react";
import { Container, Card, ListGroup } from "react-bootstrap";
import api from "@/api"; // Importamos el cliente Axios

interface Curso {
  id: number;
  title: string;
  description: string;
}

const Dashboard = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Hacemos la solicitud al backend de Laravel
        const response = await api.get("/courses");
        
        // Usamos type assertion para asegurar que 'response.data' es de tipo 'Curso[]'
        const data = response.data as Curso[];

        if (!data || data.length === 0) {
          setError("No se encontraron cursos.");
        } else {
          setCursos(data);
        }
      } catch (error: unknown) {
        // Verificamos que el error sea de tipo Error
        if (error instanceof Error) {
          setError(`Error al cargar los cursos: ${error.message}`);
        } else {
          setError("Error desconocido al cargar los cursos.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container className="mt-4">
        <h2 style={{ backgroundColor: "red" }}>Mis Cursos</h2>
        <p>Cargando cursos...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <h2 style={{ backgroundColor: "red" }}>Mis Cursos</h2>
        <p>{error}</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 style={{ backgroundColor: "red" }}>Mis Cursos</h2>
      <ListGroup>
        {cursos.map((curso) => (
          <ListGroup.Item key={curso.id}>
            <Card>
              <Card.Body>
                <Card.Title>{curso.title}</Card.Title>
                <Card.Text>{curso.description}</Card.Text>
              </Card.Body>
            </Card>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default Dashboard;