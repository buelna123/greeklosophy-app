import React, { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "@/api";

interface ReviewAssignmentModalProps {
  show: boolean;
  onHide: () => void;
  submissionId: number;
  assignmentTitle: string;
  filePath: string;
  defaultGrade?: number | null;
  defaultComment?: string | null;
  onSuccess: () => void;
}

interface APIResponse {
  success?: string;
  error?: string;
}

const ReviewAssignmentModal: React.FC<ReviewAssignmentModalProps> = ({
  show,
  onHide,
  submissionId,
  assignmentTitle,
  filePath,
  defaultGrade,
  defaultComment,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const [grade, setGrade] = useState<number>(defaultGrade ?? 0);
  const [comment, setComment] = useState<string>(defaultComment ?? "");
  const [loading, setLoading] = useState(false);

  const mutation = useMutation<APIResponse, Error, { submissionId: number; grade: number; review_comment: string }>(
    async ({ submissionId, grade, review_comment }) => {
      const res = await api.post<APIResponse>(`/admin/submissions/${submissionId}/feedback`, {
        submission_id: submissionId,
        grade,
        review_comment,
      });
      return res.data;
    },
    {
      onSuccess: (data) => {
        if (data.success) {
          toast.success(data.success);
          queryClient.invalidateQueries(["assignmentSubmissions"]);
          onSuccess();
          onHide();
        } else {
          toast.error(data.error || "Error al guardar la retroalimentación.");
        }
      },
      onError: (error) => {
        toast.error(error.message || "Error al enviar retroalimentación.");
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (grade < 1 || grade > 10) {
      toast.error("La calificación debe ser entre 1 y 10");
      return;
    }
    mutation.mutate({ submissionId, grade, review_comment: comment });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Calificar Entrega</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Tarea</Form.Label>
            <Form.Control type="text" value={assignmentTitle} disabled readOnly />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Archivo Entregado</Form.Label>
            <div>
              <a
                href={`${api.defaults.baseURL}/storage/${filePath}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver archivo
              </a>
            </div>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Calificación (1 a 10)</Form.Label>
            <Form.Control
              type="number"
              value={grade}
              min={1}
              max={10}
              onChange={(e) => setGrade(Number(e.target.value))}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Comentario</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escribe un comentario para el estudiante..."
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button type="submit" variant="primary" disabled={mutation.isLoading}>
              {mutation.isLoading ? <Spinner size="sm" animation="border" /> : "Guardar Calificación"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ReviewAssignmentModal;
