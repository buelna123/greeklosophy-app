// src/components/course/TopicDetail.tsx
import React, { useRef } from "react";
import { Container, Card, Alert, Button } from "react-bootstrap";
import { useParams, Link, Outlet } from "react-router-dom";
import { useCourseContext } from "@/context/CourseContext";
import { FaPen } from "react-icons/fa";
import "@/styles/CourseExperience.css";

const TopicDetail: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { topicId } = useParams<{ topicId: string }>();
  const { topics } = useCourseContext();

  const topic = topics.find((t) => t.id.toString() === topicId);

  if (!topic) {
    return (
      <Container className="course-experience-container" ref={containerRef}>
        <Alert variant="danger">Tema no encontrado.</Alert>
      </Container>
    );
  }

  return (
    <Container className="course-experience-container" ref={containerRef}>
      <h2 className="mb-4">{topic.title}</h2>
      <Card className="content-area mb-4">
        <Card.Body>
          <Card.Text>{topic.content}</Card.Text>
          <Button
            as={Link as any}
            to="quiz"
            variant="primary"
            className="btn-primary d-flex align-items-center gap-2 mt-3"
          >
            <FaPen /> Realizar Quiz
          </Button>
        </Card.Body>
      </Card>
      <Outlet />
    </Container>
  );
};

export default TopicDetail;
