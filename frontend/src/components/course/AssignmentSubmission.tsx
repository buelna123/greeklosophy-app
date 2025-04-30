import React, { useState, useRef, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Alert,
  Spinner,
  Card,
} from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCourseContext } from "@/context/CourseContext";
import api from "@/api";
import "@/styles/CourseExperience.css";
import { FaCheckCircle } from "react-icons/fa";

interface SubmissionStatusResponse {
  submitted: boolean;
}

interface Submission {
  id: number;
  assignment_id: number;
  user_id: number;
  file_path: string;
  grade: number | null;
  review_comment: string | null;
  submitted_at: string;
  graded_at?: string | null;
  created_at: string;
  updated_at: string;
}

interface SubmissionResponse {
  message: string;
  submission: Submission;
}

const AssignmentSubmission: React.FC = () => {
  const { id: courseId, assignment: assignmentId } = useParams<{
    id: string;
    assignment: string;
  }>();
  const { assignments, quizSubmitted } = useCourseContext();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const formRef = useRef<HTMLFormElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [lastSubmission, setLastSubmission] = useState<Submission | null>(null);

  const assignment = assignments.find((a) => a.id.toString() === assignmentId);

  const { data: submissionStatus, isLoading: loadingStatus } = useQuery<SubmissionStatusResponse>({
    queryKey: ["assignmentSubmissionStatus", courseId, assignmentId],
    queryFn: async () => {
      const res = await api.get<SubmissionStatusResponse>(
        `/courses/${courseId}/assignments/${assignmentId}/submission-status`
      );
      return res.data;
    },
    enabled: !!courseId && !!assignmentId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (submissionStatus?.submitted) {
      setSubmitted(true);
    }
  }, [submissionStatus]);

  const mutation = useMutation<SubmissionResponse, any, FormData>(
    async (formData) => {
      const res = await api.post<SubmissionResponse>(
        `/courses/${courseId}/assignments/${assignmentId}/submit`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return res.data;
    },
    {
      onSuccess: (data) => {
        setSuccessMsg(data.message || "Tarea enviada exitosamente");
        setErrorMsg("");
        setFile(null);
        setSubmitted(true);
        setEditMode(false);
        setLastSubmission(data.submission);
        formRef.current?.reset();

        queryClient.invalidateQueries(["assignmentSubmissionStatus", courseId, assignmentId]);
        queryClient.invalidateQueries(["courseExperienceData", courseId]);
        queryClient.invalidateQueries(["assignmentReviewList"]);
      },
      onError: (error: any) => {
        const errMsg = error.response?.data?.error || "Error al enviar la tarea.";
        setErrorMsg(errMsg);
        setSuccessMsg("");
        queryClient.invalidateQueries(["assignmentSubmissionStatus", courseId, assignmentId]);
      },
    }
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg("Debe seleccionar un archivo.");
      return;
    }
    setErrorMsg("");
    setSuccessMsg("");
    const formData = new FormData();
    formData.append("file", file);
    mutation.mutate(formData);
  };

  const handleEdit = () => {
    setEditMode(true);
    setSubmitted(false);
    setErrorMsg("");
    setSuccessMsg("");
    queryClient.invalidateQueries(["assignmentSubmissionStatus", courseId, assignmentId]);
  };

  return (
    <Container className="course-experience-container">
      <h2 className="mb-4">Entrega de Tarea</h2>

      {!quizSubmitted ? (
        <Alert variant="warning">
          Debes completar el <strong>Quiz</strong> antes de poder entregar la tarea.
        </Alert>
      ) : loadingStatus ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : !assignment ? (
        <Alert variant="warning">
          No se encontró la tarea solicitada o no está asignada.
        </Alert>
      ) : (
        <>
          <Card className="content-area uniform-card mb-4">
            <Card.Body>
              <Card.Title>{assignment.title}</Card.Title>
              <Card.Text>{assignment.description}</Card.Text>
            </Card.Body>
          </Card>

          <Card className="shadow-sm border-0 uniform-card" style={{ backgroundColor: "#fff" }}>
            <Card.Body>
              {submitted && !editMode ? (
                <div>
                  <Alert variant="success" className="d-flex flex-column gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <FaCheckCircle /> La tarea ya fue entregada.
                    </div>
                    {lastSubmission?.file_path && (
                      <a
                        href={lastSubmission.file_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 btn btn-outline-secondary"
                      >
                        Ver archivo entregado
                      </a>
                    )}
                  </Alert>
                  <Button variant="outline-primary" onClick={handleEdit}>
                    Editar Tarea
                  </Button>
                </div>
              ) : (
                <Form ref={formRef} onSubmit={handleSubmit}>
                  {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
                  {successMsg && <Alert variant="success">{successMsg}</Alert>}
                  <Form.Group className="mb-3" controlId="assignmentFile">
                    <Form.Label className="form-label">
                      Seleccione el archivo a entregar
                    </Form.Label>
                    <Form.Control
                      type="file"
                      onChange={handleFileChange}
                      className="form-control"
                    />
                  </Form.Group>
                  <div className="d-grid">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={mutation.isLoading}
                      className="btn-primary"
                    >
                      {mutation.isLoading ? (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      ) : submitted ? "Actualizar Tarea" : "Enviar Tarea"}
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
};

export default AssignmentSubmission;
