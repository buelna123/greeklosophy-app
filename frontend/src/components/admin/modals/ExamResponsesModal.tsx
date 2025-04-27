// src/components/admin/modals/ExamResponsesModal.tsx

import React from "react";
import {
  Modal,
  Button,
  Table,
  Accordion,
  Spinner,
} from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useExamResponses } from "@/hooks/useExamResponses"; // 🔥 Ahora sí: usar hook dinámico
import "@/styles/admin.css";

interface ExamResponsesModalProps {
  show: boolean;
  onHide: () => void;
  courseId: number;
}

const ExamResponsesModal: React.FC<ExamResponsesModalProps> = ({
  show,
  onHide,
  courseId,
}) => {
  const { data, isLoading, error } = useExamResponses(courseId); // 🔥 Se trae solo el curso actual

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="admin-modal">
      <Modal.Header closeButton>
        <Modal.Title>Respuestas del Examen</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <div className="text-center my-4">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </div>
        ) : error ? (
          <div className="text-center my-4 text-danger">
            Error al cargar las respuestas del examen. <br />
            {error instanceof Error ? error.message : "Intenta recargar la página."}
          </div>
        ) : !data || data.length === 0 ? (
          <p className="text-center">Aún no hay alumnos que hayan respondido este examen.</p>
        ) : (
          <Accordion>
            {data.map((result, index) => (
              <Accordion.Item eventKey={index.toString()} key={`user-${result.user.id}`}>
                <Accordion.Header>
                  <div className="d-flex flex-column w-100">
                    <div className="d-flex justify-content-between">
                      <div>
                        <strong>{result.user.name}</strong><br />
                        <small>{result.user.email}</small>
                      </div>
                      <div className="text-end">
                        <strong>Calificación:</strong> {result.score}<br />
                        {result.passed ? (
                          <span className="text-success">✔️ Aprobado</span>
                        ) : (
                          <span className="text-danger">❌ No Aprobado</span>
                        )}
                        <br />
                        <strong>Fecha:</strong> {formatDate(result.created_at)}
                      </div>
                    </div>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <Table striped bordered hover responsive className="admin-table">
                    <thead>
                      <tr>
                        <th>Pregunta</th>
                        <th>Respuesta Seleccionada</th>
                        <th>¿Correcta?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.answers.map((answer, idx) => (
                        <tr key={`answer-${idx}`}>
                          <td>{answer.question_text}</td>
                          <td>{answer.selected_option || "(sin respuesta)"}</td>
                          <td className="text-center">
                            {answer.is_correct ? (
                              <FaCheckCircle color="green" />
                            ) : (
                              <FaTimesCircle color="red" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExamResponsesModal;
