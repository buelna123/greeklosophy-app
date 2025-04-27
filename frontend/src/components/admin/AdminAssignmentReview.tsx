import React, { useState } from "react";
import { Container, Table, Button, Spinner, Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api";
import { FaEdit } from "react-icons/fa";
import "@/styles/admin.css";

interface Submission {
  id: number;
  assignment_id: number;
  user_name: string;
  course_name: string;
  submitted_at: string;
  grade: number | null;
  review_comment: string | null;
  file_path: string;
}

interface APIResponse {
  success?: string;
  error?: string;
}

const AdminAssignmentReview: React.FC = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState<Submission | null>(null);
  const [grade, setGrade] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const { data: submissions, isLoading } = useQuery<Submission[]>({
    queryKey: ["assignmentReviewList"],
    queryFn: async () => {
      const res = await api.get<{ submissions: Submission[] }>("/admin/assignment-reviews");
      return res.data.submissions;
    },
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchInterval: 30000, // auto-refresh
    staleTime: 1000 * 60,
  });

  const mutation = useMutation<APIResponse, Error, { submissionId: number; grade: number; review_comment: string }>(
    async ({ submissionId, grade, review_comment }) => {
      const res = await api.post<APIResponse>(
        `/admin/submissions/${submissionId}/feedback`,
        { grade, review_comment }
      );
      return res.data;
    },
    {
      onSuccess: (data) => {
        toast.success(data.success || "Calificación guardada.");
        queryClient.invalidateQueries(["assignmentReviewList"]);
        handleClose();
      },
      onError: (err) => {
        toast.error(err.message || "Error al calificar.");
      },
    }
  );

  const handleOpen = (submission: Submission) => {
    setCurrent(submission);
    setGrade(submission.grade ?? 0);
    setComment(submission.review_comment ?? "");
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrent(null);
    setGrade(0);
    setComment("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!current) return;
    mutation.mutate({ submissionId: current.id, grade, review_comment: comment });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFileUrl = (path: string) => {
    const cleanPath = path.replace(/^\/?storage\//, "");
    return `${api.defaults.baseURL?.replace("/api", "")}/storage/${cleanPath}`;
  };

  return (
    <Container className="admin-container">
      <h1>Revisión de Entregas</h1>
      {isLoading ? (
        <div className="text-center my-4">
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <Table striped bordered hover responsive className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Curso</th>
              <th>Alumno</th>
              <th>Fecha de Entrega</th>
              <th>Calificación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {submissions?.length ? (
              submissions.map((sub) => (
                <tr key={sub.id}>
                  <td>{sub.id}</td>
                  <td>{sub.course_name}</td>
                  <td>{sub.user_name}</td>
                  <td>{formatDate(sub.submitted_at)}</td>
                  <td>{sub.grade ?? "—"}</td>
                  <td>
                    <Button size="sm" variant="secondary" onClick={() => handleOpen(sub)}>
                      <FaEdit className="me-1" /> Calificar
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center text-muted py-4">
                  No hay entregas disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Calificar Entrega #{current?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Archivo Entregado</Form.Label>
              <div>
                {current?.file_path ? (
                  <a href={getFileUrl(current.file_path)} target="_blank" rel="noopener noreferrer">
                    Ver archivo
                  </a>
                ) : (
                  <span className="text-muted">Sin archivo</span>
                )}
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Calificación (1-10)</Form.Label>
              <Form.Control
                type="number"
                min={1}
                max={10}
                value={grade}
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
              />
            </Form.Group>
            <div className="text-end">
              <Button variant="primary" type="submit" disabled={mutation.isLoading}>
                {mutation.isLoading ? "Guardando..." : "Guardar Calificación"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminAssignmentReview;
