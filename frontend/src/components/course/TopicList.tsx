import React from "react";
import { Container, Row, Col, Card, Alert, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useCourseContext } from "@/context/CourseContext";
import { FaBookOpen, FaArrowRight } from "react-icons/fa";
import "@/styles/CourseExperience.css";

const TopicList: React.FC = () => {
  const { topics } = useCourseContext();
  const { id: courseId } = useParams<{ id: string }>();

  if (!topics || topics.length === 0) {
    return (
      <Container className="course-experience-container">
        <Alert variant="warning">
          No hay temas disponibles para este curso.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="course-experience-container">
      <h2 className="mb-4 d-flex align-items-center gap-2">
        <FaBookOpen /> Lista de Temas
      </h2>
      <Row>
        {topics.map((topic) => (
          <Col key={topic.id} md={6} className="mb-4">
            <Card className="content-area uniform-card shadow-sm h-100">
              <Card.Body>
                <Card.Title>{topic.title}</Card.Title>
                <Card.Text>
                  {topic.content.length > 100
                    ? topic.content.substring(0, 100) + "..."
                    : topic.content}
                </Card.Text>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-end">
                <Button
                  as={Link as any}
                  to={`/course-experience/${courseId}/topics/${topic.id}`}
                  variant="primary"
                  className="d-flex align-items-center gap-2"
                >
                  Ver Detalle <FaArrowRight />
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default TopicList;
