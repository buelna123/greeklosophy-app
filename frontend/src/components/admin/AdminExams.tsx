// src/components/admin/AdminExams.tsx

import React, { useState } from "react";
import {
  Container,
  Card,
  Button,
  Collapse,
  Spinner,
  ListGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaBell, FaBellSlash } from "react-icons/fa";
import ExamModal from "./modals/ExamModal";
import ExamResponsesModal from "./modals/ExamResponsesModal";
import api from "@/api";
import "../../styles/admin.css";

interface ExamOption {
  id: number;
  option_text: string;
  is_correct: boolean;
}

interface ExamQuestion {
  id: number;
  question_text: string;
  points: number;
  examOptions?: ExamOption[];
}

interface Exam {
  id: number;
  course_id: number;
  title: string;
  description: string;
  examQuestions?: ExamQuestion[];
  course?: {
    id: number;
    title: string;
  };
  created_at: string;
  updated_at: string;
}

const AdminExams: React.FC = () => {
  const queryClient = useQueryClient();
  const [expandedExamId, setExpandedExamId] = useState<number | null>(null);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showResponsesModal, setShowResponsesModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  const { data: exams, isLoading } = useQuery<Exam[]>({
    queryKey: ["adminExams"],
    queryFn: async () => {
      const res = await api.get<{ data: any[] }>("/admin/exams");
      return res.data.data.map((exam) => ({
        ...exam,
        examQuestions: exam.exam_questions?.map((q: any) => ({
          id: q.id,
          question_text: q.question_text,
          points: q.points,
          examOptions: q.exam_options?.map((opt: any) => ({
            id: opt.id,
            option_text: opt.option_text,
            is_correct: !!opt.is_correct,
          })),
        })),
      }));
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: allResponses, isLoading: loadingResponses } = useQuery({
    queryKey: ["allCourseExamResponses"],
    queryFn: async () => {
      const res = await api.get<{ data: any[] }>("/course-exams/results");
      return res.data.data;
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const handleToggle = (examId: number) => {
    setExpandedExamId((prev) => (prev === examId ? null : examId));
  };

  const handleEdit = (exam: Exam) => {
    setSelectedExam(exam);
    setShowModal(true);
  };

  const handleShowResponses = (courseId: number) => {
    setSelectedCourseId(courseId);
    setShowResponsesModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedExam(null);
  };

  const handleCloseResponses = () => {
    setShowResponsesModal(false);
    setSelectedCourseId(null);
  };

  const handleSuccess = (updatedExam: Exam) => {
    queryClient.setQueryData<Exam[]>(["adminExams"], (prev) => {
      if (!prev) return [];
      return prev.map((ex) =>
        ex.course_id === updatedExam.course_id ? updatedExam : ex
      );
    });
    setShowModal(false);
  };

  const getHasResponses = (courseId: number) => {
    if (!allResponses) return false;
    return allResponses.some((resp) => resp.course_id === courseId);
  };

  return (
    <Container className="admin-container">
      <h1>Gestión de Exámenes</h1>

      {isLoading ? (
        <div className="text-center my-4">
          <Spinner animation="border" />
        </div>
      ) : (
        exams?.map((exam) => {
          const hasResponses = getHasResponses(exam.course_id);

          return (
            <Card key={exam.id} className="mb-3 shadow-sm">
              <Card.Header
                onClick={() => handleToggle(exam.id)}
                className="d-flex justify-content-between align-items-center clickable"
                style={{ cursor: "pointer" }}
              >
                <div>
                  <strong>Curso:</strong> {exam.course?.title || "Sin curso"} <br />
                  <strong>Título:</strong> {exam.title}
                </div>
                <div className="d-flex align-items-center gap-2">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>{hasResponses ? "Hay respuestas nuevas" : "Sin respuestas aún"}</Tooltip>}
                  >
                    <Button
                      variant={hasResponses ? "danger" : "outline-secondary"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShowResponses(exam.course_id);
                      }}
                    >
                    {hasResponses ? (
                        <FaBell color="white" />
                      ) : (
                        <FaBellSlash color="black" />
                      )}    
                    </Button>
                  </OverlayTrigger>
                  <Button
                    variant="danger" className="admin-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(exam);
                    }}
                  >
                    Editar
                  </Button>
                </div>
              </Card.Header>

              <Collapse in={expandedExamId === exam.id}>
                <Card.Body>
                  <p><strong>Descripción:</strong> {exam.description}</p>
                  {!exam.examQuestions?.length ? (
                    <p className="text-muted">No hay preguntas asignadas.</p>
                  ) : (
                    <ListGroup>
                      {exam.examQuestions.map((question) => (
                        <ListGroup.Item key={`question-${question.id}`}>
                          <strong>{question.question_text}</strong> ({question.points} pts)
                          <ul className="mb-0">
                            {question.examOptions?.length ? (
                              question.examOptions.map((opt) => (
                                <li key={`option-${opt.id}`}>
                                  {opt.option_text} {opt.is_correct ? "✔️" : ""}
                                </li>
                              ))
                            ) : (
                              <li className="text-muted">Sin opciones disponibles</li>
                            )}
                          </ul>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Card.Body>
              </Collapse>
            </Card>
          );
        })
      )}

      {selectedExam && (
        <ExamModal
          show={showModal}
          onHide={handleCloseModal}
          onSuccess={handleSuccess}
          initialData={selectedExam}
        />
      )}

      {showResponsesModal && selectedCourseId !== null && (
        <ExamResponsesModal
          show={showResponsesModal}
          onHide={handleCloseResponses}
          courseId={selectedCourseId}
        />
      )}
    </Container>
  );
};

export default AdminExams;
