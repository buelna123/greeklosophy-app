// src/components/admin/AdminQuizzes.tsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Button,
  Collapse,
  Spinner,
  ListGroup,
  Form
} from "react-bootstrap";
import { useQueryClient } from "@tanstack/react-query";
import Select from "react-select";
import { useCoursesQuery } from "@/hooks/useCourses";
import { useAdminQuizzes } from "@/hooks/useAdminQuizzes";
import QuizModal from "./modals/QuizModal";
import { useSearchParams } from "react-router-dom";
import "../../styles/admin.css";

const AdminQuizzes: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const initialCourseId = searchParams.get("course");
  const initialCourseTitle = searchParams.get("title");

  const [selectedCourse, setSelectedCourse] = useState<{ value: number; label: string } | null>(
    initialCourseId && initialCourseTitle
      ? { value: parseInt(initialCourseId), label: initialCourseTitle }
      : null
  );

  const [expandedTopic, setExpandedTopic] = useState<number | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [selectedQuizQuestions, setSelectedQuizQuestions] = useState<any[] | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { data: courseList, isLoading: loadingCourses } = useCoursesQuery();
  const courseOptions = courseList?.map(c => ({ value: c.id, label: c.title })) || [];

  const {
    data: quizzesData = [],
    isLoading: loadingQuizzes,
    isError
  } = useAdminQuizzes(selectedCourse?.value);

  useEffect(() => {
    if (!selectedCourse && initialCourseId && courseList) {
      const match = courseList.find(c => c.id === parseInt(initialCourseId));
      if (match) {
        setSelectedCourse({ value: match.id, label: match.title });
      }
    }
  }, [courseList]);

  const toggleTopic = (id: number) => {
    setExpandedTopic(prev => (prev === id ? null : id));
  };

  const handleEdit = (topicId: number) => {
    const quizGroup = quizzesData.find(q => q.topic_id === topicId);
    if (quizGroup) {
      setSelectedTopicId(topicId);
      setSelectedQuizQuestions(quizGroup.quizQuestions);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTopicId(null);
    setSelectedQuizQuestions(null);
  };

  return (
    <Container className="admin-container">
      <h1>Gestión de Quizzes</h1>

      <Form.Group className="mb-3" style={{ maxWidth: 400 }}>
        <Form.Label>Seleccionar curso</Form.Label>
        {loadingCourses ? (
          <Spinner animation="border" />
        ) : (
          <Select
            value={selectedCourse}
            options={courseOptions}
            onChange={(opt) => setSelectedCourse(opt)}
            placeholder="Elige un curso..."
          />
        )}
      </Form.Group>

      {!selectedCourse ? (
        <div className="text-muted">Selecciona un curso para ver los quizzes.</div>
      ) : loadingQuizzes ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : isError ? (
        <div className="text-danger">Error al cargar quizzes del curso.</div>
      ) : quizzesData.length === 0 ? (
        <div className="text-muted">No hay quizzes disponibles para este curso.</div>
      ) : (
        quizzesData.map(group => (
          <Card key={group.topic_id} className="mb-3 shadow-sm">
            <Card.Header
              onClick={() => toggleTopic(group.topic_id)}
              className="d-flex justify-content-between align-items-center clickable"
              style={{ cursor: "pointer" }}
            >
              <span className="fw-bold">Tema: {group.topic_title}</span>
              <Button
                variant="outline-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(group.topic_id);
                }}
              >
                Editar
              </Button>
            </Card.Header>
            <Collapse in={expandedTopic === group.topic_id}>
              <Card.Body>
                {group.quizQuestions.length === 0 ? (
                  <p className="text-muted">No hay preguntas asignadas.</p>
                ) : (
                  <ListGroup>
                    {group.quizQuestions.map((question) => (
                      <ListGroup.Item key={question.id}>
                        <strong>{question.question_text}</strong> ({question.points} pts)
                        <ul>
                          {question.quizOptions.map((opt) => (
                            <li key={opt.id}>
                              {opt.option_text} {opt.is_correct ? "✔️" : ""}
                            </li>
                          ))}
                        </ul>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Collapse>
          </Card>
        ))
      )}

      {selectedTopicId !== null && selectedQuizQuestions !== null && (
        <QuizModal
          topicId={selectedTopicId}
          initialQuestions={selectedQuizQuestions}
          show={showModal}
          onHide={handleCloseModal}
          onSuccess={() => {
            if (selectedCourse?.value) {
              queryClient.invalidateQueries(["adminQuizzes", selectedCourse.value]);
            }
          }}
        />
      )}
    </Container>
  );
};

export default AdminQuizzes;
