import React from "react";
import { Container, Row, Col, Card, Alert, Spinner } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { FaAward, FaMedal } from "react-icons/fa";
import api from "@/api";
import "@/styles/CourseExperience.css";

interface BadgeData {
  id: number;
  name: string;
  description: string;
  criteria: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

interface UserBadge {
  id: number;
  user_id: number;
  badge_id: number;
  awarded_at: string;
  created_at: string;
  updated_at: string;
  badge: BadgeData;
}

const BadgeList: React.FC = () => {
  const { id: courseId } = useParams<{ id: string }>();

  const { data: badges, isLoading, error } = useQuery<UserBadge[]>({
    queryKey: ["courseBadges", courseId],
    queryFn: async () => {
      const response = await api.get<UserBadge[]>(`/courses/${courseId}/badges`);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <Container className="course-experience-container text-center my-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="course-experience-container">
        <Alert variant="danger">
          {(error as Error).message || "Error al cargar las medallas."}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="course-experience-container">
      <h2 className="mb-4 d-flex align-items-center gap-2">
        <FaAward /> Medallas Obtenidas
      </h2>

      {badges && badges.length > 0 ? (
        <Row className="badge-list">
          {badges.map((userBadge) => (
            <Col key={userBadge.id} md={4} className="mb-4">
              <Card className="text-center shadow-sm h-100">
                <Card.Body>
                  <FaMedal size={60} color="#FFD700" className="mb-3" />
                  <Card.Title>{userBadge.badge.name}</Card.Title>
                  <Card.Text>{userBadge.badge.description}</Card.Text>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted">
                    Obtenida: {new Date(userBadge.awarded_at).toLocaleDateString()}
                  </small>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info" className="text-center">
          No se han asignado medallas aún.
        </Alert>
      )}
    </Container>
  );
};

export default BadgeList;
